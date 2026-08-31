import type { PrismaClient } from "#generated/client";
import { type ScheduleEntity, scheduleSelect } from "#selects/schedule.select";

export interface CreateScheduleInput {
  classSubjectId: string;
  classroomId: string;
  day: string;
  startTime?: Date | null;
  endTime?: Date | null;
}

export interface UpdateScheduleInput {
  classSubjectId?: string;
  classroomId?: string;
  day?: string;
  startTime?: Date | null;
  endTime?: Date | null;
}

export class ScheduleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateScheduleInput): Promise<ScheduleEntity> {
    return this.prisma.schedule.create({
      data: {
        classSubjectId: data.classSubjectId,
        classroomId: data.classroomId,
        day: data.day,
        ...(data.startTime !== undefined && { startTime: data.startTime }),
        ...(data.endTime !== undefined && { endTime: data.endTime }),
      },
      select: scheduleSelect,
    });
  }

  async findById(id: string): Promise<ScheduleEntity | null> {
    return this.prisma.schedule.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: scheduleSelect,
    });
  }

  async findByClassSubject(classSubjectId: string): Promise<ScheduleEntity[]> {
    return this.prisma.schedule.findMany({
      where: {
        classSubjectId,
        deletedAt: null,
      },
      select: scheduleSelect,
    });
  }

  async findByClassroom(classroomId: string): Promise<ScheduleEntity[]> {
    return this.prisma.schedule.findMany({
      where: {
        classroomId,
        deletedAt: null,
      },
      select: scheduleSelect,
    });
  }

  async findAll(): Promise<ScheduleEntity[]> {
    return this.prisma.schedule.findMany({
      where: {
        deletedAt: null,
      },
      select: scheduleSelect,
    });
  }

  async update(id: string, data: UpdateScheduleInput): Promise<ScheduleEntity> {
    return this.prisma.schedule.update({
      where: {
        id,
      },
      data: {
        ...(data.classSubjectId !== undefined && {
          classSubjectId: data.classSubjectId,
        }),
        ...(data.classroomId !== undefined && {
          classroomId: data.classroomId,
        }),
        ...(data.day !== undefined && { day: data.day }),
        ...(data.startTime !== undefined && { startTime: data.startTime }),
        ...(data.endTime !== undefined && { endTime: data.endTime }),
      },
      select: scheduleSelect,
    });
  }

  async delete(id: string): Promise<ScheduleEntity> {
    return this.prisma.schedule.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: scheduleSelect,
    });
  }
}
