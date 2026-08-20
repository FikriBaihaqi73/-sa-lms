import type { PrismaClient } from "#generated/client";
import {
  type RolePermissionEntity,
  rolePermissionSelect,
} from "#selects/role-permission.select";

export interface CreateRolePermissionInput {
  roleId: string;
  permissionId: string;
}

export interface UpdateRolePermissionInput {
  roleId?: string;
  permissionId?: string;
}

export class RolePermissionRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateRolePermissionInput): Promise<RolePermissionEntity> {
    return this.prisma.rolePermission.create({
      data: {
        roleId: data.roleId,
        permissionId: data.permissionId,
      },
      select: rolePermissionSelect,
    });
  }

  async findById(id: string): Promise<RolePermissionEntity | null> {
    return this.prisma.rolePermission.findUnique({
      where: { id },
      select: rolePermissionSelect,
    });
  }

  async findAll(): Promise<RolePermissionEntity[]> {
    return this.prisma.rolePermission.findMany({
      where: { deletedAt: null },
      select: rolePermissionSelect,
    });
  }

  async findByRoleId(roleId: string): Promise<RolePermissionEntity[]> {
    return this.prisma.rolePermission.findMany({
      where: { roleId, deletedAt: null },
      select: rolePermissionSelect,
    });
  }

  async findByPermissionId(
    permissionId: string,
  ): Promise<RolePermissionEntity[]> {
    return this.prisma.rolePermission.findMany({
      where: { permissionId, deletedAt: null },
      select: rolePermissionSelect,
    });
  }

  async update(
    id: string,
    data: UpdateRolePermissionInput,
  ): Promise<RolePermissionEntity> {
    return this.prisma.rolePermission.update({
      where: { id },
      data,
      select: rolePermissionSelect,
    });
  }

  async delete(id: string): Promise<RolePermissionEntity> {
    return this.prisma.rolePermission.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: rolePermissionSelect,
    });
  }
}
