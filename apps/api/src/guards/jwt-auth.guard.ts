import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import { IS_PUBLIC_KEY } from "../auth/public.decorator";

export interface AuthenticatedUser {
  sub: string;
  username: string;
  roleId: string;
}

export type AuthenticatedRequest = Request & {
  user: AuthenticatedUser;
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const authorization = request.headers.authorization;
    const [scheme, token, ...extraParts] = authorization?.split(" ") ?? [];

    if (scheme !== "Bearer" || !token || extraParts.length > 0) {
      throw new UnauthorizedException("Invalid authorization format");
    }

    try {
      request.user = await this.jwtService.verifyAsync<AuthenticatedUser>(
        token,
      );
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}