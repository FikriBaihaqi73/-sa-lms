import type { Prisma } from "#generated/client";
import { profileSelect } from "#selects/profile.select";

export type ProfileEntity = Prisma.ProfileGetPayload<{
  select: typeof profileSelect;
}>;

export type ProfileListEntity = ProfileEntity[];
