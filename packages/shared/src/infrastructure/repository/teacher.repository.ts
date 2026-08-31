import type { PrismaClient } from "#generated/client";
import { type TeacherEntity, teacherSelect } from "#selects/teacher.select";

export interface CreateTeacherInput {
  profile_id: string;
  department_id?: string;
  specialization_id?: string;
  employment_status_id?: string;
  teacher_number: string;
  join_date?: Date;
}

export interface UpdateTeacherInput {
  profile_id?: string;
  department_id?: string;
  specialization_id?: string;
  employment_status_id?: string;
  teacher_number?: string;
  join_date?: Date;
}

export class TeacherRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateTeacherInput): Promise<TeacherEntity> {
    return this.prisma.teachers.create({
      data: {
        profile_id: data.profile_id,
        department_id: data.department_id ?? null,
        specialization_id: data.specialization_id ?? null,
        employment_status_id: data.employment_status_id ?? null,
        teacher_number: data.teacher_number,
        join_date: data.join_date ?? null,
      },
      select: teacherSelect,
    });
  }
  async findById(id: string): Promise<TeacherEntity | null> {
    return this.prisma.teachers.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: teacherSelect,
    });
  }

  async findByTeacherNumber(
    teacher_number: string,
  ): Promise<TeacherEntity | null> {
    return this.prisma.teachers.findFirst({
      where: {
        teacher_number,
        deleted_at: null,
      },
      select: teacherSelect,
    });
  }

  async findAll(): Promise<TeacherEntity[]> {
    return this.prisma.teachers.findMany({
      where: {
        deleted_at: null,
      },
      select: teacherSelect,
    });
  }

  async update(id: string, data: UpdateTeacherInput): Promise<TeacherEntity> {
    return this.prisma.teachers.update({
      where: { id },
      data: {
        ...(data.profile_id !== undefined && {
          profile_id: data.profile_id,
        }),
        ...(data.department_id !== undefined && {
          department_id: data.department_id,
        }),
        ...(data.specialization_id !== undefined && {
          specialization_id: data.specialization_id,
        }),
        ...(data.employment_status_id !== undefined && {
          employment_status_id: data.employment_status_id,
        }),
        ...(data.teacher_number !== undefined && {
          teacher_number: data.teacher_number,
        }),
        ...(data.join_date !== undefined && {
          join_date: data.join_date,
        }),
      },
      select: teacherSelect,
    });
  }

  async delete(id: string): Promise<TeacherEntity> {
    return this.prisma.teachers.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
      select: teacherSelect,
    });
  }
}
