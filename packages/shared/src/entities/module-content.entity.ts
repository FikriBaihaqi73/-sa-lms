import type { Prisma } from "#generated/client";
import { moduleContentSelect } from "#selects/module-content.select";

export type ModuleContentEntity = Prisma.ModuleContentGetPayload<{
  select: typeof moduleContentSelect;
}>;

export type ModuleContentListEntity = ModuleContentEntity[];
