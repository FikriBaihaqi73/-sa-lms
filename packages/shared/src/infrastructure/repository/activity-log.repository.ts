import type { PrismaClient } from "#generated/client";
import {
  type ActivityLogEntity,
  activityLogSelect,
} from "#selects/activity-log.select";

export interface CreateActivityLogInput {
  user_id: string;
  module: string;
  action: string;
  table_name?: string;
  record_id?: string;
  ip_address?: string;
  user_agent?: string;
}

export interface UpdateActivityLogInput {
  module?: string;
  action?: string;
  table_name?: string;
  record_id?: string;
  ip_address?: string;
  user_agent?: string;
}

export class ActivityLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateActivityLogInput): Promise<ActivityLogEntity> {
    return this.prisma.activityLogs.create({
      data: {
        user_id: data.user_id,
        module: data.module,
        action: data.action,

        ...(data.table_name !== undefined && {
          table_name: data.table_name,
        }),

        ...(data.record_id !== undefined && {
          record_id: data.record_id,
        }),

        ...(data.ip_address !== undefined && {
          ip_address: data.ip_address,
        }),

        ...(data.user_agent !== undefined && {
          user_agent: data.user_agent,
        }),
      },
      select: activityLogSelect,
    });
  }

  async findById(id: string): Promise<ActivityLogEntity | null> {
    return this.prisma.activityLogs.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: activityLogSelect,
    });
  }

  async findAll(): Promise<ActivityLogEntity[]> {
    return this.prisma.activityLogs.findMany({
      where: {
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
      select: activityLogSelect,
    });
  }

  async findByUserId(user_id: string): Promise<ActivityLogEntity[]> {
    return this.prisma.activityLogs.findMany({
      where: {
        user_id,
        deleted_at: null,
      },
      orderBy: {
        created_at: "desc",
      },
      select: activityLogSelect,
    });
  }

  async update(
    id: string,
    data: UpdateActivityLogInput,
  ): Promise<ActivityLogEntity> {
    return this.prisma.activityLogs.update({
      where: {
        id,
      },
      data: {
        ...(data.module !== undefined && {
          module: data.module,
        }),

        ...(data.action !== undefined && {
          action: data.action,
        }),

        ...(data.table_name !== undefined && {
          table_name: data.table_name,
        }),

        ...(data.record_id !== undefined && {
          record_id: data.record_id,
        }),

        ...(data.ip_address !== undefined && {
          ip_address: data.ip_address,
        }),

        ...(data.user_agent !== undefined && {
          user_agent: data.user_agent,
        }),
      },
      select: activityLogSelect,
    });
  }

  async delete(id: string): Promise<ActivityLogEntity> {
    return this.prisma.activityLogs.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: activityLogSelect,
    });
  }
}
