import type { Prisma } from "#generated/client";

export const notificationSelect = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  user_id: true,
  title: true,
  message: true,
  is_read: true,
  read_at: true,
} satisfies Prisma.NotificationsSelect;

export type NotificationSelectType = typeof notificationSelect;

export type NotificationEntity = Prisma.NotificationsGetPayload<{
  select: NotificationSelectType;
}>;
