import type { Prisma } from "#generated/client";
import { attendanceStatusSelect } from "#selects/attendance-status.select";

export type AttendanceStatusEntity = Prisma.AttendanceStatusesGetPayload<{
  select: typeof attendanceStatusSelect;
}>;

export type AttendanceStatusListEntity = AttendanceStatusEntity[];
