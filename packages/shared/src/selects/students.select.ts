import type { Prisma } from "#generated/client";

export const studentSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  profileId: true,
  departmentId: true,
  academicStatusId: true,
  studentNumber: true,
  enrollmentYear: true,
} satisfies Prisma.StudentSelect;

export type StudentEntity = Prisma.StudentGetPayload<{
  select: typeof studentSelect;
}>;