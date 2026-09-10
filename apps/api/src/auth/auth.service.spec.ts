import { UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "@repo/shared/infrastructure/repository/auth.repository";
import type { PrismaService } from "../prisma/prisma.service";
import { AuthService } from "./auth.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));
jest.mock("@nestjs/jwt", () => ({ JwtService: class JwtService {} }));

describe("AuthService logout", () => {
  const accessToken = "valid-access-token";
  let jwtService: jest.Mocked<Pick<JwtService, "verifyAsync">>;
  let service: AuthService;

  beforeEach(() => {
    jwtService = { verifyAsync: jest.fn() };
    service = new AuthService({} as PrismaService, jwtService as JwtService);
  });

  afterEach(() => jest.restoreAllMocks());

  it("rejects a request without a Bearer token", async () => {
    await expect(service.logout()).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it("rejects an invalid or expired token", async () => {
    jwtService.verifyAsync.mockRejectedValue(new Error("expired"));

    await expect(
      service.logout(`Bearer ${accessToken}`),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("revokes a verified token that belongs to an active user", async () => {
    jwtService.verifyAsync.mockResolvedValue({ sub: "user-id" });
    jest
      .spyOn(AuthRepository.prototype, "findActiveUserByAccessToken")
      .mockResolvedValue({ id: "user-id" } as never);
    const clearAccessToken = jest
      .spyOn(AuthRepository.prototype, "clearAccessToken")
      .mockResolvedValue({ id: "user-id" } as never);

    await expect(service.logout(`Bearer ${accessToken}`)).resolves.toEqual({
      success: true,
    });
    expect(clearAccessToken).toHaveBeenCalledWith("user-id");
  });
});
