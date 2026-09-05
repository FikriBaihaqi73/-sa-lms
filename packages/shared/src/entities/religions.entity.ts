import type { Prisma } from "#generated/client";
import { religionSelect } from "#selects/religions.select";

export type ReligionEntity = Prisma.ReligionGetPayload<{
  select: typeof religionSelect;
}>;

export type ReligionListEntity = ReligionEntity[];
