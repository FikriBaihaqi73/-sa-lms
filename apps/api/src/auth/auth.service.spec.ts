import { describe, expect, it, jest } from "@jest/globals";
import { ConflictException, ServiceUnavailableException } from "@nestjs/common";
import type { PrismaClient } from "@repo/shared/generated/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";
import { PasswordService } from "./password.service";

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

function createService(options?: {
  usernameExists?: boolean;
  emailExists?: boolean;
  roleExists?: boolean;
  creationFailsWithUniqueConstraint?: boolean;
}) {
  const findUser = jest.fn<() => Promise<typeof user | null>>();
  findUser
    .mockResolvedValueOnce(options?.usernameExists ? user : null)
    .mockResolvedValueOnce(options?.emailExists ? user : null);
  const createUser = jest.fn<() => Promise<typeof user>>(async () => {
    if (options?.creationFailsWithUniqueConstraint) {
      throw Object.assign(new Error("Duplicate user"), { code: "P2002" });
    }

    return user;
  });
  const findRole = jest.fn<() => Promise<typeof role | null>>().mockResolvedValue(
    options?.roleExists === false ? null : role,
  );
  const prisma = {
    users: {
      findFirst: findUser,
      create: createUser,
    },
    role: {
      findFirst: findRole,
    },
  } as unknown as PrismaClient;
  const passwordService = {
    hash: jest.fn<PasswordService["hash"]>().mockResolvedValue("scrypt$hash"),
  } as unknown as PasswordService;
  const prismaService = { client: prisma } as PrismaService;

  return {
    passwordService,
    prisma,
    service: new AuthService(prismaService, passwordService),
  };
}

describe("AuthService", () => {
  const dto = {
    username: "New.User",
    email: "NEW.USER@example.com",
    password: "VeryStrong#Password1",
  };

  it("registers a user with normalized identifiers, a default role, and hashed password", async () => {
    const { passwordService, prisma, service } = createService();

    await expect(service.register(dto)).resolves.toEqual(user);

    expect(passwordService.hash).toHaveBeenCalledWith(dto.password);
    expect(prisma.users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          role_id: role.id,
          username: "new.user",
          email: "new.user@example.com",
          password: "scrypt$hash",
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
});
