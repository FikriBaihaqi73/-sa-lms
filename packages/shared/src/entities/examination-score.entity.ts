import type { Prisma } from "#generated/client";
import { examinationScoreSelect } from "#selects/examination-score.select";

export type ExaminationScoreEntity = Prisma.ExaminationScoresGetPayload<{
	select: typeof examinationScoreSelect;
}>;

export type ExaminationScoreListEntity = ExaminationScoreEntity[];
