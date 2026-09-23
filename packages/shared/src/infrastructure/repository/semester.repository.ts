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

export interface FindAllSemesterInput {
  page?: number;
  limit?: number;
  search?: string;
  academic_year_id?: string;
}

export interface FindAllSemesterResult {
  data: SemesterEntity[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
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

  async findAll(
    params: FindAllSemesterInput = {},
  ): Promise<FindAllSemesterResult> {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 10, 1), 100);
    const search = params.search?.trim();

    const where = {
      deleted_at: null,
      ...(params.academic_year_id !== undefined && {
        academic_year_id: params.academic_year_id,
      }),
      ...(search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
              {
                academicYear: {
                  academic_year: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.semesters.findMany({
        where,
        select: semesterSelect,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          created_at: "desc",
        },
      }),
      this.prisma.semesters.count({ where }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
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
