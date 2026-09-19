import type { Prisma, PrismaClient } from "#generated/client";
import {
  type StudentGradeEntity,
  studentGradeSelect,
} from "#selects/student-grade.select";

export interface CreateStudentGradeInput {
  studentId: string;
  classSubjectId: string;
  academicYearId: string;
  assignmentScore?: number | undefined;
  quizScore?: number | undefined;
  midExamScore?: number | undefined;
  finalExamScore?: number | undefined;
  finalScore?: number | undefined;
  gradeId?: string | undefined;
  remarks?: string | undefined;
}

export interface UpdateStudentGradeInput {
  studentId?: string | undefined;
  classSubjectId?: string | undefined;
  academicYearId?: string | undefined;
  assignmentScore?: number | undefined;
  quizScore?: number | undefined;
  midExamScore?: number | undefined;
  finalExamScore?: number | undefined;
  finalScore?: number | undefined;
  gradeId?: string | undefined;
  remarks?: string | undefined;
}

export interface StudentGradeSearchInput {
  search?: string | undefined;
}

export interface StudentGradePaginationResult {
  data: StudentGradeEntity[];
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
}

export class StudentGradeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateStudentGradeInput): Promise<StudentGradeEntity> {
    return this.prisma.studentGrades.create({
      data: {
        studentId: data.studentId,
        classSubjectId: data.classSubjectId,
        academicYearId: data.academicYearId,
        ...(data.assignmentScore !== undefined && {
          assignmentScore: data.assignmentScore,
        }),
        ...(data.quizScore !== undefined && { quizScore: data.quizScore }),
        ...(data.midExamScore !== undefined && {
          midExamScore: data.midExamScore,
        }),
        ...(data.finalExamScore !== undefined && {
          finalExamScore: data.finalExamScore,
        }),
        ...(data.finalScore !== undefined && {
          finalScore: data.finalScore,
        }),
        ...(data.gradeId !== undefined && { gradeId: data.gradeId }),
        ...(data.remarks !== undefined && { remarks: data.remarks }),
      },
      select: studentGradeSelect,
    });
  }

  async findById(id: string): Promise<StudentGradeEntity | null> {
    return this.prisma.studentGrades.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: studentGradeSelect,
    });
  }

  async findByStudentId(studentId: string): Promise<StudentGradeEntity[]> {
    return this.prisma.studentGrades.findMany({
      where: {
        studentId,
        deletedAt: null,
      },
      select: studentGradeSelect,
    });
  }

  async findByClassSubjectId(
    classSubjectId: string,
  ): Promise<StudentGradeEntity[]> {
    return this.prisma.studentGrades.findMany({
      where: {
        classSubjectId,
        deletedAt: null,
      },
      select: studentGradeSelect,
    });
  }

  async findByAcademicYearId(
    academicYearId: string,
  ): Promise<StudentGradeEntity[]> {
    return this.prisma.studentGrades.findMany({
      where: {
        academicYearId,
        deletedAt: null,
      },
      select: studentGradeSelect,
    });
  }

  async findByUniqueCombination(
    studentId: string,
    classSubjectId: string,
    academicYearId: string,
  ): Promise<StudentGradeEntity | null> {
    return this.prisma.studentGrades.findFirst({
      where: {
        studentId,
        classSubjectId,
        academicYearId,
        deletedAt: null,
      },
      select: studentGradeSelect,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: StudentGradeSearchInput,
  ): Promise<StudentGradePaginationResult> {
    const skip = (page - 1) * limit;
    const search = filters?.search?.trim();

    const where: Prisma.StudentGradesWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              {
                student: {
                  studentNumber: { contains: search, mode: "insensitive" },
                },
              },
              {
                student: {
                  profile: {
                    fullName: { contains: search, mode: "insensitive" },
                  },
                },
              },
              {
                classSubject: {
                  subject: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              },
              {
                classSubject: {
                  subject: {
                    code: { contains: search, mode: "insensitive" },
                  },
                },
              },
              {
                classSubject: {
                  class: {
                    name: { contains: search, mode: "insensitive" },
                  },
                },
              },
              {
                academicYear: {
                  academic_year: { contains: search, mode: "insensitive" },
                },
              },
              {
                grade: {
                  grade: { contains: search, mode: "insensitive" },
                },
              },
              {
                remarks: { contains: search, mode: "insensitive" },
              },
            ],
          }
        : {}),
    };

    const [data, totalData] = await Promise.all([
      this.prisma.studentGrades.findMany({
        where,
        skip,
        take: limit,
        select: studentGradeSelect,
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.studentGrades.count({
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
    data: UpdateStudentGradeInput,
  ): Promise<StudentGradeEntity> {
    return this.prisma.studentGrades.update({
      where: {
        id,
      },
      data: {
        ...(data.studentId !== undefined && { studentId: data.studentId }),
        ...(data.classSubjectId !== undefined && {
          classSubjectId: data.classSubjectId,
        }),
        ...(data.academicYearId !== undefined && {
          academicYearId: data.academicYearId,
        }),
        ...(data.assignmentScore !== undefined && {
          assignmentScore: data.assignmentScore,
        }),
        ...(data.quizScore !== undefined && { quizScore: data.quizScore }),
        ...(data.midExamScore !== undefined && {
          midExamScore: data.midExamScore,
        }),
        ...(data.finalExamScore !== undefined && {
          finalExamScore: data.finalExamScore,
        }),
        ...(data.finalScore !== undefined && {
          finalScore: data.finalScore,
        }),
        ...(data.gradeId !== undefined && { gradeId: data.gradeId }),
        ...(data.remarks !== undefined && { remarks: data.remarks }),
      },
      select: studentGradeSelect,
    });
  }

  async delete(id: string): Promise<StudentGradeEntity> {
    return this.prisma.studentGrades.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: studentGradeSelect,
    });
  }
}
