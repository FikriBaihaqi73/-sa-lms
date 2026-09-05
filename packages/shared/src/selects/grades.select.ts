import type { Prisma } from "#generated/client";

export const gradeSelect = {
  id: true,
  grade: true,
  minimumScore: true,
  maximumScore: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.GradesSelect;
