import type { PrismaClient } from "#generated/client";
import {
  type StudyResultEntity,
  studyResultSelect,
} from "#selects/study-result.select";

export interface CreateStudyResultInput {
  studentId: string;
  academicYearId: string;
  semesterId: string;
  totalCredits?: number | null;
  semesterGpa?: number | null;
  cumulativeGpa?: number | null;
  academicStatusId?: string | null;
}

export interface UpdateStudyResultInput {
  studentId?: string;
  academicYearId?: string;
  semesterId?: string;
  totalCredits?: number | null;
  semesterGpa?: number | null;
  cumulativeGpa?: number | null;
  academicStatusId?: string | null;
}

export class StudyResultRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateStudyResultInput): Promise<StudyResultEntity> {
    return this.prisma.studyResult.create({
      data: {
        studentId: data.studentId,
        academicYearId: data.academicYearId,
        semesterId: data.semesterId,
        totalCredits: data.totalCredits ?? null,
        semesterGpa: data.semesterGpa ?? null,
        cumulativeGpa: data.cumulativeGpa ?? null,
        academicStatusId: data.academicStatusId ?? null,
      },
      select: studyResultSelect,
    });
  }

  async findById(id: string): Promise<StudyResultEntity | null> {
    return this.prisma.studyResult.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: studyResultSelect,
    });
  }

  async findAll(): Promise<StudyResultEntity[]> {
    return this.prisma.studyResult.findMany({
      where: {
        deletedAt: null,
      },
      select: studyResultSelect,
    });
  }

  async update(
    id: string,
    data: UpdateStudyResultInput,
  ): Promise<StudyResultEntity> {
    return this.prisma.studyResult.update({
      where: {
        id,
      },
      data: {
        ...(data.studentId !== undefined && {
          studentId: data.studentId,
        }),
        ...(data.academicYearId !== undefined && {
          academicYearId: data.academicYearId,
        }),
        ...(data.semesterId !== undefined && {
          semesterId: data.semesterId,
        }),
        ...(data.totalCredits !== undefined && {
          totalCredits: data.totalCredits,
        }),
        ...(data.semesterGpa !== undefined && {
          semesterGpa: data.semesterGpa,
        }),
        ...(data.cumulativeGpa !== undefined && {
          cumulativeGpa: data.cumulativeGpa,
        }),
        ...(data.academicStatusId !== undefined && {
          academicStatusId: data.academicStatusId,
        }),
      },
      select: studyResultSelect,
    });
  }

  async delete(id: string): Promise<StudyResultEntity> {
    return this.prisma.studyResult.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: studyResultSelect,
    });
  }
}
