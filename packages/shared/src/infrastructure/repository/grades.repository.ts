import type { GradeEntity } from "#entities/grades.entity";
import type { PrismaClient } from "#generated/client";
import { gradeSelect } from "#selects/grades.select";

export interface CreateGradeInput {
  grade: string;
  minimumScore?: number;
  maximumScore?: number;
  description?: string;
}

export interface UpdateGradeInput {
  grade?: string;
  minimumScore?: number;
  maximumScore?: number;
  description?: string;
}

export class GradeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateGradeInput): Promise<GradeEntity> {
    return this.prisma.grades.create({
      data: {
        grade: data.grade,
        ...(data.minimumScore !== undefined && {
          minimumScore: data.minimumScore,
        }),
        ...(data.maximumScore !== undefined && {
          maximumScore: data.maximumScore,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
      select: gradeSelect,
    });
  }

  async findById(id: string): Promise<GradeEntity | null> {
    return this.prisma.grades.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: gradeSelect,
    });
  }

  async findByGrade(grade: string): Promise<GradeEntity | null> {
    return this.prisma.grades.findFirst({
      where: {
        grade,
        deletedAt: null,
      },
      select: gradeSelect,
    });
  }

  async findAll(): Promise<GradeEntity[]> {
    return this.prisma.grades.findMany({
      where: {
        deletedAt: null,
      },
      select: gradeSelect,
    });
  }

  async update(id: string, data: UpdateGradeInput): Promise<GradeEntity> {
    return this.prisma.grades.update({
      where: {
        id,
      },
      data: {
        ...(data.grade !== undefined && { grade: data.grade }),
        ...(data.minimumScore !== undefined && {
          minimumScore: data.minimumScore,
        }),
        ...(data.maximumScore !== undefined && {
          maximumScore: data.maximumScore,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
      select: gradeSelect,
    });
  }

  async delete(id: string): Promise<GradeEntity> {
    return this.prisma.grades.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: gradeSelect,
    });
  }
}
