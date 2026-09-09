import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PermissionRepository } from "@repo/shared/infrastructure/repository/permission.repository";
import type {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "@repo/shared/schemas/permission.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PermissionService {
  private readonly permissionRepository: PermissionRepository;

  constructor(private readonly prisma: PrismaService) {
    this.permissionRepository = new PermissionRepository(this.prisma.client);
  }

  async findAll() {
    return this.permissionRepository.findAll();
  }

  async findOne(id: string) {
    const permission = await this.permissionRepository.findById(id);
    if (!permission) {
      throw new NotFoundException("Permission not found");
    }
    return permission;
  }

  async create(dto: CreatePermissionDto) {
    const existing = await this.permissionRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException("Permission name already exists");
    }

    return this.permissionRepository.create({
      name: dto.name,
      module: dto.module,
      ...(dto.description !== undefined && dto.description !== null
        ? { description: dto.description }
        : {}),
    });
  }

  async update(id: string, dto: UpdatePermissionDto) {
    await this.findOne(id);

    if (dto.name !== undefined) {
      const existing = await this.permissionRepository.findByName(dto.name);
      if (existing && existing.id !== id) {
        throw new ConflictException(
          "Permission name already in use by another permission",
        );
      }
    }

    return this.permissionRepository.update(id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.module !== undefined ? { module: dto.module } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.permissionRepository.delete(id);
    return { success: true, id };
  }
}
