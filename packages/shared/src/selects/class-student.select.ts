import type { Prisma } from "#generated/client";

export const classStudentSelect = {
  id: true,
  classId: true,
  studentId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  classes: {
    select: {
      id: true,
      name: true,
      grade_level: true,
      capacity: true,
    },
  },
  student: {
    select: {
      id: true,
      studentNumber: true,
      profileId: true,
      academicStatusId: true,
    },
  },
} satisfies Prisma.ClassStudentSelect;

export type ClassStudentSelectType = typeof classStudentSelect;

export type ClassStudentEntity = Prisma.ClassStudentGetPayload<{
  select: ClassStudentSelectType;
}>;
