import type { PrismaClient } from "#generated/client";
import {
  examinationSelect,
  type ExaminationEntity,
} from "#selects/examination.select";

export interface CreateExaminationInput {
  createdBy?: string;
  classSubjectId?: string;
  assignmentTypeId?: string;
  title: string;
  description?: string;
  examinationDate?: Date;
  duration?: number;
  maximumScore?: number;
}

export interface UpdateExaminationInput {
  updatedBy?: string;
  classSubjectId?: string;
  assignmentTypeId?: string;
  title?: string;
  description?: string;
  examinationDate?: Date;
  duration?: number;
  maximumScore?: number;
}

export class ExaminationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateExaminationInput,
  ): Promise<ExaminationEntity> {
    return this.prisma.examinations.create({
      data: {
        title: data.title,

        ...(data.createdBy !== undefined && {
          createdBy: data.createdBy,
        }),

        ...(data.classSubjectId !== undefined && {
          classSubjectId: data.classSubjectId,
        }),

        ...(data.assignmentTypeId !== undefined && {
          assignmentTypeId: data.assignmentTypeId,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.examinationDate !== undefined && {
          examinationDate: data.examinationDate,
        }),

        ...(data.duration !== undefined && {
          duration: data.duration,
        }),

        ...(data.maximumScore !== undefined && {
          maximumScore: data.maximumScore,
        }),
      },
      select: examinationSelect,
    });
  }

  async findById(id: string): Promise<ExaminationEntity | null> {
    return this.prisma.examinations.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: examinationSelect,
    });
  }

  async findAll(): Promise<ExaminationEntity[]> {
    return this.prisma.examinations.findMany({
      where: {
        deletedAt: null,
      },
      select: examinationSelect,
    });
  }

  async update(
    id: string,
    data: UpdateExaminationInput,
  ): Promise<ExaminationEntity> {
    return this.prisma.examinations.update({
      where: {
        id,
      },
      data: {
        ...(data.updatedBy !== undefined && {
          updatedBy: data.updatedBy,
        }),

        ...(data.classSubjectId !== undefined && {
          classSubjectId: data.classSubjectId,
        }),

        ...(data.assignmentTypeId !== undefined && {
          assignmentTypeId: data.assignmentTypeId,
        }),

        ...(data.title !== undefined && {
          title: data.title,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.examinationDate !== undefined && {
          examinationDate: data.examinationDate,
        }),

        ...(data.duration !== undefined && {
          duration: data.duration,
        }),

        ...(data.maximumScore !== undefined && {
          maximumScore: data.maximumScore,
        }),
      },
      select: examinationSelect,
    });
  }

  async softDelete(id: string): Promise<ExaminationEntity> {
    return this.prisma.examinations.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: examinationSelect,
    });
  }
}