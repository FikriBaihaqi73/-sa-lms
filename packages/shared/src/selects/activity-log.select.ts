import type { Prisma } from "#generated/client";

export const activityLogSelect = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,

  user_id: true,
  module: true,
  action: true,
  table_name: true,
  record_id: true,
  ip_address: true,
  user_agent: true,
} satisfies Prisma.ActivityLogsSelect;

export type ActivityLogSelectType = typeof activityLogSelect;

export type ActivityLogEntity = Prisma.ActivityLogsGetPayload<{
  select: ActivityLogSelectType;
}>;