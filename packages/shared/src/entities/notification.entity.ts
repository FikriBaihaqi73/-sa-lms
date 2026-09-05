import type { Prisma } from "#generated/client";

import { notificationSelect } from "#selects/notification.select";

export type NotificationEntity = Prisma.NotificationsGetPayload<{
  select: typeof notificationSelect;
}>;

export type NotificationListEntity = NotificationEntity[];