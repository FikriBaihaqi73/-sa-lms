import type { Prisma } from "#generated/client";
import { scheduleSelect } from "#selects/schedule.select";

export type ScheduleEntity = Prisma.ScheduleGetPayload<{
  select: typeof scheduleSelect;
}>;

export type ScheduleListEntity = ScheduleEntity[];
