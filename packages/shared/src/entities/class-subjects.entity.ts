import type { Prisma } from "#generated/client";
import { classSubjectsSelect } from "#selects/class-subjects.select";

export type ClassSubjectsEntity = Prisma.ClassSubjectsGetPayload<{
  select: typeof classSubjectsSelect;
}>;

export type ClassSubjectsListEntity = ClassSubjectsEntity[];
