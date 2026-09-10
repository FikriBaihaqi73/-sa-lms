import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import type { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { JwtAuthGuard, JwtPayload } from "./jwt-auth.guard";

jest.mock("@nestjs/jwt", () => ({ JwtService: class JwtService {} }), {
  virtual: true,
});

type RequestWithUser = Request & { user?: JwtPayload };

function createContext(request: RequestWithUser): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  } as unknown as ExecutionContext;
}

describe("JwtAuthGuard", () => {
  it("rejects requests without a bearer token", async () => {
    const verifyAsync = jest.fn();
    const guard = new JwtAuthGuard({ verifyAsync } as unknown as JwtService);
    const request = { headers: {} } as RequestWithUser;

    await expect(
      guard.canActivate(createContext(request)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    expect(verifyAsync).not.toHaveBeenCalled();
  });

  it("verifies a bearer token and attaches its payload to the request", async () => {
    const payload: JwtPayload = {
      sub: "user-id",
      username: "admin",
      roleId: "role-id",
    };
    const verifyAsync = jest.fn().mockResolvedValue(payload);
    const guard = new JwtAuthGuard({ verifyAsync } as unknown as JwtService);
    const request = {
      headers: { authorization: "Bearer valid-token" },
    } as RequestWithUser;

    await expect(guard.canActivate(createContext(request))).resolves.toBe(true);
    expect(verifyAsync).toHaveBeenCalledWith("valid-token");
    expect(request.user).toEqual(payload);
  });

  it("rejects invalid, expired, or incomplete tokens", async () => {
    const verifyAsync = jest
      .fn()
      .mockRejectedValueOnce(new Error("expired"))
      .mockResolvedValueOnce({ sub: "user-id" });
    const guard = new JwtAuthGuard({ verifyAsync } as unknown as JwtService);
    const request = {
      headers: { authorization: "Bearer invalid-token" },
    } as RequestWithUser;

    await expect(
      guard.canActivate(createContext(request)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
    request.headers.authorization = "Bearer incomplete-token";
    await expect(
      guard.canActivate(createContext(request)),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
