import type { Prisma } from "#generated/client";
import { examinationSelect } from "#selects/examination.select";

export type ExaminationEntity = Prisma.ExaminationsGetPayload<{
	select: typeof examinationSelect;
}>;

export type ExaminationListEntity = ExaminationEntity[];
