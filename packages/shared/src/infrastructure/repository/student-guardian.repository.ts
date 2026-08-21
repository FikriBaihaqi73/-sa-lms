import type { PrismaClient } from "#generated/client";
import {
  type StudentGuardianEntity,
  studentGuardianSelect,
} from "#selects/student-guardian.select";

export interface CreateStudentGuardianInput {
  studentId: string;
  guardianId: string;
  isPrimary?: boolean;
}

export interface UpdateStudentGuardianInput {
  studentId?: string;
  guardianId?: string;
  isPrimary?: boolean;
}

export class StudentGuardianRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateStudentGuardianInput,
  ): Promise<StudentGuardianEntity> {
    return this.prisma.studentGuardian.create({
      data: {
        studentId: data.studentId,
        guardianId: data.guardianId,
        isPrimary: data.isPrimary ?? false,
      },
      select: studentGuardianSelect,
    });
  }

  async findById(id: string): Promise<StudentGuardianEntity | null> {
    return this.prisma.studentGuardian.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: studentGuardianSelect,
    });
  }

  async findAll(): Promise<StudentGuardianEntity[]> {
    return this.prisma.studentGuardian.findMany({
      where: {
        deletedAt: null,
      },
      select: studentGuardianSelect,
    });
  }

  async findByStudentId(studentId: string): Promise<StudentGuardianEntity[]> {
    return this.prisma.studentGuardian.findMany({
      where: {
        studentId,
        deletedAt: null,
      },
      select: studentGuardianSelect,
    });
  }

  async findByGuardianId(guardianId: string): Promise<StudentGuardianEntity[]> {
    return this.prisma.studentGuardian.findMany({
      where: {
        guardianId,
        deletedAt: null,
      },
      select: studentGuardianSelect,
    });
  }

  async update(
    id: string,
    data: UpdateStudentGuardianInput,
  ): Promise<StudentGuardianEntity> {
    return this.prisma.studentGuardian.update({
      where: {
        id,
      },
      data: {
        ...(data.studentId !== undefined && {
          studentId: data.studentId,
        }),
        ...(data.guardianId !== undefined && {
          guardianId: data.guardianId,
        }),
        ...(data.isPrimary !== undefined && {
          isPrimary: data.isPrimary,
        }),
      },
      select: studentGuardianSelect,
    });
  }

  async delete(id: string): Promise<StudentGuardianEntity> {
    return this.prisma.studentGuardian.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: studentGuardianSelect,
    });
  }
}
