import type { Prisma } from "#generated/client";

export const religionSelect = {
  id: true,
  name: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
} satisfies Prisma.ReligionSelect;

export type ReligionEntity = Prisma.ReligionGetPayload<{
  select: typeof religionSelect;
}>;
