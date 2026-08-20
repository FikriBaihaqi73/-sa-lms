import type { Prisma } from "#generated/client";

export const institutionSelect = {
  id: true,
  institutionLevelId: true,
  name: true,
  shortName: true,
  address: true,
  city: true,
  province: true,
  postalCode: true,
  phoneNumber: true,
  email: true,
  website: true,
  logoUrl: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.InstitutionSelect;

export type InstitutionSelectType = typeof institutionSelect;

export type InstitutionEntity = Prisma.InstitutionGetPayload<{
  select: InstitutionSelectType;
}>;
