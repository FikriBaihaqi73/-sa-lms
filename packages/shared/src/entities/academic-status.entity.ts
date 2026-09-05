import type { Prisma } from "#generated/client";
import { academicStatusSelect } from "#selects/academic-status.select";

export type AcademicStatusEntity = Prisma.AcademicStatusesGetPayload<{
	select: typeof academicStatusSelect;
}>;

export type AcademicStatusListEntity = AcademicStatusEntity[];
