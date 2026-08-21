import type { PrismaClient } from "#generated/client";
import {
  studentSelect,
  type StudentEntity,
} from "#selects/students.select";

export interface CreateStudentInput {
  profileId: string;
  departmentId?: string | null;
  academicStatusId: string;
  studentNumber: string;
  enrollmentYear?: number | null;
}

export interface UpdateStudentInput {
  departmentId?: string | null;
  academicStatusId?: string;
  studentNumber?: string;
  enrollmentYear?: number | null;
}

export class StudentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateStudentInput): Promise<StudentEntity> {
    return this.prisma.student.create({
      data: {
        profileId: data.profileId,
        departmentId: data.departmentId ?? null,
        academicStatusId: data.academicStatusId,
        studentNumber: data.studentNumber,
        enrollmentYear: data.enrollmentYear ?? null,
      },
      select: studentSelect,
    });
  }

  async findById(id: string): Promise<StudentEntity | null> {
    return this.prisma.student.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: studentSelect,
    });
  }

  async findByStudentNumber(
    studentNumber: string,
  ): Promise<StudentEntity | null> {
    return this.prisma.student.findFirst({
      where: {
        studentNumber,
        deletedAt: null,
      },
      select: studentSelect,
    });
  }

  async findByProfileId(profileId: string): Promise<StudentEntity | null> {
    return this.prisma.student.findFirst({
      where: {
        profileId,
        deletedAt: null,
      },
      select: studentSelect,
    });
  }

  async findAll(): Promise<StudentEntity[]> {
    return this.prisma.student.findMany({
      where: {
        deletedAt: null,
      },
      select: studentSelect,
    });
  }

  async update(
    id: string,
    data: UpdateStudentInput,
  ): Promise<StudentEntity> {
    return this.prisma.student.update({
      where: {
        id,
      },
      data: {
        ...(data.departmentId !== undefined && {
          departmentId: data.departmentId,
        }),
        ...(data.academicStatusId !== undefined && {
          academicStatusId: data.academicStatusId,
        }),
        ...(data.studentNumber !== undefined && {
          studentNumber: data.studentNumber,
        }),
        ...(data.enrollmentYear !== undefined && {
          enrollmentYear: data.enrollmentYear,
        }),
      },
      select: studentSelect,
    });
  }

  async delete(id: string): Promise<StudentEntity> {
    return this.prisma.student.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: studentSelect,
    });
  }
}