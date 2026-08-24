import type { Prisma } from "#generated/client";

export const scheduleSelect = {
  id: true,
  classSubjectId: true,
  classroomId: true,
  day: true,
  startTime: true,
  endTime: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.ScheduleSelect;

export type ScheduleSelectType = typeof scheduleSelect;

export type ScheduleEntity = Prisma.ScheduleGetPayload<{
  select: ScheduleSelectType;
}>;
