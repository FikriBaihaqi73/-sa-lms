import type { Prisma, PrismaClient } from "#generated/client";
import {
  type ExaminationEntity,
  examinationSelect,
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

export interface ExaminationSearchInput {
  search?: string | undefined;
}

export interface ExaminationPaginationResult {
  data: ExaminationEntity[];
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export class ExaminationRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateExaminationInput): Promise<ExaminationEntity> {
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

  async findAll(
    page = 1,
    limit = 10,
    filters?: ExaminationSearchInput,
  ): Promise<ExaminationPaginationResult> {
    const currentPage = Math.max(Math.floor(page || 1), 1);
    const perPage = Math.min(Math.max(Math.floor(limit || 10), 1), 100);
    const search = filters?.search?.trim();

    const where: Prisma.ExaminationsWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [data, totalData] = await Promise.all([
      this.prisma.examinations.findMany({
        where,
        skip: (currentPage - 1) * perPage,
        take: perPage,
        select: examinationSelect,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.examinations.count({ where }),
    ]);

    return {
      data,
      meta: {
        totalData,
        totalPages: Math.ceil(totalData / perPage),
        currentPage,
        perPage,
      },
    };
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
