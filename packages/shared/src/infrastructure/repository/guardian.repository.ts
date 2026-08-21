import type { PrismaClient } from "#generated/client";
import {
  guardianSelect,
  type GuardianEntity,
} from "#selects/guardian.select";

export interface CreateGuardianInput {
  fullName: string;
  relationship?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  occupation?: string;
}

export interface UpdateGuardianInput {
  fullName?: string;
  relationship?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  occupation?: string;
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

  async findAll(): Promise<GuardianEntity[]> {
    return this.prisma.guardian.findMany({
      where: {
        deletedAt: null,
      },
      select: guardianSelect,
    });
  }

  async update(
    id: string,
    data: UpdateGuardianInput,
  ): Promise<GuardianEntity> {
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