import type { Prisma } from "#generated/client";

export const attendanceStatusSelect = {
  id: true,
  name: true,
  description: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.AttendanceStatusesSelect;

export type AttendanceStatusSelectType = typeof attendanceStatusSelect;

export type AttendanceStatusEntity = Prisma.AttendanceStatusesGetPayload<{
  select: AttendanceStatusSelectType;
}>;