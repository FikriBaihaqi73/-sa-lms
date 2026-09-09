import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PermissionRepository } from "@repo/shared/infrastructure/repository/permission.repository";
import { RoleRepository } from "@repo/shared/infrastructure/repository/role.repository";
import { RolePermissionRepository } from "@repo/shared/infrastructure/repository/role-permission.repository";
import type {
  CreateRolePermissionDto,
  UpdateRolePermissionDto,
} from "@repo/shared/schemas/role-permission.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class RolePermissionService {
  private readonly permissionRepository: PermissionRepository;
  private readonly rolePermissionRepository: RolePermissionRepository;
  private readonly roleRepository: RoleRepository;

  constructor(private readonly prisma: PrismaService) {
    this.permissionRepository = new PermissionRepository(this.prisma.client);
    this.rolePermissionRepository = new RolePermissionRepository(
      this.prisma.client,
    );
    this.roleRepository = new RoleRepository(this.prisma.client);
  }

  async findAll() {
    return this.rolePermissionRepository.findAll();
  }

  async findOne(id: string) {
    const rolePermission = await this.rolePermissionRepository.findById(id);
    if (!rolePermission) {
      throw new NotFoundException("Role permission not found");
    }
    return rolePermission;
  }

  async create(dto: CreateRolePermissionDto) {
    await this.ensureRoleExists(dto.roleId);
    await this.ensurePermissionExists(dto.permissionId);
    await this.ensureAssignmentDoesNotExist(dto.roleId, dto.permissionId);

    return this.rolePermissionRepository.create({
      roleId: dto.roleId,
      permissionId: dto.permissionId,
    });
  }

  async update(id: string, dto: UpdateRolePermissionDto) {
    const current = await this.findOne(id);
    const roleId = dto.roleId ?? current.roleId;
    const permissionId = dto.permissionId ?? current.permissionId;

    await this.ensureRoleExists(roleId);
    await this.ensurePermissionExists(permissionId);
    const existing =
      await this.rolePermissionRepository.findByRoleAndPermission(
        roleId,
        permissionId,
      );
    if (existing && existing.id !== id) {
      throw new ConflictException("Role permission assignment already exists");
    }

    return this.rolePermissionRepository.update(id, {
      ...(dto.roleId !== undefined ? { roleId: dto.roleId } : {}),
      ...(dto.permissionId !== undefined
        ? { permissionId: dto.permissionId }
        : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.rolePermissionRepository.delete(id);
    return { success: true, id };
  }

  private async ensureRoleExists(roleId: string) {
    const role = await this.roleRepository.findById(roleId);
    if (!role) {
      throw new NotFoundException("Role not found");
    }
  }

  private async ensurePermissionExists(permissionId: string) {
    const permission = await this.permissionRepository.findById(permissionId);
    if (!permission) {
      throw new NotFoundException("Permission not found");
    }
  }

  private async ensureAssignmentDoesNotExist(
    roleId: string,
    permissionId: string,
  ) {
    const existing =
      await this.rolePermissionRepository.findByRoleAndPermission(
        roleId,
        permissionId,
      );
    if (existing) {
      throw new ConflictException("Role permission assignment already exists");
    }
  }
}
