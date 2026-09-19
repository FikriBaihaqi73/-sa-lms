import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { StudentGradeRepository } from "@repo/shared/infrastructure/repository/student-grade.repository";
import type {
  CreateStudentGradeDto,
  UpdateStudentGradeDto,
} from "@repo/shared/schemas/student-grade.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class StudentGradeService {
  private readonly repository: StudentGradeRepository;

  constructor(private readonly prisma: PrismaService) {
    this.repository = new StudentGradeRepository(this.prisma.client);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    return this.repository.findAll(page, limit, { search });
  }

  async findOne(id: string) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException("Student grade record not found");
    }
    return record;
  }

  async findByStudentId(studentId: string) {
    const studentExists = await this.prisma.client.student.findFirst({
      where: { id: studentId, deletedAt: null },
    });
    if (!studentExists) {
      throw new NotFoundException("Student not found");
    }
    return this.repository.findByStudentId(studentId);
  }

  async findByClassSubjectId(classSubjectId: string) {
    const classSubjectExists = await this.prisma.client.classSubjects.findFirst(
      {
        where: { id: classSubjectId, deleted_at: null },
      },
    );
    if (!classSubjectExists) {
      throw new NotFoundException("Class subject not found");
    }
    return this.repository.findByClassSubjectId(classSubjectId);
  }

  async findByAcademicYearId(academicYearId: string) {
    const academicYearExists = await this.prisma.client.academicYears.findFirst(
      {
        where: { id: academicYearId, deleted_at: null },
      },
    );
    if (!academicYearExists) {
      throw new NotFoundException("Academic year not found");
    }
    return this.repository.findByAcademicYearId(academicYearId);
  }

  async create(dto: CreateStudentGradeDto) {
    const studentExists = await this.prisma.client.student.findFirst({
      where: { id: dto.studentId, deletedAt: null },
    });
    if (!studentExists) {
      throw new NotFoundException("Student not found");
    }

    const classSubjectExists = await this.prisma.client.classSubjects.findFirst(
      {
        where: { id: dto.classSubjectId, deleted_at: null },
      },
    );
    if (!classSubjectExists) {
      throw new NotFoundException("Class subject not found");
    }

    const academicYearExists = await this.prisma.client.academicYears.findFirst(
      {
        where: { id: dto.academicYearId, deleted_at: null },
      },
    );
    if (!academicYearExists) {
      throw new NotFoundException("Academic year not found");
    }

    if (dto.gradeId) {
      const gradeExists = await this.prisma.client.grades.findFirst({
        where: { id: dto.gradeId, deletedAt: null },
      });
      if (!gradeExists) {
        throw new NotFoundException("Grade letter not found");
      }
    }

    const existingCombination = await this.repository.findByUniqueCombination(
      dto.studentId,
      dto.classSubjectId,
      dto.academicYearId,
    );
    if (existingCombination) {
      throw new ConflictException(
        "Student grade record already exists for this student, class subject, and academic year",
      );
    }

    return this.repository.create({
      studentId: dto.studentId,
      classSubjectId: dto.classSubjectId,
      academicYearId: dto.academicYearId,
      assignmentScore: dto.assignmentScore,
      quizScore: dto.quizScore,
      midExamScore: dto.midExamScore,
      finalExamScore: dto.finalExamScore,
      finalScore: dto.finalScore,
      gradeId: dto.gradeId,
      remarks: dto.remarks,
    });
  }

  async update(id: string, dto: UpdateStudentGradeDto) {
    const current = await this.findOne(id);

    const targetStudentId = dto.studentId ?? current.studentId;
    const targetClassSubjectId = dto.classSubjectId ?? current.classSubjectId;
    const targetAcademicYearId = dto.academicYearId ?? current.academicYearId;

    if (dto.studentId !== undefined && dto.studentId !== current.studentId) {
      const studentExists = await this.prisma.client.student.findFirst({
        where: { id: dto.studentId, deletedAt: null },
      });
      if (!studentExists) {
        throw new NotFoundException("Student not found");
      }
    }

    if (
      dto.classSubjectId !== undefined &&
      dto.classSubjectId !== current.classSubjectId
    ) {
      const classSubjectExists =
        await this.prisma.client.classSubjects.findFirst({
          where: { id: dto.classSubjectId, deleted_at: null },
        });
      if (!classSubjectExists) {
        throw new NotFoundException("Class subject not found");
      }
    }

    if (
      dto.academicYearId !== undefined &&
      dto.academicYearId !== current.academicYearId
    ) {
      const academicYearExists =
        await this.prisma.client.academicYears.findFirst({
          where: { id: dto.academicYearId, deleted_at: null },
        });
      if (!academicYearExists) {
        throw new NotFoundException("Academic year not found");
      }
    }

    if (dto.gradeId !== undefined && dto.gradeId !== current.gradeId) {
      if (dto.gradeId !== null) {
        const gradeExists = await this.prisma.client.grades.findFirst({
          where: { id: dto.gradeId, deletedAt: null },
        });
        if (!gradeExists) {
          throw new NotFoundException("Grade letter not found");
        }
      }
    }

    if (
      targetStudentId !== current.studentId ||
      targetClassSubjectId !== current.classSubjectId ||
      targetAcademicYearId !== current.academicYearId
    ) {
      const existingCombination = await this.repository.findByUniqueCombination(
        targetStudentId,
        targetClassSubjectId,
        targetAcademicYearId,
      );
      if (existingCombination && existingCombination.id !== id) {
        throw new ConflictException(
          "Student grade record already exists for this student, class subject, and academic year",
        );
      }
    }

    return this.repository.update(id, {
      ...(dto.studentId !== undefined ? { studentId: dto.studentId } : {}),
      ...(dto.classSubjectId !== undefined
        ? { classSubjectId: dto.classSubjectId }
        : {}),
      ...(dto.academicYearId !== undefined
        ? { academicYearId: dto.academicYearId }
        : {}),
      ...(dto.assignmentScore !== undefined
        ? { assignmentScore: dto.assignmentScore }
        : {}),
      ...(dto.quizScore !== undefined ? { quizScore: dto.quizScore } : {}),
      ...(dto.midExamScore !== undefined
        ? { midExamScore: dto.midExamScore }
        : {}),
      ...(dto.finalExamScore !== undefined
        ? { finalExamScore: dto.finalExamScore }
        : {}),
      ...(dto.finalScore !== undefined ? { finalScore: dto.finalScore } : {}),
      ...(dto.gradeId !== undefined ? { gradeId: dto.gradeId } : {}),
      ...(dto.remarks !== undefined ? { remarks: dto.remarks } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    const result = await this.repository.delete(id);
    return result;
  }
}
