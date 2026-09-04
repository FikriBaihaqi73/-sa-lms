import type { Prisma } from "#generated/client";
import { institutionSelect } from "#selects/institution.select";

export type InstitutionEntity = Prisma.InstitutionGetPayload<{
  select: typeof institutionSelect;
}>;

export type InstitutionListEntity = InstitutionEntity[];
