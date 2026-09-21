import { Injectable, NotFoundException } from "@nestjs/common";
import { NotificationRepository } from "@repo/shared/infrastructure/repository/notification.repository";
import type {
  CreateNotificationDto,
  NotificationQueryDto,
  UpdateNotificationDto,
} from "@repo/shared/schemas/notification.schema";

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async create(data: CreateNotificationDto) {
    return this.notificationRepository.create({
      user_id: data.userId,
      title: data.title,
      message: data.message,
      is_read: data.isRead,
      read_at: data.readAt ? new Date(data.readAt) : undefined,
    });
  }

  async findAll(query: NotificationQueryDto) {
    const { page, limit, search } = query;
    const skip = (page - 1) * limit;

    const [data, total] = await this.notificationRepository.findMany({
      skip,
      take: limit,
      search,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundException(`Notification with ID ${id} not found`);
    }
    return notification;
  }

  async update(id: string, data: UpdateNotificationDto) {
    await this.findOne(id);

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.message !== undefined) updateData.message = data.message;
    if (data.isRead !== undefined) updateData.is_read = data.isRead;
    if (data.readAt !== undefined) updateData.read_at = data.readAt ? new Date(data.readAt) : null;

    return this.notificationRepository.update(id, updateData);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.notificationRepository.delete(id);
  }
}
