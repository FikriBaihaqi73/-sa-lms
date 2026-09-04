import type { Prisma } from "#generated/client";
import { studyResultSelect } from "#selects/study-result.select";

export type StudyResultEntity = Prisma.StudyResultGetPayload<{
	select: typeof studyResultSelect;
}>;

export type StudyResultListEntity = StudyResultEntity[];
