import type { Prisma } from "#generated/client";

export const examinationSelect = {
  id: true,
  createdBy: true,
  updatedBy: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,

  classSubjectId: true,
  assignmentTypeId: true,
  title: true,
  description: true,
  examinationDate: true,
  duration: true,
  maximumScore: true,
} satisfies Prisma.ExaminationsSelect;

export type ExaminationEntity = Prisma.ExaminationsGetPayload<{
  select: typeof examinationSelect;
}>;