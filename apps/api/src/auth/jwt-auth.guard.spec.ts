import type { ExecutionContext } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import type { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "@repo/shared/infrastructure/repository/auth.repository";
import type { PrismaService } from "../prisma/prisma.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

jest.mock("@nestjs/jwt", () => ({
  JwtService: class JwtService {},
}));
jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("JwtAuthGuard", () => {
  const reflector = {
    getAllAndOverride: jest.fn(),
  } as unknown as Reflector;
  const jwtService = {
    verifyAsync: jest.fn(),
  } as unknown as JwtService;
  const guard = new JwtAuthGuard(reflector, jwtService, {} as PrismaService);

  const createContext = (authorization?: string): ExecutionContext => {
    const request = { headers: { authorization } };
    return {
      getClass: jest.fn(),
      getHandler: jest.fn(),
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("allows endpoints marked as public", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(true);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it("rejects a protected endpoint without a bearer token", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);

    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("adds a verified payload to a protected request", async () => {
    const payload = {
      sub: "user-id",
      email: "jane.doe@example.com",
      iat: 1,
      exp: 2,
    };
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
    jest.spyOn(jwtService, "verifyAsync").mockResolvedValue(payload);
    jest
      .spyOn(AuthRepository.prototype, "findActiveUserByAccessToken")
      .mockResolvedValue({ id: "user-id" } as never);
    const context = createContext("Bearer valid-token");

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith("valid-token");
    expect(context.switchToHttp().getRequest()).toMatchObject({
      user: payload,
    });
  });

  it("rejects a valid JWT that has been revoked", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
    jest.spyOn(jwtService, "verifyAsync").mockResolvedValue({
      sub: "user-id",
      email: "jane.doe@example.com",
      iat: 1,
      exp: 2,
    });
    jest
      .spyOn(AuthRepository.prototype, "findActiveUserByAccessToken")
      .mockResolvedValue(null);

    await expect(
      guard.canActivate(createContext("Bearer revoked-token")),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rejects an invalid token", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
    jest
      .spyOn(jwtService, "verifyAsync")
      .mockRejectedValue(new Error("invalid token"));

    await expect(
      guard.canActivate(createContext("Bearer invalid-token")),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
