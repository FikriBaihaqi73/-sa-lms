import type { Prisma, PrismaClient } from "#generated/client";
import { type ClassEntity, classSelect } from "#selects/class.select";

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
  homeroom_teacher_id?: string | null;
  academic_year_id?: string;
  name?: string;
  grade_level?: number;
  capacity?: number | null;
}

export interface ClassSearchInput {
  search?: string | undefined;
}

export interface FindAllClassResult {
  data: ClassEntity[];
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
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

  async findAll(
    page: number,
    limit: number,
    filters?: ClassSearchInput,
  ): Promise<FindAllClassResult> {
    const currentPage = Math.max(Math.floor(page || 1), 1);
    const perPage = Math.min(Math.max(Math.floor(limit || 10), 1), 100);
    const search = filters?.search?.trim();
    const where = {
      deleted_at: null,
      ...(search
        ? {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          }
        : {}),
    } satisfies Prisma.ClassesWhereInput;

    const [data, totalData] = await Promise.all([
      this.prisma.classes.findMany({
        where,
        skip: (currentPage - 1) * perPage,
        take: perPage,
        select: classSelect,
        orderBy: {
          created_at: "desc",
        },
      }),
      this.prisma.classes.count({ where }),
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

  async update(id: string, data: UpdateClassInput): Promise<ClassEntity> {
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
