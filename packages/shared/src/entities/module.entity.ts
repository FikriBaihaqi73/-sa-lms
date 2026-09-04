import type { Prisma } from "#generated/client";
import { moduleSelect } from "#selects/module.select";

export type ModuleEntity = Prisma.ModulesGetPayload<{
  select: typeof moduleSelect;
}>;

export type ModuleListEntity = ModuleEntity[];
