import type { Prisma, PrismaClient } from "#generated/client";
import { type GuardianEntity, guardianSelect } from "#selects/guardian.select";

export interface CreateGuardianInput {
  fullName: string;
  relationship?: string | undefined;
  phoneNumber?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
  occupation?: string | undefined;
}

export interface UpdateGuardianInput {
  fullName?: string | undefined;
  relationship?: string | undefined;
  phoneNumber?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
  occupation?: string | undefined;
}

export interface GuardianSearchInput {
  search?: string | undefined;
}

export class GuardianRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateGuardianInput): Promise<GuardianEntity> {
    return this.prisma.guardian.create({
      data: {
        fullName: data.fullName,
        ...(data.relationship !== undefined && {
          relationship: data.relationship,
        }),
        ...(data.phoneNumber !== undefined && {
          phoneNumber: data.phoneNumber,
        }),
        ...(data.email !== undefined && {
          email: data.email,
        }),
        ...(data.address !== undefined && {
          address: data.address,
        }),
        ...(data.occupation !== undefined && {
          occupation: data.occupation,
        }),
      },
      select: guardianSelect,
    });
  }

  async findById(id: string): Promise<GuardianEntity | null> {
    return this.prisma.guardian.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: guardianSelect,
    });
  }

  async findAll(
    page: number,
    limit: number,
    filters?: GuardianSearchInput,
  ): Promise<{
    data: GuardianEntity[];
    meta: {
      totalData: number;
      totalPages: number;
      currentPage: number;
      perPage: number;
    };
  }> {
    const skip = (page - 1) * limit;
    const where = {
      deletedAt: null,
      ...(filters?.search
        ? {
            fullName: {
              contains: filters.search,
              mode: "insensitive",
            },
          }
        : {}),
    } satisfies Prisma.GuardianWhereInput;

    const [data, totalData] = await Promise.all([
      this.prisma.guardian.findMany({
        where,
        skip,
        take: limit,
        select: guardianSelect,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.guardian.count({
        where,
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

  async update(id: string, data: UpdateGuardianInput): Promise<GuardianEntity> {
    return this.prisma.guardian.update({
      where: {
        id,
      },
      data: {
        ...(data.fullName !== undefined && {
          fullName: data.fullName,
        }),
        ...(data.relationship !== undefined && {
          relationship: data.relationship,
        }),
        ...(data.phoneNumber !== undefined && {
          phoneNumber: data.phoneNumber,
        }),
        ...(data.email !== undefined && {
          email: data.email,
        }),
        ...(data.address !== undefined && {
          address: data.address,
        }),
        ...(data.occupation !== undefined && {
          occupation: data.occupation,
        }),
      },
      select: guardianSelect,
    });
  }

  async delete(id: string): Promise<GuardianEntity> {
    return this.prisma.guardian.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: guardianSelect,
    });
  }
}
