import type { Prisma } from "#generated/client";

export const studentGuardianSelect = {
  id: true,
  studentId: true,
  guardianId: true,
  isPrimary: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.StudentGuardianSelect;

export type StudentGuardianSelectType = typeof studentGuardianSelect;

export type StudentGuardianEntity = Prisma.StudentGuardianGetPayload<{
  select: StudentGuardianSelectType;
}>;
