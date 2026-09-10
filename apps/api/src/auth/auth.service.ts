import * as bcrypt from "bcrypt";
import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthRepository } from "@repo/shared/infrastructure/repository/auth.repository";
import type { LoginDto, RegisterDto } from "@repo/shared/schemas/auth.schema";
import { PrismaService } from "../prisma/prisma.service";

interface AccessTokenPayload {
  sub?: unknown;
}

function isUniqueConstraintViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

@Injectable()
export class AuthService {
  private readonly authRepository: AuthRepository;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.authRepository = new AuthRepository(this.prisma.client);
  }

  async register(dto: RegisterDto) {
    const email = dto.email.toLowerCase();
    const userByEmail = await this.authRepository.findUserByEmail(email);

    if (userByEmail) {
      throw new ConflictException("Registration could not be completed (email in use)");
    }

    const password = await this.hashPassword(dto.password);

    try {
      if (dto.role === "student") {
        return await this.authRepository.createUser({
          email,
          password,
        });
      } else if (dto.role === "instansi") {
        const roleName = process.env.DEFAULT_INSTITUTION_ADMIN_ROLE ?? "admin";
        const role = await this.authRepository.findDefaultRole(roleName);
        if (!role) {
          throw new ServiceUnavailableException("Registration is temporarily unavailable (missing default admin role)");
        }
        
        return await this.authRepository.registerInstitutionOwner(
          { email, password },
          dto.institutionName as string,
          role.id
        );
      }
      throw new ConflictException("Invalid registration role");
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException("Registration could not be completed");
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();
    const user = await this.authRepository.findLoginUser(email);
    if (
      !user ||
      !user.is_active ||
      !(await this.verifyPassword(dto.password, user.password))
    ) {
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.authRepository.updateLastLogin(user.id);
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });
    const updatedUser = await this.authRepository.updateAccessToken(
      user.id,
      accessToken,
    );

    return {
      accessToken,
      tokenType: "Bearer",
      expiresIn: 900,
      user: updatedUser,
    };
  }

  async logout(authorization?: string) {
    const accessToken = this.extractAccessToken(authorization);
    let payload: AccessTokenPayload;
    try {
      payload =
        await this.jwtService.verifyAsync<AccessTokenPayload>(accessToken);
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }

    if (typeof payload.sub !== "string") {
      throw new UnauthorizedException("Invalid access token");
    }

    const user = await this.authRepository.findActiveUserByAccessToken(
      payload.sub,
      accessToken,
    );
    if (!user) {
      throw new UnauthorizedException("Invalid access token");
    }

    await this.authRepository.clearAccessToken(user.id);
    return { success: true };
  }

  private extractAccessToken(authorization?: string): string {
    if (!authorization) {
      throw new UnauthorizedException("Invalid access token");
    }

    const [scheme, accessToken, ...remaining] = authorization.split(" ");
    if (
      !scheme ||
      scheme.toLowerCase() !== "bearer" ||
      !accessToken ||
      remaining.length > 0
    ) {
      throw new UnauthorizedException("Invalid access token");
    }
    return accessToken;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
