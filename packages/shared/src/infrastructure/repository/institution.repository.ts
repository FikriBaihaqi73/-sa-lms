import type { Prisma, PrismaClient } from "#generated/client";
import {
  type InstitutionEntity,
  institutionSelect,
} from "#selects/institution.select";

export interface CreateInstitutionInput {
  institutionLevelId: string;
  name: string;
  shortName?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  province?: string | undefined;
  postalCode?: string | undefined;
  phoneNumber?: string | undefined;
  email?: string | undefined;
  website?: string | undefined;
  logoUrl?: string | undefined;
}

export interface UpdateInstitutionInput {
  institutionLevelId?: string | undefined;
  name?: string | undefined;
  shortName?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  province?: string | undefined;
  postalCode?: string | undefined;
  phoneNumber?: string | undefined;
  email?: string | undefined;
  website?: string | undefined;
  logoUrl?: string | undefined;
}

export interface InstitutionSearchInput {
  search?: string | undefined;
}

export class InstitutionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateInstitutionInput): Promise<InstitutionEntity> {
    return this.prisma.institution.create({
      data: {
        institutionLevelId: data.institutionLevelId,
        name: data.name,
        shortName: data.shortName ?? null,
        address: data.address ?? null,
        city: data.city ?? null,
        province: data.province ?? null,
        postalCode: data.postalCode ?? null,
        phoneNumber: data.phoneNumber ?? null,
        email: data.email ?? null,
        website: data.website ?? null,
        logoUrl: data.logoUrl ?? null,
      },
      select: institutionSelect,
    });
  }

  async findById(id: string): Promise<InstitutionEntity | null> {
    return this.prisma.institution.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: institutionSelect,
    });
  }

  async findAll(
    page: number,
    limit: number,
    filters?: InstitutionSearchInput,
  ): Promise<{
    data: InstitutionEntity[];
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
            name: {
              contains: filters.search,
              mode: "insensitive",
            },
          }
        : {}),
    } satisfies Prisma.InstitutionWhereInput;

    const [data, totalData] = await Promise.all([
      this.prisma.institution.findMany({
        where,
        skip,
        take: limit,
        select: institutionSelect,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.institution.count({
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

  async update(
    id: string,
    data: UpdateInstitutionInput,
  ): Promise<InstitutionEntity> {
    return this.prisma.institution.update({
      where: {
        id,
      },
      data: {
        ...(data.institutionLevelId !== undefined && {
          institutionLevelId: data.institutionLevelId,
        }),
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.shortName !== undefined && {
          shortName: data.shortName ?? null,
        }),
        ...(data.address !== undefined && {
          address: data.address ?? null,
        }),
        ...(data.city !== undefined && {
          city: data.city ?? null,
        }),
        ...(data.province !== undefined && {
          province: data.province ?? null,
        }),
        ...(data.postalCode !== undefined && {
          postalCode: data.postalCode ?? null,
        }),
        ...(data.phoneNumber !== undefined && {
          phoneNumber: data.phoneNumber ?? null,
        }),
        ...(data.email !== undefined && {
          email: data.email ?? null,
        }),
        ...(data.website !== undefined && {
          website: data.website ?? null,
        }),
        ...(data.logoUrl !== undefined && {
          logoUrl: data.logoUrl ?? null,
        }),
      },
      select: institutionSelect,
    });
  }

  async delete(id: string): Promise<InstitutionEntity> {
    return this.prisma.institution.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: institutionSelect,
    });
  }
}
