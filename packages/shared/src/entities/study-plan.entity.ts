import type { Prisma } from "#generated/client";
import { studyPlanSelect } from "#selects/study-plan.select";

export type StudyPlanEntity = Prisma.StudyPlansGetPayload<{
  select: typeof studyPlanSelect;
}>;

export type StudyPlanListEntity = StudyPlanEntity[];
