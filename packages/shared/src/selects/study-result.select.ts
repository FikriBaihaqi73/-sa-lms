import type { Prisma } from "#generated/client";

export const studyResultSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  studentId: true,
  academicYearId: true,
  semesterId: true,
  totalCredits: true,
  semesterGpa: true,
  cumulativeGpa: true,
  academicStatusId: true,
} satisfies Prisma.StudyResultSelect;

export type StudyResultSelectType = typeof studyResultSelect;

export type StudyResultEntity = Prisma.StudyResultGetPayload<{
  select: StudyResultSelectType;
}>;
