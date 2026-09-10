import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AttendanceRepository } from "@repo/shared/infrastructure/repository/attendance.repository";
import { AttendanceStatusRepository } from "@repo/shared/infrastructure/repository/attendance-status.repository";
import { ScheduleRepository } from "@repo/shared/infrastructure/repository/schedule.repository";
import { StudentRepository } from "@repo/shared/infrastructure/repository/students.repository";
import type {
  CreateAttendanceDto,
  UpdateAttendanceDto,
} from "@repo/shared/schemas/attendance.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AttendanceService {
  private readonly attendanceRepository: AttendanceRepository;
  private readonly attendanceStatusRepository: AttendanceStatusRepository;
  private readonly scheduleRepository: ScheduleRepository;
  private readonly studentRepository: StudentRepository;

  constructor(private readonly prisma: PrismaService) {
    this.attendanceRepository = new AttendanceRepository(this.prisma.client);
    this.attendanceStatusRepository = new AttendanceStatusRepository(
      this.prisma.client,
    );
    this.scheduleRepository = new ScheduleRepository(this.prisma.client);
    this.studentRepository = new StudentRepository(this.prisma.client);
  }

  async findAll() {
    return this.attendanceRepository.findAll();
  }

  async findOne(id: string) {
    const attendance = await this.attendanceRepository.findById(id);
    if (!attendance) {
      throw new NotFoundException("Attendance not found");
    }
    return attendance;
  }

  async create(dto: CreateAttendanceDto) {
    await this.ensureRelationsExist(dto);
    const attendanceDate = this.toDate(dto.attendance_date);
    await this.ensureAttendanceDoesNotExist(
      dto.schedule_id,
      dto.student_id,
      attendanceDate,
    );

    return this.attendanceRepository.create({
      schedule_id: dto.schedule_id,
      student_id: dto.student_id,
      attendance_status_id: dto.attendance_status_id,
      attendance_date: attendanceDate,
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
    });
  }

  async update(id: string, dto: UpdateAttendanceDto) {
    const current = await this.findOne(id);
    const scheduleId = dto.schedule_id ?? current.schedule_id;
    const studentId = dto.student_id ?? current.student_id;
    const attendanceDate =
      dto.attendance_date === undefined
        ? current.attendance_date
        : this.toDate(dto.attendance_date);

    await this.ensureRelationsExist({
      schedule_id: scheduleId,
      student_id: studentId,
      attendance_status_id:
        dto.attendance_status_id ?? current.attendance_status_id,
    });
    await this.ensureAttendanceDoesNotExist(
      scheduleId,
      studentId,
      attendanceDate,
      id,
    );

    return this.attendanceRepository.update(id, {
      ...(dto.schedule_id !== undefined
        ? { schedule_id: dto.schedule_id }
        : {}),
      ...(dto.student_id !== undefined ? { student_id: dto.student_id } : {}),
      ...(dto.attendance_status_id !== undefined
        ? { attendance_status_id: dto.attendance_status_id }
        : {}),
      ...(dto.attendance_date !== undefined
        ? { attendance_date: attendanceDate }
        : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.attendanceRepository.delete(id);
    return { success: true, id };
  }

  private async ensureRelationsExist(data: {
    schedule_id: string;
    student_id: string;
    attendance_status_id: string;
  }) {
    const [schedule, student, attendanceStatus] = await Promise.all([
      this.scheduleRepository.findById(data.schedule_id),
      this.studentRepository.findById(data.student_id),
      this.attendanceStatusRepository.findById(data.attendance_status_id),
    ]);

    if (!schedule) throw new NotFoundException("Schedule not found");
    if (!student) throw new NotFoundException("Student not found");
    if (!attendanceStatus) {
      throw new NotFoundException("Attendance status not found");
    }
  }

  private async ensureAttendanceDoesNotExist(
    scheduleId: string,
    studentId: string,
    attendanceDate: Date | null,
    excludedId?: string,
  ) {
    if (!attendanceDate) return;
    const existing =
      await this.attendanceRepository.findByScheduleStudentAndDate(
        scheduleId,
        studentId,
        attendanceDate,
      );
    if (existing && existing.id !== excludedId) {
      throw new ConflictException(
        "Attendance already exists for this student, schedule, and date",
      );
    }
  }

  private toDate(value: string | undefined): Date | null {
    return value === undefined ? null : new Date(value);
  }
}
