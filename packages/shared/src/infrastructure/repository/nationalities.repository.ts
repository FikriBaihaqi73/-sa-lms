import type { PrismaClient } from "#generated/client";
import {
  type NationalityEntity,
  nationalitySelect,
} from "#selects/nationalities.select";

export interface CreateNationalityInput {
  name: string;
  description?: string;
}

export interface UpdateNationalityInput {
  name?: string;
  description?: string;
}

export class NationalityRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateNationalityInput): Promise<NationalityEntity> {
    return this.prisma.nationality.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
      select: nationalitySelect,
    });
  }

  async findById(id: string): Promise<NationalityEntity | null> {
    return this.prisma.nationality.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: nationalitySelect,
    });
  }

  async findByName(name: string): Promise<NationalityEntity | null> {
    return this.prisma.nationality.findFirst({
      where: {
        name,
        deletedAt: null,
      },
      select: nationalitySelect,
    });
  }

  async findAll(): Promise<NationalityEntity[]> {
    return this.prisma.nationality.findMany({
      where: {
        deletedAt: null,
      },
      select: nationalitySelect,
    });
  }

  async update(
    id: string,
    data: UpdateNationalityInput,
  ): Promise<NationalityEntity> {
    return this.prisma.nationality.update({
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
      select: nationalitySelect,
    });
  }

  async delete(id: string): Promise<NationalityEntity> {
    return this.prisma.nationality.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: nationalitySelect,
    });
  }
}
