import type { Prisma } from "#generated/client";

export const religionSelect = {
  id: true,
  name: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  profiles: {
    select: {
      id: true,
      fullName: true,
    },
  },
} satisfies Prisma.ReligionSelect;

export type ReligionSelectType = typeof religionSelect;

export type ReligionEntity = Prisma.ReligionGetPayload<{
  select: ReligionSelectType;
}>;
