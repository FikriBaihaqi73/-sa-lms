import type { PrismaClient } from "#generated/client";
import {
  classSelect,
  type ClassEntity,
} from "#selects/class.select";

export interface CreateClassInput {
  institution_id: string;
  homeroom_teacher_id?: string;
  academic_year_id: string;
  name: string;
  grade_level: number;
  capacity?: number;
}

export interface UpdateClassInput {
  institution_id?: string;
  homeroom_teacher_id?: string;
  academic_year_id?: string;
  name?: string;
  grade_level?: number;
  capacity?: number;
}

export class ClassRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateClassInput): Promise<ClassEntity> {
    return this.prisma.classes.create({
      data: {
        institution_id: data.institution_id,
        homeroom_teacher_id: data.homeroom_teacher_id ?? null,
        academic_year_id: data.academic_year_id,
        name: data.name,
        grade_level: data.grade_level,
        capacity: data.capacity ?? null,
      },
      select: classSelect,
    });
  }

  async findById(id: string): Promise<ClassEntity | null> {
    return this.prisma.classes.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: classSelect,
    });
  }

  async findAll(): Promise<ClassEntity[]> {
    return this.prisma.classes.findMany({
      where: {
        deleted_at: null,
      },
      select: classSelect,
    });
  }

  async update(
    id: string,
    data: UpdateClassInput,
  ): Promise<ClassEntity> {
    return this.prisma.classes.update({
      where: { id },
      data: {
        ...(data.institution_id !== undefined && {
          institution_id: data.institution_id,
        }),
        ...(data.homeroom_teacher_id !== undefined && {
          homeroom_teacher_id: data.homeroom_teacher_id,
        }),
        ...(data.academic_year_id !== undefined && {
          academic_year_id: data.academic_year_id,
        }),
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.grade_level !== undefined && {
          grade_level: data.grade_level,
        }),
        ...(data.capacity !== undefined && {
          capacity: data.capacity,
        }),
      },
      select: classSelect,
    });
  }

  async delete(id: string): Promise<ClassEntity> {
    return this.prisma.classes.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
      select: classSelect,
    });
  }
}
