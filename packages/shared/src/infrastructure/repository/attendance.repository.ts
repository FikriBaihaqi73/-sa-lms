import type { PrismaClient } from "#generated/client";
import {
  type AttendanceEntity,
  attendanceSelect,
} from "#selects/attendance.select";

export interface CreateAttendanceInput {
  schedule_id: string;
  student_id: string;
  attendance_status_id: string;
  attendance_date?: Date | undefined;
  notes?: string | undefined;
}

export interface UpdateAttendanceInput {
  schedule_id?: string | undefined;
  student_id?: string | undefined;
  attendance_status_id?: string | undefined;
  attendance_date?: Date | undefined;
  notes?: string | undefined;
}

export interface AttendanceSearchInput {
  search?: string | undefined;
  schedule_id?: string | undefined;
  student_id?: string | undefined;
  attendance_status_id?: string | undefined;
  attendance_date?: string | undefined;
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

  async findAll(
    page: number,
    limit: number,
    filters?: AttendanceSearchInput,
  ): Promise<{ data: AttendanceEntity[]; meta: any }> {
    const skip = (page - 1) * limit;

    const where: any = {
      deleted_at: null,
      ...(filters?.search
        ? {
            notes: {
              contains: filters.search,
              mode: "insensitive",
            },
          }
        : {}),
      ...(filters?.schedule_id ? { schedule_id: filters.schedule_id } : {}),
      ...(filters?.student_id ? { student_id: filters.student_id } : {}),
      ...(filters?.attendance_status_id
        ? { attendance_status_id: filters.attendance_status_id }
        : {}),
      ...(filters?.attendance_date
        ? { attendance_date: new Date(filters.attendance_date) }
        : {}),
    };

    const [data, totalData] = await Promise.all([
      this.prisma.attendances.findMany({
        where,
        skip,
        take: limit,
        select: attendanceSelect,
        orderBy: {
          created_at: "desc",
        },
      }),
      this.prisma.attendances.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return {
      data,
      meta: {
        totalData,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
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
