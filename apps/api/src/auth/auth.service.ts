import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";
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

const DEFAULT_REGISTRATION_ROLE = "student";
const SCRYPT_COST = 16_384;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const KEY_LENGTH = 64;

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
    const username = dto.username.toLowerCase();
    const email = dto.email.toLowerCase();
    const [userByUsername, userByEmail] = await Promise.all([
      this.authRepository.findUserByUsername(username),
      this.authRepository.findUserByEmail(email),
    ]);

    if (userByUsername || userByEmail) {
      throw new ConflictException("Registration could not be completed");
    }

    const roleName =
      process.env.DEFAULT_REGISTRATION_ROLE ?? DEFAULT_REGISTRATION_ROLE;
    const role = await this.authRepository.findDefaultRole(roleName);
    if (!role) {
      throw new ServiceUnavailableException(
        "Registration is temporarily unavailable",
      );
    }

    const password = await this.hashPassword(dto.password);
    try {
      return await this.authRepository.createUser({
        role_id: role.id,
        username,
        email,
        password,
      });
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
      username: user.username,
      roleId: user.role_id,
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
    const salt = randomBytes(16).toString("base64url");
    const derivedKey = await this.derivePassword(password, salt);

    return [
      "scrypt",
      SCRYPT_COST,
      SCRYPT_BLOCK_SIZE,
      SCRYPT_PARALLELIZATION,
      salt,
      derivedKey.toString("base64url"),
    ].join("$");
  }

  private async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    const [algorithm, cost, blockSize, parallelization, salt, encodedKey] =
      hash.split("$");
    if (
      algorithm !== "scrypt" ||
      cost !== String(SCRYPT_COST) ||
      blockSize !== String(SCRYPT_BLOCK_SIZE) ||
      parallelization !== String(SCRYPT_PARALLELIZATION) ||
      !salt ||
      !encodedKey
    ) {
      return false;
    }

    const expectedKey = Buffer.from(encodedKey, "base64url");
    if (expectedKey.length !== KEY_LENGTH) {
      return false;
    }

    return timingSafeEqual(
      await this.derivePassword(password, salt),
      expectedKey,
    );
  }

  private derivePassword(password: string, salt: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      scrypt(
        password,
        salt,
        KEY_LENGTH,
        {
          N: SCRYPT_COST,
          r: SCRYPT_BLOCK_SIZE,
          p: SCRYPT_PARALLELIZATION,
          maxmem: 64 * 1024 * 1024,
        },
        (error, derivedKey) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(derivedKey);
        },
      );
    });
  }
}
