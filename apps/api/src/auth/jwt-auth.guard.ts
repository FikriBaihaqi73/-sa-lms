import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";

export interface JwtPayload {
  sub: string;
  username: string;
  roleId: string;
  iat?: number;
  exp?: number;
}

type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("Authentication token is required");
    }

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      if (
        typeof payload.sub !== "string" ||
        typeof payload.username !== "string" ||
        typeof payload.roleId !== "string"
      ) {
        throw new UnauthorizedException("Invalid authentication token");
      }

      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException(
        "Invalid or expired authentication token",
      );
    }
  }

  private extractToken(request: Request): string | null {
    const authorization = request.headers.authorization;
    if (!authorization) {
      return null;
    }

    const match = authorization.match(/^Bearer\s+(.+)$/i);
    return match?.[1]?.trim() || null;
  }
}
