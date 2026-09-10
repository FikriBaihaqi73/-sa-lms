import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AttendanceStatusRepository } from "@repo/shared/infrastructure/repository/attendance-status.repository";
import type {
  CreateAttendanceStatusDto,
  UpdateAttendanceStatusDto,
} from "@repo/shared/schemas/attendance-status.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AttendanceStatusService {
  private readonly attendanceStatusRepository: AttendanceStatusRepository;

  constructor(private readonly prisma: PrismaService) {
    this.attendanceStatusRepository = new AttendanceStatusRepository(
      this.prisma.client,
    );
  }

  findAll() {
    return this.attendanceStatusRepository.findAll();
  }

  async findOne(id: string) {
    const attendanceStatus = await this.attendanceStatusRepository.findById(id);
    if (!attendanceStatus) {
      throw new NotFoundException("Attendance status not found");
    }
    return attendanceStatus;
  }

  async create(dto: CreateAttendanceStatusDto) {
    const existing = await this.attendanceStatusRepository.findByName(dto.name);
    if (existing) {
      throw new ConflictException("Attendance status name already exists");
    }
    return this.attendanceStatusRepository.create({
      name: dto.name,
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async update(id: string, dto: UpdateAttendanceStatusDto) {
    await this.findOne(id);
    if (dto.name !== undefined) {
      const existing = await this.attendanceStatusRepository.findByName(
        dto.name,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException("Attendance status name already exists");
      }
    }
    return this.attendanceStatusRepository.update(id, {
      ...(dto.name !== undefined ? { name: dto.name } : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.attendanceStatusRepository.delete(id);
    return { success: true, id };
  }
}
