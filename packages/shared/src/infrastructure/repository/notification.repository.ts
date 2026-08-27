import { PrismaClient } from "#generated/client";
import {
  notificationSelect,
  type NotificationEntity,
} from "#selects/notification.select";

export class NotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<NotificationEntity[]> {
    return this.prisma.notifications.findMany({
      select: notificationSelect,
    });
  }
}