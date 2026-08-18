import type { PrismaClient } from "#generated/client";
import {
  type InstitutionLevelEntity,
  institutionLevelSelect,
} from "#selects/institution-level.select";

export interface CreateInstitutionLevelInput {
  name: string;
  description?: string;
}

export interface UpdateInstitutionLevelInput {
  name?: string;
  description?: string;
}

export class InstitutionLevelRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateInstitutionLevelInput,
  ): Promise<InstitutionLevelEntity> {
    return this.prisma.institutionLevel.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
      select: institutionLevelSelect,
    });
  }

  async findById(id: string): Promise<InstitutionLevelEntity | null> {
    return this.prisma.institutionLevel.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: institutionLevelSelect,
    });
  }

  async findByName(name: string): Promise<InstitutionLevelEntity | null> {
    return this.prisma.institutionLevel.findFirst({
      where: {
        name,
        deletedAt: null,
      },
      select: institutionLevelSelect,
    });
  }

  async findAll(): Promise<InstitutionLevelEntity[]> {
    return this.prisma.institutionLevel.findMany({
      where: {
        deletedAt: null,
      },
      select: institutionLevelSelect,
    });
  }

  async update(
    id: string,
    data: UpdateInstitutionLevelInput,
  ): Promise<InstitutionLevelEntity> {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;

    return this.prisma.institutionLevel.update({
      where: { id },
      data: updateData,
      select: institutionLevelSelect,
    });
  }

  async delete(id: string): Promise<InstitutionLevelEntity> {
    return this.prisma.institutionLevel.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: institutionLevelSelect,
    });
  }
}
