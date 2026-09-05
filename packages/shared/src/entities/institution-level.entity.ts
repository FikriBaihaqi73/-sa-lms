import type { Prisma } from "#generated/client";
import { institutionLevelSelect } from "#selects/institution-level.select";

export type InstitutionLevelEntity = Prisma.InstitutionLevelGetPayload<{
  select: typeof institutionLevelSelect;
}>;

export type InstitutionLevelListEntity = InstitutionLevelEntity[];