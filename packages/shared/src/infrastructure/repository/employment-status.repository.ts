import type { PrismaClient } from "#generated/client";
import {
  type EmploymentStatusEntity,
  employmentStatusSelect,
} from "#selects/employment-status.select";

export interface CreateEmploymentStatusInput {
  name: string;
  description?: string;
}

export interface UpdateEmploymentStatusInput {
  name?: string;
  description?: string;
}

export class EmploymentStatusRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateEmploymentStatusInput,
  ): Promise<EmploymentStatusEntity> {
    return this.prisma.employmentStatus.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
      select: employmentStatusSelect,
    });
  }

  async findById(id: string): Promise<EmploymentStatusEntity | null> {
    return this.prisma.employmentStatus.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: employmentStatusSelect,
    });
  }

  async findByName(name: string): Promise<EmploymentStatusEntity | null> {
    return this.prisma.employmentStatus.findFirst({
      where: {
        name,
        deletedAt: null,
      },
      select: employmentStatusSelect,
    });
  }

  async findAll(): Promise<EmploymentStatusEntity[]> {
    return this.prisma.employmentStatus.findMany({
      where: {
        deletedAt: null,
      },
      select: employmentStatusSelect,
    });
  }

  async update(
    id: string,
    data: UpdateEmploymentStatusInput,
  ): Promise<EmploymentStatusEntity> {
    return this.prisma.employmentStatus.update({
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
      select: employmentStatusSelect,
    });
  }

  async delete(id: string): Promise<EmploymentStatusEntity> {
    return this.prisma.employmentStatus.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: employmentStatusSelect,
    });
  }
}
