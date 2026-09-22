import { Injectable, NotFoundException } from "@nestjs/common";
import {
  ActivityLogRepository,
  type CreateActivityLogInput,
  type UpdateActivityLogInput,
} from "@repo/shared/infrastructure/repository/activity-log.repository";
import { UserRepository } from "@repo/shared/infrastructure/repository/user.repository";
import type {
  CreateActivityLogDto,
  UpdateActivityLogDto,
} from "@repo/shared/schemas/activity-logs.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ActivityLogService {
  private readonly activityLogRepository: ActivityLogRepository;
  private readonly userRepository: UserRepository;

  constructor(private readonly prisma: PrismaService) {
    this.activityLogRepository = new ActivityLogRepository(this.prisma.client);
    this.userRepository = new UserRepository(this.prisma.client);
  }

  async findAll(
    page: number,
    limit: number,
    filters?: { search?: string | undefined },
  ) {
    return this.activityLogRepository.findAll(page, limit, filters);
  }

  async findOne(id: string) {
    const activityLog = await this.activityLogRepository.findById(id);
    if (!activityLog) {
      throw new NotFoundException("Activity log not found");
    }
    return activityLog;
  }

  async create(dto: CreateActivityLogDto) {
    await this.ensureUserExists(dto.user_id);

    const input: CreateActivityLogInput = {
      user_id: dto.user_id,
      module: dto.module,
      action: dto.action,
      ...(dto.table_name !== undefined && {
        table_name: dto.table_name ?? undefined,
      }),
      ...(dto.record_id !== undefined && {
        record_id: dto.record_id ?? undefined,
      }),
      ...(dto.ip_address !== undefined && {
        ip_address: dto.ip_address ?? undefined,
      }),
      ...(dto.user_agent !== undefined && {
        user_agent: dto.user_agent ?? undefined,
      }),
    };

    return this.activityLogRepository.create(input);
  }

  async update(id: string, dto: UpdateActivityLogDto) {
    await this.findOne(id);

    // User_id shouldn't typically be updated in activity logs but if it was in the DTO...
    // The UpdateActivityLogInput doesn't support changing user_id based on repo logic, so we omit it.

    const input: UpdateActivityLogInput = {
      ...(dto.module !== undefined && { module: dto.module }),
      ...(dto.action !== undefined && { action: dto.action }),
      ...(dto.table_name !== undefined && {
        table_name: dto.table_name ?? undefined,
      }),
      ...(dto.record_id !== undefined && {
        record_id: dto.record_id ?? undefined,
      }),
      ...(dto.ip_address !== undefined && {
        ip_address: dto.ip_address ?? undefined,
      }),
      ...(dto.user_agent !== undefined && {
        user_agent: dto.user_agent ?? undefined,
      }),
    };

    return this.activityLogRepository.update(id, input);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.activityLogRepository.delete(id);
    return { success: true, id };
  }

  private async ensureUserExists(userId: string) {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundException("User not found");
  }
}
