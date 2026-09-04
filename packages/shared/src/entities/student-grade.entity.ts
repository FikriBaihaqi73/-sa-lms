import type { Prisma } from "#generated/client";
import { studentGradeSelect } from "#selects/student-grade.select";

export type StudentGradeEntity = Prisma.StudentGradesGetPayload<{
	select: typeof studentGradeSelect;
}>;

export type StudentGradeListEntity = StudentGradeEntity[];
