import type { Prisma, PrismaClient } from "#generated/client";
import {
  type ClassSubjectsEntity,
  classSubjectsSelect,
} from "#selects/class-subjects.select";

export interface CreateClassSubjectsInput {
  class_id: string;
  subject_id: string;
  teacher_id: string;
  academic_year_id: string;
}

export interface UpdateClassSubjectsInput {
  class_id?: string;
  subject_id?: string;
  teacher_id?: string;
  academic_year_id?: string;
}

export interface ClassSubjectsSearchInput {
  search?: string | undefined;
}

export interface ClassSubjectsPaginationResult {
  data: ClassSubjectsEntity[];
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export class ClassSubjectsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateClassSubjectsInput): Promise<ClassSubjectsEntity> {
    return this.prisma.classSubjects.create({
      data: {
        class_id: data.class_id,
        subject_id: data.subject_id,
        teacher_id: data.teacher_id,
        academic_year_id: data.academic_year_id,
      },
      select: classSubjectsSelect,
    });
  }

  async findById(id: string): Promise<ClassSubjectsEntity | null> {
    return this.prisma.classSubjects.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findByClass(class_id: string): Promise<ClassSubjectsEntity[]> {
    return this.prisma.classSubjects.findMany({
      where: {
        class_id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findBySubject(subject_id: string): Promise<ClassSubjectsEntity[]> {
    return this.prisma.classSubjects.findMany({
      where: {
        subject_id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findByTeacher(teacher_id: string): Promise<ClassSubjectsEntity[]> {
    return this.prisma.classSubjects.findMany({
      where: {
        teacher_id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findByAcademicYear(
    academic_year_id: string,
  ): Promise<ClassSubjectsEntity[]> {
    return this.prisma.classSubjects.findMany({
      where: {
        academic_year_id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findByUniqueCombination(
    class_id: string,
    subject_id: string,
    teacher_id: string,
    academic_year_id: string,
  ): Promise<ClassSubjectsEntity | null> {
    return this.prisma.classSubjects.findFirst({
      where: {
        class_id,
        subject_id,
        teacher_id,
        academic_year_id,
        deleted_at: null,
      },
      select: classSubjectsSelect,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: ClassSubjectsSearchInput,
  ): Promise<ClassSubjectsPaginationResult> {
    const skip = (page - 1) * limit;
    const search = filters?.search?.trim();

    const where: Prisma.ClassSubjectsWhereInput = {
      deleted_at: null,
      ...(search
        ? {
            OR: [
              { class: { name: { contains: search, mode: "insensitive" } } },
              { subject: { name: { contains: search, mode: "insensitive" } } },
              { subject: { code: { contains: search, mode: "insensitive" } } },
              {
                teacher: {
                  teacher_number: { contains: search, mode: "insensitive" },
                },
              },
              {
                teacher: {
                  profile: {
                    fullName: { contains: search, mode: "insensitive" },
                  },
                },
              },
              {
                academic_year: {
                  academic_year: { contains: search, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    };

    const [data, totalData] = await Promise.all([
      this.prisma.classSubjects.findMany({
        where,
        skip,
        take: limit,
        select: classSubjectsSelect,
        orderBy: {
          created_at: "desc",
        },
      }),
      this.prisma.classSubjects.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return {
      data,
      meta: {
        totalData,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async update(
    id: string,
    data: UpdateClassSubjectsInput,
  ): Promise<ClassSubjectsEntity> {
    return this.prisma.classSubjects.update({
      where: { id },
      data: {
        ...(data.class_id !== undefined && { class_id: data.class_id }),
        ...(data.subject_id !== undefined && { subject_id: data.subject_id }),
        ...(data.teacher_id !== undefined && { teacher_id: data.teacher_id }),
        ...(data.academic_year_id !== undefined && {
          academic_year_id: data.academic_year_id,
        }),
      },
      select: classSubjectsSelect,
    });
  }

  async delete(id: string): Promise<ClassSubjectsEntity> {
    return this.prisma.classSubjects.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
      select: classSubjectsSelect,
    });
  }
}
