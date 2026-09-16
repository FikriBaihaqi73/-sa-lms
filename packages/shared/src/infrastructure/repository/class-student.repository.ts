import type { PrismaClient } from "#generated/client";
import {
  type ClassStudentEntity,
  classStudentSelect,
} from "#selects/class-student.select";

export interface CreateClassStudentInput {
  classId: string;
  studentId: string;
}

export interface UpdateClassStudentInput {
  classId?: string;
  studentId?: string;
}

export interface FindAllClassStudentInput {
  page?: number;
  limit?: number;
  search?: string;
}

export interface FindAllClassStudentResult {
  data: ClassStudentEntity[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ClassStudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateClassStudentInput): Promise<ClassStudentEntity> {
    return this.prisma.classStudent.create({
      data: {
        classId: data.classId,
        studentId: data.studentId,
      },
      select: classStudentSelect,
    });
  }

  async findById(id: string): Promise<ClassStudentEntity | null> {
    return this.prisma.classStudent.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: classStudentSelect,
    });
  }

  async findByClassAndStudent(
    classId: string,
    studentId: string,
  ): Promise<ClassStudentEntity | null> {
    return this.prisma.classStudent.findFirst({
      where: {
        classId,
        studentId,
        deletedAt: null,
      },
      select: classStudentSelect,
    });
  }

  async findByClass(classId: string): Promise<ClassStudentEntity[]> {
    return this.prisma.classStudent.findMany({
      where: {
        classId,
        deletedAt: null,
      },
      select: classStudentSelect,
    });
  }

  async findByStudent(studentId: string): Promise<ClassStudentEntity[]> {
    return this.prisma.classStudent.findMany({
      where: {
        studentId,
        deletedAt: null,
      },
      select: classStudentSelect,
    });
  }

  async findAll(
    params: FindAllClassStudentInput = {},
  ): Promise<FindAllClassStudentResult> {
    const page = Math.max(params.page ?? 1, 1);
    const limit = Math.min(Math.max(params.limit ?? 10, 1), 100);
    const search = params.search?.trim();

    const where = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              {
                classes: {
                  name: {
                    contains: search,
                    mode: "insensitive" as const,
                  },
                },
              },
              {
                student: {
                  studentNumber: {
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
      this.prisma.classStudent.findMany({
        where,
        select: classStudentSelect,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.classStudent.count({ where }),
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

  async update(
    id: string,
    data: UpdateClassStudentInput,
  ): Promise<ClassStudentEntity> {
    return this.prisma.classStudent.update({
      where: {
        id,
      },
      data: {
        ...(data.classId !== undefined && { classId: data.classId }),
        ...(data.studentId !== undefined && { studentId: data.studentId }),
      },
      select: classStudentSelect,
    });
  }

  async delete(id: string): Promise<ClassStudentEntity> {
    return this.prisma.classStudent.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: classStudentSelect,
    });
  }
}
