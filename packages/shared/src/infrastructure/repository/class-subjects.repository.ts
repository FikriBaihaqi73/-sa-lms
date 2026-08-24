import type { PrismaClient } from "#generated/client";
import {
  type ClassSubjectsEntity,
  classSubjectsSelect,
} from "#selects/class-subjects.select";

export interface CreateClassSubjectsInput {
  class_id: string;
  subject_id: string;
  teacher_id: string;
  academic_year_id: string;
}

export interface UpdateClassSubjectsInput {
  class_id?: string;
  subject_id?: string;
  teacher_id?: string;
  academic_year_id?: string;
}

export class ClassSubjectsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateClassSubjectsInput): Promise<ClassSubjectsEntity> {
    return this.prisma.classSubjects.create({
      data: {
        class_id: data.class_id,
        subject_id: data.subject_id,
        teacher_id: data.teacher_id,
        academic_year_id: data.academic_year_id,
      },
      select: classSubjectsSelect,
    });
  }

  async findById(id: string): Promise<ClassSubjectsEntity | null> {
    return this.prisma.classSubjects.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findByClass(class_id: string): Promise<ClassSubjectsEntity[]> {
    return this.prisma.classSubjects.findMany({
      where: {
        class_id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findBySubject(subject_id: string): Promise<ClassSubjectsEntity[]> {
    return this.prisma.classSubjects.findMany({
      where: {
        subject_id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findByTeacher(teacher_id: string): Promise<ClassSubjectsEntity[]> {
    return this.prisma.classSubjects.findMany({
      where: {
        teacher_id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findByAcademicYear(
    academic_year_id: string,
  ): Promise<ClassSubjectsEntity[]> {
    return this.prisma.classSubjects.findMany({
      where: {
        academic_year_id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findAll(): Promise<ClassSubjectsEntity[]> {
    return this.prisma.classSubjects.findMany({
      where: {
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async update(
    id: string,
    data: UpdateClassSubjectsInput,
  ): Promise<ClassSubjectsEntity> {
    return this.prisma.classSubjects.update({
      where: { id },
      data: {
        ...(data.class_id !== undefined && { class_id: data.class_id }),
        ...(data.subject_id !== undefined && { subject_id: data.subject_id }),
        ...(data.teacher_id !== undefined && { teacher_id: data.teacher_id }),
        ...(data.academic_year_id !== undefined && {
          academic_year_id: data.academic_year_id,
        }),
      },
      select: classSubjectsSelect,
    });
  }

  async delete(id: string): Promise<ClassSubjectsEntity> {
    return this.prisma.classSubjects.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
      select: classSubjectsSelect,
    });
  }
}
