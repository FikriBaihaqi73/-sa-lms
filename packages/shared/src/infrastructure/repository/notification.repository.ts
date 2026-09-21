import type { Prisma, PrismaClient } from "#generated/client";
import { notificationSelect } from "#selects/notification.select";
import type { NotificationEntity } from "#entities/notification.entity";

export class NotificationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: Prisma.NotificationsUncheckedCreateInput): Promise<NotificationEntity> {
    return this.prisma.notifications.create({
      data,
      select: notificationSelect,
    });
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    search?: string;
  }): Promise<[NotificationEntity[], number]> {
    const { skip, take, search } = params;
    const where: Prisma.NotificationsWhereInput = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.notifications.findMany({
        where,
        skip,
        take,
        select: notificationSelect,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.notifications.count({ where }),
    ]);

    return [data, total];
  }

  async findById(id: string): Promise<NotificationEntity | null> {
    return this.prisma.notifications.findUnique({
      where: { id },
      select: notificationSelect,
    });
  }

  async update(id: string, data: Prisma.NotificationsUncheckedUpdateInput): Promise<NotificationEntity> {
    return this.prisma.notifications.update({
      where: { id },
      data,
      select: notificationSelect,
    });
  }

  async delete(id: string): Promise<NotificationEntity> {
    return this.prisma.notifications.delete({
      where: { id },
      select: notificationSelect,
    });
  }
}
