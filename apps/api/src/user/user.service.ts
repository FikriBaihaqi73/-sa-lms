import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { UserRepository } from "@repo/shared/infrastructure/repository/user.repository";
import type {
  CreateUserDto,
  UpdateUserDto,
} from "@repo/shared/schemas/user.schema";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  private readonly userRepository: UserRepository;

  constructor(private readonly prisma: PrismaService) {
    this.userRepository = new UserRepository(this.prisma.client);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    return this.userRepository.findAll({
      page,
      limit,
      ...(search !== undefined ? { search } : {}),
    });
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    const email = dto.email.toLowerCase();
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictException("User email already exists");
    }

    return this.userRepository.create({
      email,
      password: await this.hashPassword(dto.password),
      ...(dto.is_active !== undefined ? { is_active: dto.is_active } : {}),
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    if (dto.email !== undefined) {
      const email = dto.email.toLowerCase();
      const existing = await this.userRepository.findByEmail(email);
      if (existing && existing.id !== id) {
        throw new ConflictException("User email already in use");
      }
    }

    return this.userRepository.update(id, {
      ...(dto.email !== undefined ? { email: dto.email.toLowerCase() } : {}),
      ...(dto.password !== undefined
        ? { password: await this.hashPassword(dto.password) }
        : {}),
      ...(dto.is_active !== undefined ? { is_active: dto.is_active } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.userRepository.delete(id);
    return { success: true, id };
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
