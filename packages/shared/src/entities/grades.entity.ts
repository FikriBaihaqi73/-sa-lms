import type { Prisma } from "#generated/client";
import { gradeSelect } from "#selects/grades.select";

export type GradeEntity = Prisma.GradesGetPayload<{
  select: typeof gradeSelect;
}>;

export type GradeListEntity = GradeEntity[];
