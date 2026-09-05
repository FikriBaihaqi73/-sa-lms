import type { Prisma } from "#generated/client";
import { semesterSelect } from "#selects/semester.select";

export type SemesterEntity = Prisma.SemestersGetPayload<{
  select: typeof semesterSelect;
}>;

export type SemesterListEntity = SemesterEntity[];
