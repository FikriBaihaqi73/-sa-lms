import type { Prisma } from "#generated/client";
import { academicYearSelect } from "#selects/academic-year.select";

export type AcademicYearEntity = Prisma.AcademicYearsGetPayload<{
	select: typeof academicYearSelect;
}>;

export type AcademicYearListEntity = AcademicYearEntity[];
