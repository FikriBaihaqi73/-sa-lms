import type { PrismaClient } from "#generated/client";
import {
  type AttendanceEntity,
  attendanceSelect,
} from "#selects/attendance.select";

export interface CreateAttendanceInput {
  schedule_id: string;
  student_id: string;
  attendance_status_id: string;
  attendance_date?: Date | null;
  notes?: string | null;
}

export interface UpdateAttendanceInput {
  schedule_id?: string;
  student_id?: string;
  attendance_status_id?: string;
  attendance_date?: Date | null;
  notes?: string | null;
}

export class AttendanceRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAttendanceInput): Promise<AttendanceEntity> {
    return this.prisma.attendances.create({
      data: {
        schedule_id: data.schedule_id,
        student_id: data.student_id,
        attendance_status_id: data.attendance_status_id,
        attendance_date: data.attendance_date ?? null,
        notes: data.notes ?? null,
      },
      select: attendanceSelect,
    });
  }

  async findById(id: string): Promise<AttendanceEntity | null> {
    return this.prisma.attendances.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: attendanceSelect,
    });
  }

  async findBySchedule(schedule_id: string): Promise<AttendanceEntity[]> {
    return this.prisma.attendances.findMany({
      where: {
        schedule_id,
        deleted_at: null,
      },
      select: attendanceSelect,
    });
  }

  async findByStudent(student_id: string): Promise<AttendanceEntity[]> {
    return this.prisma.attendances.findMany({
      where: {
        student_id,
        deleted_at: null,
      },
      select: attendanceSelect,
    });
  }

  async findByScheduleAndStudent(
    schedule_id: string,
    student_id: string,
  ): Promise<AttendanceEntity[]> {
    return this.prisma.attendances.findMany({
      where: {
        schedule_id,
        student_id,
        deleted_at: null,
      },
      select: attendanceSelect,
    });
  }

  async findByScheduleStudentAndDate(
    schedule_id: string,
    student_id: string,
    attendance_date: Date,
  ): Promise<AttendanceEntity | null> {
    return this.prisma.attendances.findFirst({
      where: {
        schedule_id,
        student_id,
        attendance_date,
        deleted_at: null,
      },
      select: attendanceSelect,
    });
  }

  async findAll(): Promise<AttendanceEntity[]> {
    return this.prisma.attendances.findMany({
      where: {
        deleted_at: null,
      },
      select: attendanceSelect,
    });
  }

  async update(
    id: string,
    data: UpdateAttendanceInput,
  ): Promise<AttendanceEntity> {
    return this.prisma.attendances.update({
      where: { id },
      data: {
        ...(data.schedule_id !== undefined && {
          schedule_id: data.schedule_id,
        }),
        ...(data.student_id !== undefined && {
          student_id: data.student_id,
        }),
        ...(data.attendance_status_id !== undefined && {
          attendance_status_id: data.attendance_status_id,
        }),
        ...(data.attendance_date !== undefined && {
          attendance_date: data.attendance_date,
        }),
        ...(data.notes !== undefined && {
          notes: data.notes,
        }),
      },
      select: attendanceSelect,
    });
  }

  async delete(id: string): Promise<AttendanceEntity> {
    return this.prisma.attendances.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
      select: attendanceSelect,
    });
  }
}
