import type { Prisma } from "#generated/client";
import { classStudentSelect } from "#selects/class-student.select";

export type ClassStudentEntity = Prisma.ClassStudentGetPayload<{
  select: typeof classStudentSelect;
}>;

export type ClassStudentListEntity = ClassStudentEntity[];
