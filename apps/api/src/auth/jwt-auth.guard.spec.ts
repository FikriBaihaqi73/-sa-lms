import type { ExecutionContext } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { JwtAuthGuard } from "./jwt-auth.guard";

jest.mock("@nestjs/jwt", () => ({
  JwtService: class JwtService {},
}));

interface RequestWithUser extends Request {
  user?: {
    sub: string;
    username: string;
    roleId: string;
  };
}

function createContext(request: RequestWithUser): ExecutionContext {
  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: jest.fn(() => ({
      getRequest: jest.fn(() => request),
    })),
  } as unknown as ExecutionContext;
}

describe("JwtAuthGuard", () => {
  let jwtService: jest.Mocked<Pick<JwtService, "verifyAsync">>;
  let reflector: jest.Mocked<Pick<Reflector, "getAllAndOverride">>;
  let guard: JwtAuthGuard;

  beforeEach(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    };
    reflector = {
      getAllAndOverride: jest.fn(),
    };
    guard = new JwtAuthGuard(jwtService as JwtService, reflector as Reflector);
  });

  it("allows public routes without a token", async () => {
    reflector.getAllAndOverride.mockReturnValue(true);

    await expect(guard.canActivate(createContext({} as Request))).resolves.toBe(
      true,
    );
    expect(jwtService.verifyAsync).not.toHaveBeenCalled();
  });

  it("rejects protected routes without a bearer token", async () => {
    reflector.getAllAndOverride.mockReturnValue(false);

    await expect(
      guard.canActivate(createContext({ headers: {} } as RequestWithUser)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rejects invalid bearer tokens", async () => {
    reflector.getAllAndOverride.mockReturnValue(false);
    jwtService.verifyAsync.mockRejectedValue(new Error("invalid token"));

    await expect(
      guard.canActivate(
        createContext({
          headers: { authorization: "Bearer invalid-token" },
        } as RequestWithUser),
      ),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("attaches the jwt payload to valid protected requests", async () => {
    const request = {
      headers: { authorization: "Bearer valid-token" },
    } as RequestWithUser;
    const payload = {
      sub: "user-id",
      username: "student",
      roleId: "role-id",
    };

    reflector.getAllAndOverride.mockReturnValue(false);
    jwtService.verifyAsync.mockResolvedValue(payload);

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(jwtService.verifyAsync).toHaveBeenCalledWith("valid-token");
    expect(request.user).toEqual(payload);
  });
});
