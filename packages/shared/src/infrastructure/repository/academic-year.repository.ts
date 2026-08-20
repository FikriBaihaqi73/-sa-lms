import type { PrismaClient } from "#generated/client";
import {
  type AcademicYearEntity,
  academicYearSelect,
} from "#selects/academic-year.select";

export interface CreateAcademicYearInput {
  academic_year: string;
  is_active?: boolean;
}

export interface UpdateAcademicYearInput {
  academic_year?: string;
  is_active?: boolean;
}

export class AcademicYearRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAcademicYearInput): Promise<AcademicYearEntity> {
    return this.prisma.academicYears.create({
      data: {
        academic_year: data.academic_year,
        is_active: data.is_active ?? false,
      },
      select: academicYearSelect,
    });
  }

  async findById(id: string): Promise<AcademicYearEntity | null> {
    return this.prisma.academicYears.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: academicYearSelect,
    });
  }

  async findByAcademicYear(
    academic_year: string,
  ): Promise<AcademicYearEntity | null> {
    return this.prisma.academicYears.findFirst({
      where: {
        academic_year,
        deleted_at: null,
      },
      select: academicYearSelect,
    });
  }

  async findAll(): Promise<AcademicYearEntity[]> {
    return this.prisma.academicYears.findMany({
      where: {
        deleted_at: null,
      },
      select: academicYearSelect,
    });
  }

  async update(
    id: string,
    data: UpdateAcademicYearInput,
  ): Promise<AcademicYearEntity> {
    return this.prisma.academicYears.update({
      where: {
        id,
      },
      data: {
        ...(data.academic_year !== undefined && {
          academic_year: data.academic_year,
        }),
        ...(data.is_active !== undefined && {
          is_active: data.is_active,
        }),
      },
      select: academicYearSelect,
    });
  }

  async delete(id: string): Promise<AcademicYearEntity> {
    return this.prisma.academicYears.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: academicYearSelect,
    });
  }
}
