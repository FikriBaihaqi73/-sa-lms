import type { Prisma } from "#generated/client";

import { activityLogSelect } from "#selects/activity-log.select";

export type ActivityLogEntity = Prisma.ActivityLogsGetPayload<{
  select: typeof activityLogSelect;
}>;

export type ActivityLogListEntity = ActivityLogEntity[];
