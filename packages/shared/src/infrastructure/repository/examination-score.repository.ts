import type { PrismaClient } from "#generated/client";
import {
  examinationScoreSelect,
  type ExaminationScoreEntity,
} from "#selects/examination-score.select";

export interface CreateExaminationScoreInput {
  examinationId: string;
  studentId: string;
  score?: number;
  notes?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

export interface UpdateExaminationScoreInput {
  score?: number;
  notes?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

export class ExaminationScoreRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateExaminationScoreInput,
  ): Promise<ExaminationScoreEntity> {
    return this.prisma.examinationScores.create({
      data: {
        examinationId: data.examinationId,
        studentId: data.studentId,

        ...(data.score !== undefined && {
          score: data.score,
        }),

        ...(data.notes !== undefined && {
          notes: data.notes,
        }),

        ...(data.gradedBy !== undefined && {
          gradedBy: data.gradedBy,
        }),

        ...(data.gradedAt !== undefined && {
          gradedAt: data.gradedAt,
        }),
      },
      select: examinationScoreSelect,
    });
  }

  async findById(
    id: string,
  ): Promise<ExaminationScoreEntity | null> {
    return this.prisma.examinationScores.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: examinationScoreSelect,
    });
  }

  async findByExaminationAndStudent(
    examinationId: string,
    studentId: string,
  ): Promise<ExaminationScoreEntity | null> {
    return this.prisma.examinationScores.findFirst({
      where: {
        examinationId,
        studentId,
        deletedAt: null,
      },
      select: examinationScoreSelect,
    });
  }

  async findByExamination(
    examinationId: string,
  ): Promise<ExaminationScoreEntity[]> {
    return this.prisma.examinationScores.findMany({
      where: {
        examinationId,
        deletedAt: null,
      },
      select: examinationScoreSelect,
    });
  }

  async findByStudent(
    studentId: string,
  ): Promise<ExaminationScoreEntity[]> {
    return this.prisma.examinationScores.findMany({
      where: {
        studentId,
        deletedAt: null,
      },
      select: examinationScoreSelect,
    });
  }

  async findAll(): Promise<ExaminationScoreEntity[]> {
    return this.prisma.examinationScores.findMany({
      where: {
        deletedAt: null,
      },
      select: examinationScoreSelect,
    });
  }

  async update(
    id: string,
    data: UpdateExaminationScoreInput,
  ): Promise<ExaminationScoreEntity> {
    return this.prisma.examinationScores.update({
      where: {
        id,
      },
      data: {
        ...(data.score !== undefined && {
          score: data.score,
        }),

        ...(data.notes !== undefined && {
          notes: data.notes,
        }),

        ...(data.gradedBy !== undefined && {
          gradedBy: data.gradedBy,
        }),

        ...(data.gradedAt !== undefined && {
          gradedAt: data.gradedAt,
        }),
      },
      select: examinationScoreSelect,
    });
  }

  async delete(id: string): Promise<ExaminationScoreEntity> {
    return this.prisma.examinationScores.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: examinationScoreSelect,
    });
  }
}