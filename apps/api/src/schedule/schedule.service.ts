import { Injectable, NotFoundException } from "@nestjs/common";
import { ScheduleRepository } from "@repo/shared/infrastructure/repository/schedule.repository";
import type {
  CreateScheduleDto,
  UpdateScheduleDto,
} from "@repo/shared/schemas/schedule.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ScheduleService {
  private readonly scheduleRepository: ScheduleRepository;

  constructor(private readonly prisma: PrismaService) {
    this.scheduleRepository = new ScheduleRepository(this.prisma.client);
  }

  async findAll(
    page: number,
    limit: number,
    filters?: { search?: string | undefined },
  ) {
    return this.scheduleRepository.findAll(page, limit, filters);
  }

  async findOne(id: string) {
    const schedule = await this.scheduleRepository.findById(id);
    if (!schedule) throw new NotFoundException("Schedule not found");
    return schedule;
  }

  async create(dto: CreateScheduleDto) {
    return this.scheduleRepository.create({
      classSubjectId: dto.classSubjectId,
      classroomId: dto.classroomId,
      day: dto.day,
      ...(dto.startTime !== undefined ? { startTime: new Date(dto.startTime) } : {}),
      ...(dto.endTime !== undefined ? { endTime: new Date(dto.endTime) } : {}),
    });
  }

  async update(id: string, dto: UpdateScheduleDto) {
    await this.findOne(id);
    return this.scheduleRepository.update(id, {
      ...(dto.classSubjectId !== undefined ? { classSubjectId: dto.classSubjectId } : {}),
      ...(dto.classroomId !== undefined ? { classroomId: dto.classroomId } : {}),
      ...(dto.day !== undefined ? { day: dto.day } : {}),
      ...(dto.startTime !== undefined ? { startTime: new Date(dto.startTime) } : {}),
      ...(dto.endTime !== undefined ? { endTime: new Date(dto.endTime) } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.scheduleRepository.delete(id);
    return { success: true, id };
  }
}
