import type { PrismaClient } from "#generated/client";
import {
  studentGradeSelect,
  type StudentGradeEntity,
} from "#selects/student-grade.select";

export interface CreateStudentGradeInput {
  studentId: string;
  classSubjectId: string;
  academicYearId: string;
  assignmentScore?: number;
  quizScore?: number;
  midExamScore?: number;
  finalExamScore?: number;
  finalScore?: number;
  gradeId?: string;
  remarks?: string;
}

export type UpdateStudentGradeInput = Partial<
  Omit<CreateStudentGradeInput, "studentId" | "classSubjectId" | "academicYearId">
>;

export class StudentGradeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateStudentGradeInput,
  ): Promise<StudentGradeEntity> {
    return this.prisma.studentGrades.create({
      data,
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

  async findAll(): Promise<StudentGradeEntity[]> {
    return this.prisma.studentGrades.findMany({
      where: {
        deletedAt: null,
      },
      select: studentGradeSelect,
    });
  }

  async update(
    id: string,
    data: UpdateStudentGradeInput,
  ): Promise<StudentGradeEntity> {
    return this.prisma.studentGrades.update({
      where: {
        id,
      },
      data,
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