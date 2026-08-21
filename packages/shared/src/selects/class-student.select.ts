import type { Prisma } from "#generated/client";

export const classStudentSelect = {
  id: true,
  classId: true,
  studentId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.ClassStudentSelect;

export type ClassStudentSelectType = typeof classStudentSelect;

export type ClassStudentEntity = Prisma.ClassStudentGetPayload<{
  select: ClassStudentSelectType;
}>;