import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@repo/shared/infrastructure/repository/user.repository";
import type {
  CreateUserDto,
  UpdateUserDto,
} from "@repo/shared/schemas/user.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class UserService {
  private userRepository: UserRepository;

  constructor(private readonly prisma: PrismaService) {
    this.userRepository = new UserRepository(this.prisma.client);
  }

  async findAll() {
    return this.userRepository.findAll();
  }

  async findOne(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async create(dto: CreateUserDto) {
    return this.userRepository.create({
      role_id: dto.role_id,
      username: dto.username,
      password: dto.password,
      is_active: dto.is_active,
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.userRepository.update(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.userRepository.delete(id);
    return { success: true, id };
  }
}
