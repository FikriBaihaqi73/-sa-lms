import { scryptSync } from "node:crypto";
import { describe, expect, it, jest } from "@jest/globals";
import {
  ConflictException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import type { PrismaClient } from "@repo/shared/generated/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";

jest.mock("@nestjs/jwt", () => ({
  JwtService: class JwtService {},
}));

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

const role = {
  id: "21db8764-79ad-4c42-a2a4-5f6f219f0f47",
  name: "student",
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const user = {
  id: "d6b76be2-22e6-42e3-a1bb-50875650ed39",
  role_id: role.id,
  username: "new.user",
  email: "new.user@example.com",
  is_active: true,
  last_login: null,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};

const userWithPassword = {
  ...user,
  password: `scrypt$16384$8$1$salt$${scryptSync("password", "salt", 64, {
    N: 16_384,
    r: 8,
    p: 1,
    maxmem: 64 * 1024 * 1024,
  }).toString("base64url")}`,
};

function createService(options?: {
  usernameExists?: boolean;
  emailExists?: boolean;
  roleExists?: boolean;
  creationFailsWithUniqueConstraint?: boolean;
  loginOnly?: boolean;
  loginUser?: boolean;
  loginUserActive?: boolean;
}) {
  const findUser = jest.fn<() => Promise<typeof userWithPassword | null>>();
  if (options?.loginOnly) {
    findUser.mockResolvedValue(
      options.loginUser === false
        ? null
        : { ...userWithPassword, is_active: options?.loginUserActive ?? true },
    );
  } else {
    findUser
      .mockResolvedValueOnce(options?.usernameExists ? userWithPassword : null)
      .mockResolvedValueOnce(options?.emailExists ? userWithPassword : null)
      .mockResolvedValue(
        options?.loginUser === false ? null : userWithPassword,
      );
  }
  const createUser = jest.fn<() => Promise<typeof user>>(async () => {
    if (options?.creationFailsWithUniqueConstraint) {
      throw Object.assign(new Error("Duplicate user"), { code: "P2002" });
    }

    return user;
  });
  const updateUser = jest
    .fn<() => Promise<typeof user>>()
    .mockResolvedValue(user);
  const findRole = jest
    .fn<() => Promise<typeof role | null>>()
    .mockResolvedValue(options?.roleExists === false ? null : role);
  const prisma = {
    users: {
      findFirst: findUser,
      create: createUser,
      update: updateUser,
    },
    role: {
      findFirst: findRole,
    },
  } as unknown as PrismaClient;
  const jwtService = {
    signAsync: jest
      .fn<JwtService["signAsync"]>()
      .mockResolvedValue("access-token"),
  } as unknown as JwtService;
  const prismaService = { client: prisma } as PrismaService;

  return {
    prisma,
    jwtService,
    service: new AuthService(prismaService, jwtService),
  };
}

describe("AuthService", () => {
  const dto = {
    username: "New.User",
    email: "NEW.USER@example.com",
    password: "VeryStrong#Password1",
  };

  it("registers a user with normalized identifiers, a default role, and hashed password", async () => {
    const { prisma, service } = createService();

    await expect(service.register(dto)).resolves.toEqual(user);

    expect(prisma.users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          role_id: role.id,
          username: "new.user",
          email: "new.user@example.com",
          password: expect.stringMatching(/^scrypt\$16384\$8\$1\$/),
          is_active: true,
        },
      }),
    );
  });

  it("rejects registration when a username already exists", async () => {
    const { service } = createService({ usernameExists: true });

    await expect(service.register(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("rejects registration when an email already exists", async () => {
    const { service } = createService({ emailExists: true });

    await expect(service.register(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("does not create an account when the default role is unavailable", async () => {
    const { prisma, service } = createService({ roleExists: false });

    await expect(service.register(dto)).rejects.toBeInstanceOf(
      ServiceUnavailableException,
    );
    expect(prisma.users.create).not.toHaveBeenCalled();
  });

  it("returns a generic conflict when the database detects a concurrent duplicate", async () => {
    const { service } = createService({
      creationFailsWithUniqueConstraint: true,
    });

    await expect(service.register(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it("logs in an active user and returns a Bearer access token", async () => {
    const { jwtService, prisma, service } = createService({
      loginOnly: true,
    });

    await expect(
      service.login({ username: "New.User", password: "password" }),
    ).resolves.toEqual(
      expect.objectContaining({
        accessToken: "access-token",
        tokenType: "Bearer",
        expiresIn: 900,
        user,
      }),
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: user.id,
      username: user.username,
      roleId: user.role_id,
    });
    expect(prisma.users.update).toHaveBeenCalled();
  });

  it("returns a generic unauthorized error when the account does not exist", async () => {
    const { service } = createService({ loginOnly: true, loginUser: false });

    await expect(
      service.login({ username: "unknown", password: "password" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("returns a generic unauthorized error when the password is invalid", async () => {
    const { service } = createService({ loginOnly: true });

    await expect(
      service.login({ username: "new.user", password: "invalid" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("returns a generic unauthorized error without verifying an inactive account", async () => {
    const { prisma, service } = createService({
      loginOnly: true,
      loginUserActive: false,
    });

    await expect(
      service.login({ username: "new.user", password: "password" }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(prisma.users.update).not.toHaveBeenCalled();
  });
});
