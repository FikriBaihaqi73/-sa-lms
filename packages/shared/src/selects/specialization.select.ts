import type { Prisma } from "#generated/client";

export const specializationSelect = {
  id: true,
  name: true,
  description: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.SpecializationsSelect;

export type SpecializationSelectType = typeof specializationSelect;

export type SpecializationEntity = Prisma.SpecializationsGetPayload<{
  select: SpecializationSelectType;
}>;