import type { PrismaClient } from "#generated/client";
import {
  type InstitutionEntity,
  institutionSelect,
} from "#selects/institution.select";

export interface CreateInstitutionInput {
  institutionLevelId: string;
  name: string;
  shortName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
}

export interface UpdateInstitutionInput {
  institutionLevelId?: string;
  name?: string;
  shortName?: string;
  address?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  logoUrl?: string;
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

  async findAll(): Promise<InstitutionEntity[]> {
    return this.prisma.institution.findMany({
      where: {
        deletedAt: null,
      },
      select: institutionSelect,
    });
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
