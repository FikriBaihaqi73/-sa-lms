import type { Prisma } from "#generated/client";

export const nationalitySelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.NationalitySelect;

export type NationalitySelectType = typeof nationalitySelect;

export type NationalityEntity = Prisma.NationalityGetPayload<{
  select: NationalitySelectType;
}>;
