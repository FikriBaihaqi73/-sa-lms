import type { PrismaClient } from "#generated/client";
import { type SemesterEntity, semesterSelect } from "#selects/semester.select";

export interface CreateSemesterInput {
  academic_year_id: string;
  name: string;
  start_date?: Date | null;
  end_date?: Date | null;
  is_active?: boolean;
}

export interface UpdateSemesterInput {
  academic_year_id?: string;
  name?: string;
  start_date?: Date | null;
  end_date?: Date | null;
  is_active?: boolean;
}

export class SemesterRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateSemesterInput): Promise<SemesterEntity> {
    return this.prisma.semesters.create({
      data: {
        academic_year_id: data.academic_year_id,
        name: data.name,
        ...(data.start_date !== undefined && { start_date: data.start_date }),
        ...(data.end_date !== undefined && { end_date: data.end_date }),
        is_active: data.is_active ?? false,
      },
      select: semesterSelect,
    });
  }

  async findById(id: string): Promise<SemesterEntity | null> {
    return this.prisma.semesters.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: semesterSelect,
    });
  }

  async findByAcademicYearId(
    academic_year_id: string,
  ): Promise<SemesterEntity[]> {
    return this.prisma.semesters.findMany({
      where: {
        academic_year_id,
        deleted_at: null,
      },
      select: semesterSelect,
    });
  }

  async findAll(): Promise<SemesterEntity[]> {
    return this.prisma.semesters.findMany({
      where: {
        deleted_at: null,
      },
      select: semesterSelect,
    });
  }

  async update(id: string, data: UpdateSemesterInput): Promise<SemesterEntity> {
    return this.prisma.semesters.update({
      where: {
        id,
      },
      data: {
        ...(data.academic_year_id !== undefined && {
          academic_year_id: data.academic_year_id,
        }),
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.start_date !== undefined && {
          start_date: data.start_date,
        }),
        ...(data.end_date !== undefined && {
          end_date: data.end_date,
        }),
        ...(data.is_active !== undefined && {
          is_active: data.is_active,
        }),
      },
      select: semesterSelect,
    });
  }

  async delete(id: string): Promise<SemesterEntity> {
    return this.prisma.semesters.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: semesterSelect,
    });
  }
}
