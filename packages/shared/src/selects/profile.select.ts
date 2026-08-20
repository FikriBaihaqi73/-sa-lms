import type { Prisma } from "#generated/client";

export const profileSelect = {
  id: true,
  userId: true,
  institutionId: true,
  fullName: true,
  identityNumber: true,
  gender: true,
  birthPlace: true,
  birthDate: true,
  religionId: true,
  nationalityId: true,
  address: true,
  phoneNumber: true,
  email: true,
  photoUrl: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProfileSelect;

export type ProfileSelectType = typeof profileSelect;

export type ProfileEntity = Prisma.ProfileGetPayload<{
  select: ProfileSelectType;
}>;
