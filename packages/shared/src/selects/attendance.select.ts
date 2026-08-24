import type { Prisma } from "#generated/client";

export const attendanceSelect = {
  id: true,
  schedule_id: true,
  student_id: true,
  attendance_status_id: true,
  attendance_date: true,
  notes: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.AttendancesSelect;

export type AttendanceSelectType = typeof attendanceSelect;

export type AttendanceEntity = Prisma.AttendancesGetPayload<{
  select: AttendanceSelectType;
}>;
