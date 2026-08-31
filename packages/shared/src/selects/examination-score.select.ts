import type { Prisma } from "#generated/client";

export const examinationScoreSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,

  examinationId: true,
  studentId: true,
  score: true,
  notes: true,
  gradedBy: true,
  gradedAt: true,
} satisfies Prisma.ExaminationScoresSelect;

export type ExaminationScoreSelectType = typeof examinationScoreSelect;

export type ExaminationScoreEntity = Prisma.ExaminationScoresGetPayload<{
  select: ExaminationScoreSelectType;
}>;
