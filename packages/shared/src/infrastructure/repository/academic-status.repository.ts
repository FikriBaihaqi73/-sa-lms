import type { PrismaClient } from "#generated/client";
import {
  type AcademicStatusEntity,
  academicStatusSelect,
} from "#selects/academic-status.select";

export interface CreateAcademicStatusInput {
  name: string;
  description?: string;
}

export interface UpdateAcademicStatusInput {
  name?: string;
  description?: string;
}

export class AcademicStatusRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAcademicStatusInput): Promise<AcademicStatusEntity> {
    return this.prisma.academicStatuses.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
      select: academicStatusSelect,
    });
  }

  async findById(id: string): Promise<AcademicStatusEntity | null> {
    return this.prisma.academicStatuses.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: academicStatusSelect,
    });
  }

  async findByName(name: string): Promise<AcademicStatusEntity | null> {
    return this.prisma.academicStatuses.findFirst({
      where: {
        name,
        deleted_at: null,
      },
      select: academicStatusSelect,
    });
  }

  async findAll(): Promise<AcademicStatusEntity[]> {
    return this.prisma.academicStatuses.findMany({
      where: {
        deleted_at: null,
      },
      select: academicStatusSelect,
    });
  }

  async update(
    id: string,
    data: UpdateAcademicStatusInput,
  ): Promise<AcademicStatusEntity> {
    return this.prisma.academicStatuses.update({
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
      select: academicStatusSelect,
    });
  }

  async delete(id: string): Promise<AcademicStatusEntity> {
    return this.prisma.academicStatuses.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: academicStatusSelect,
    });
  }
}
