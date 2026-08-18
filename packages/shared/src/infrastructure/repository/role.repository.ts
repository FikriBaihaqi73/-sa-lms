import type { PrismaClient } from "#generated/client";
import { roleSelect, type RoleEntity } from "#selects/role.select";

export interface CreateRoleInput {
  name: string;
  description?: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
}

export class RoleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateRoleInput): Promise<RoleEntity> {
    return this.prisma.role.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
      select: roleSelect,
    });
  }

  async findById(id: string): Promise<RoleEntity | null> {
    return this.prisma.role.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: roleSelect,
    });
  }

  async findByName(name: string): Promise<RoleEntity | null> {
    return this.prisma.role.findFirst({
      where: {
        name,
        deletedAt: null,
      },
      select: roleSelect,
    });
  }

  async findAll(): Promise<RoleEntity[]> {
    return this.prisma.role.findMany({
      where: {
        deletedAt: null,
      },
      select: roleSelect,
    });
  }

  async update(
    id: string,
    data: UpdateRoleInput,
  ): Promise<RoleEntity> {
    return this.prisma.role.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
      select: roleSelect,
    });
  }

  async delete(id: string): Promise<RoleEntity> {
    return this.prisma.role.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: roleSelect,
    });
  }
}