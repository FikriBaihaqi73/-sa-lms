import {
  ConflictException,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { RoleRepository } from "@repo/shared/infrastructure/repository/role.repository";
import { UserRepository } from "@repo/shared/infrastructure/repository/user.repository";
import type { RegisterDto } from "@repo/shared/schemas/auth.schema";
import { PrismaService } from "../prisma/prisma.service";
import { PasswordService } from "./password.service";

const DEFAULT_REGISTRATION_ROLE = "student";

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
  private readonly roleRepository: RoleRepository;
  private readonly userRepository: UserRepository;

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
  ) {
    this.roleRepository = new RoleRepository(this.prisma.client);
    this.userRepository = new UserRepository(this.prisma.client);
  }

  async register(dto: RegisterDto) {
    const username = dto.username.toLowerCase();
    const email = dto.email.toLowerCase();
    const [userByUsername, userByEmail] = await Promise.all([
      this.userRepository.findByUsername(username),
      this.userRepository.findByEmail(email),
    ]);

    if (userByUsername || userByEmail) {
      throw new ConflictException("Registration could not be completed");
    }

    const roleName =
      process.env.DEFAULT_REGISTRATION_ROLE ?? DEFAULT_REGISTRATION_ROLE;
    const role = await this.roleRepository.findByName(roleName);
    if (!role) {
      throw new ServiceUnavailableException(
        "Registration is temporarily unavailable",
      );
    }

    const password = await this.passwordService.hash(dto.password);
    try {
      return await this.userRepository.create({
        role_id: role.id,
        username,
        email,
        password,
        is_active: true,
      });
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new ConflictException("Registration could not be completed");
      }
      throw error;
    }
  }
}
