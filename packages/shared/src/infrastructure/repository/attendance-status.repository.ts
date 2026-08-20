import type { PrismaClient } from "#generated/client";
import {
  type AttendanceStatusEntity,
  attendanceStatusSelect,
} from "#selects/attendance-status.select";

export interface CreateAttendanceStatusInput {
  name: string;
  description?: string;
}

export interface UpdateAttendanceStatusInput {
  name?: string;
  description?: string;
}

export class AttendanceStatusRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateAttendanceStatusInput,
  ): Promise<AttendanceStatusEntity> {
    return this.prisma.attendanceStatuses.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
      select: attendanceStatusSelect,
    });
  }
  async findById(id: string): Promise<AttendanceStatusEntity | null> {
    return this.prisma.attendanceStatuses.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: attendanceStatusSelect,
    });
  }

  async findByName(name: string): Promise<AttendanceStatusEntity | null> {
    return this.prisma.attendanceStatuses.findFirst({
      where: {
        name,
        deleted_at: null,
      },
      select: attendanceStatusSelect,
    });
  }

  async findAll(): Promise<AttendanceStatusEntity[]> {
    return this.prisma.attendanceStatuses.findMany({
      where: {
        deleted_at: null,
      },
      select: attendanceStatusSelect,
    });
  }

  async update(
    id: string,
    data: UpdateAttendanceStatusInput,
  ): Promise<AttendanceStatusEntity> {
    return this.prisma.attendanceStatuses.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
      select: attendanceStatusSelect,
    });
  }

  async delete(id: string): Promise<AttendanceStatusEntity> {
    return this.prisma.attendanceStatuses.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: attendanceStatusSelect,
    });
  }
}
