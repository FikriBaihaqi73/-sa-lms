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

  async findAll(): Promise<ClassStudentEntity[]> {
    return this.prisma.classStudent.findMany({
      where: {
        deletedAt: null,
      },
      select: classStudentSelect,
    });
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