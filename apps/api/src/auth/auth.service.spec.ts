import { ConflictException } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "@repo/shared/infrastructure/repository/auth.repository";
import type { RegisterDto } from "@repo/shared/schemas/auth.schema";
import type { RoleEntity } from "@repo/shared/selects/role.select";
import type { UserEntity } from "@repo/shared/selects/user.select";
import type { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

jest.mock("@nestjs/jwt", () => ({
  JwtService: class JwtService {},
}));

const now = new Date("2026-09-11T00:00:00.000Z");

const role: RoleEntity = {
  id: "role-id",
  name: "student",
  description: "Student",
  createdAt: now,
  updatedAt: now,
};

const user: UserEntity = {
  id: "user-id",
  role_id: "role-id",
  username: "jane",
  email: "jane@example.com",
  access_token: null,
  is_active: true,
  last_login: null,
  created_at: now,
  updated_at: now,
  deleted_at: null,
};

const userWithToken: UserEntity = {
  ...user,
  access_token: "signed-token",
};

const authUser = {
  id: user.id,
  role_id: user.role_id,
  username: user.username,
  email: user.email,
  is_active: user.is_active,
  last_login: user.last_login,
  created_at: user.created_at,
  updated_at: user.updated_at,
  deleted_at: user.deleted_at,
};

const registerDto: RegisterDto = {
  username: "Jane",
  email: "Jane@Example.com",
  password: "Password123",
};

describe("AuthService", () => {
  let jwtService: jest.Mocked<Pick<JwtService, "signAsync">>;
  let service: AuthService;

  beforeEach(() => {
    jest.restoreAllMocks();
    jwtService = {
      signAsync: jest.fn().mockResolvedValue("signed-token"),
    };
    service = new AuthService(
      { client: {} } as PrismaService,
      jwtService as JwtService,
    );

    jest
      .spyOn(AuthRepository.prototype, "findUserByUsername")
      .mockResolvedValue(null);
    jest
      .spyOn(AuthRepository.prototype, "findUserByEmail")
      .mockResolvedValue(null);
    jest
      .spyOn(AuthRepository.prototype, "findDefaultRole")
      .mockResolvedValue(role);
    jest
      .spyOn(AuthRepository.prototype, "upsertDefaultRole")
      .mockResolvedValue(role);
    jest.spyOn(AuthRepository.prototype, "createUser").mockResolvedValue(user);
    jest
      .spyOn(AuthRepository.prototype, "updateAccessToken")
      .mockResolvedValue(userWithToken);
  });

  it("registers a user and returns a bearer token without exposing the stored token on user", async () => {
    const result = await service.register(registerDto);

    expect(AuthRepository.prototype.createUser).toHaveBeenCalledWith(
      expect.objectContaining({
        role_id: "role-id",
        username: "jane",
        email: "jane@example.com",
      }),
    );
    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: "user-id",
      username: "jane",
      roleId: "role-id",
    });
    expect(result).toEqual({
      accessToken: "signed-token",
      tokenType: "Bearer",
      expiresIn: 900,
      user: authUser,
    });
  });

  it("creates the default registration role when it does not exist", async () => {
    jest
      .spyOn(AuthRepository.prototype, "findDefaultRole")
      .mockResolvedValue(null);

    await service.register(registerDto);

    expect(AuthRepository.prototype.upsertDefaultRole).toHaveBeenCalledWith(
      "student",
    );
  });

  it("rejects duplicate registration attempts with a generic conflict", async () => {
    jest
      .spyOn(AuthRepository.prototype, "findUserByEmail")
      .mockResolvedValue(user);

    await expect(service.register(registerDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(AuthRepository.prototype.createUser).not.toHaveBeenCalled();
  });
});
