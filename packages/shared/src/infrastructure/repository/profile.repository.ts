import type { PrismaClient } from "#generated/client";
import {
  profileSelect,
  type ProfileEntity,
} from "#selects/profile.select";

export interface CreateProfileInput {
  userId: string;
  institutionId: string;
  fullName: string;
  identityNumber?: string;
  gender?: string;
  birthPlace?: string;
  birthDate?: Date;
  religionId?: string;
  nationalityId?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  photoUrl?: string;
}

export interface UpdateProfileInput {
  institutionId?: string;
  fullName?: string;
  identityNumber?: string;
  gender?: string;
  birthPlace?: string;
  birthDate?: Date;
  religionId?: string;
  nationalityId?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  photoUrl?: string;
}

export class ProfileRepository {
  constructor(private readonly prisma: PrismaClient) {}

 async create(data: CreateProfileInput): Promise<ProfileEntity> {
  return this.prisma.profile.create({
    data: {
      userId: data.userId,
      institutionId: data.institutionId,
      fullName: data.fullName,
      ...(data.identityNumber !== undefined && {
        identityNumber: data.identityNumber,
      }),
      ...(data.gender !== undefined && {
        gender: data.gender,
      }),
      ...(data.birthPlace !== undefined && {
        birthPlace: data.birthPlace,
      }),
      ...(data.birthDate !== undefined && {
        birthDate: data.birthDate,
      }),
      ...(data.religionId !== undefined && {
        religionId: data.religionId,
      }),
      ...(data.nationalityId !== undefined && {
        nationalityId: data.nationalityId,
      }),
      ...(data.address !== undefined && {
        address: data.address,
      }),
      ...(data.phoneNumber !== undefined && {
        phoneNumber: data.phoneNumber,
      }),
      ...(data.email !== undefined && {
        email: data.email,
      }),
      ...(data.photoUrl !== undefined && {
        photoUrl: data.photoUrl,
      }),
    },
    select: profileSelect,
  });
}

  async findById(id: string): Promise<ProfileEntity | null> {
    return this.prisma.profile.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: profileSelect,
    });
  }

  async findByUserId(userId: string): Promise<ProfileEntity | null> {
    return this.prisma.profile.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
      select: profileSelect,
    });
  }

  async findAll(): Promise<ProfileEntity[]> {
    return this.prisma.profile.findMany({
      where: {
        deletedAt: null,
      },
      select: profileSelect,
    });
  }

  async update(
    id: string,
    data: UpdateProfileInput,
  ): Promise<ProfileEntity> {
    return this.prisma.profile.update({
      where: {
        id,
      },
      data: {
        ...(data.institutionId !== undefined && {
          institutionId: data.institutionId,
        }),
        ...(data.fullName !== undefined && {
          fullName: data.fullName,
        }),
        ...(data.identityNumber !== undefined && {
          identityNumber: data.identityNumber,
        }),
        ...(data.gender !== undefined && {
          gender: data.gender,
        }),
        ...(data.birthPlace !== undefined && {
          birthPlace: data.birthPlace,
        }),
        ...(data.birthDate !== undefined && {
          birthDate: data.birthDate,
        }),
        ...(data.religionId !== undefined && {
          religionId: data.religionId,
        }),
        ...(data.nationalityId !== undefined && {
          nationalityId: data.nationalityId,
        }),
        ...(data.address !== undefined && {
          address: data.address,
        }),
        ...(data.phoneNumber !== undefined && {
          phoneNumber: data.phoneNumber,
        }),
        ...(data.email !== undefined && {
          email: data.email,
        }),
        ...(data.photoUrl !== undefined && {
          photoUrl: data.photoUrl,
        }),
      },
      select: profileSelect,
    });
  }

  async delete(id: string): Promise<ProfileEntity> {
    return this.prisma.profile.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: profileSelect,
    });
  }
}