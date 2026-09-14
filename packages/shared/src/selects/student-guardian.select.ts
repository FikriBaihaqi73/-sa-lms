import type { Prisma } from "#generated/client";
import { guardianSelect } from "./guardian.select.js";
import { profileSelect } from "./profile.select.js";

export const studentGuardianSelect = {
  id: true,
  studentId: true,
  guardianId: true,
  isPrimary: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  student: {
    select: {
      id: true,
      studentNumber: true,
      enrollmentYear: true,
      profile: {
        select: profileSelect,
      },
    },
  },
  guardian: {
    select: guardianSelect,
  },
} satisfies Prisma.StudentGuardianSelect;

export type StudentGuardianSelectType = typeof studentGuardianSelect;

export type StudentGuardianEntity = Prisma.StudentGuardianGetPayload<{
  select: StudentGuardianSelectType;
}>;
