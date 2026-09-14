import type { ReligionEntity } from "#entities/religions.entity";
import type { PrismaClient } from "#generated/client";
import { religionSelect } from "#selects/religions.select";

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

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<{ data: ReligionEntity[]; meta: any }> {
    const skip = (page - 1) * limit;
    const whereCondition = {
      deleted_at: null,
      ...(search
        ? {
            name: { contains: search, mode: "insensitive" as const },
          }
        : {}),
    };

    const [data, totalData] = await Promise.all([
      this.prisma.religion.findMany({
        where: whereCondition,
        skip,
        take: limit,
        select: religionSelect,
        orderBy: {
          created_at: "desc",
        },
      }),
      this.prisma.religion.count({
        where: whereCondition,
      }),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return {
      data,
      meta: {
        totalData,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
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
