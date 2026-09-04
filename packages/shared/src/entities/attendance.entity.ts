import type { Prisma } from "#generated/client";
import { attendanceSelect } from "#selects/attendance.select";

export type AttendanceEntity = Prisma.AttendancesGetPayload<{
  select: typeof attendanceSelect;
}>;

export type AttendanceListEntity = AttendanceEntity[];
