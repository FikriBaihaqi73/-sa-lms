import type { PrismaClient } from "#generated/client";
import {
  type DepartmentEntity,
  departmentSelect,
} from "#selects/departments.select";

export interface CreateDepartmentInput {
  name: string;
  code: string;
}

export interface UpdateDepartmentInput {
  name?: string;
  code?: string;
}

export class DepartmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateDepartmentInput): Promise<DepartmentEntity> {
    return this.prisma.departments.create({
      data: {
        name: data.name,
        code: data.code,
      },
      select: departmentSelect,
    });
  }

  async findById(id: string): Promise<DepartmentEntity | null> {
    return this.prisma.departments.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: departmentSelect,
    });
  }

  async findByName(name: string): Promise<DepartmentEntity | null> {
    return this.prisma.departments.findFirst({
      where: {
        name,
        deleted_at: null,
      },
      select: departmentSelect,
    });
  }

  async findAll(): Promise<DepartmentEntity[]> {
    return this.prisma.departments.findMany({
      where: {
        deleted_at: null,
      },
      select: departmentSelect,
    });
  }

  async update(
    id: string,
    data: UpdateDepartmentInput,
  ): Promise<DepartmentEntity> {
    return this.prisma.departments.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.code !== undefined && {
          code: data.code,
        }),
      },
      select: departmentSelect,
    });
  }

  async delete(id: string): Promise<DepartmentEntity> {
    return this.prisma.departments.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: departmentSelect,
    });
  }
}
