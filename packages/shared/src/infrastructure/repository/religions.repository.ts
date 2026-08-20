import type { PrismaClient } from "#generated/client";
import { type ReligionEntity, religionSelect } from "#selects/religions.select";

export interface CreateReligionInput {
  name: string;
}

export interface UpdateReligionInput {
  name?: string;
}

export class ReligionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateReligionInput): Promise<ReligionEntity> {
    return this.prisma.religion.create({
      data: {
        name: data.name,
      },
      select: religionSelect,
    });
  }

  async findById(id: string): Promise<ReligionEntity | null> {
    return this.prisma.religion.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: religionSelect,
    });
  }

  async findByName(name: string): Promise<ReligionEntity | null> {
    return this.prisma.religion.findFirst({
      where: {
        name,
        deleted_at: null,
      },
      select: religionSelect,
    });
  }

  async findAll(): Promise<ReligionEntity[]> {
    return this.prisma.religion.findMany({
      where: {
        deleted_at: null,
      },
      select: religionSelect,
    });
  }

  async update(id: string, data: UpdateReligionInput): Promise<ReligionEntity> {
    return this.prisma.religion.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
      },
      select: religionSelect,
    });
  }

  async delete(id: string): Promise<ReligionEntity> {
    return this.prisma.religion.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: religionSelect,
    });
  }
}
