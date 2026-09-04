import type { Prisma } from "#generated/client";
import { nationalitySelect } from "#selects/nationalities.select";

export type NationalityEntity = Prisma.NationalityGetPayload<{
  select: typeof nationalitySelect;
}>;

export type NationalityListEntity = NationalityEntity[];
