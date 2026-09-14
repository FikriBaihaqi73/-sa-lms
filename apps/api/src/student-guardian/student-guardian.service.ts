import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { StudentGuardianRepository } from "@repo/shared/infrastructure/repository/student-guardian.repository";
import type {
  CreateStudentGuardianDto,
  UpdateStudentGuardianDto,
} from "@repo/shared/schemas/student-guardian.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class StudentGuardianService {
  private readonly repository: StudentGuardianRepository;

  constructor(private readonly prisma: PrismaService) {
    this.repository = new StudentGuardianRepository(this.prisma.client);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    return this.repository.findAll(page, limit, search);
  }

  async findOne(id: string) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException("Student guardian relation not found");
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

  async findByGuardianId(guardianId: string) {
    const guardianExists = await this.prisma.client.guardian.findFirst({
      where: { id: guardianId, deletedAt: null },
    });
    if (!guardianExists) {
      throw new NotFoundException("Guardian not found");
    }
    return this.repository.findByGuardianId(guardianId);
  }

  async create(dto: CreateStudentGuardianDto) {
    const student = await this.prisma.client.student.findFirst({
      where: { id: dto.studentId, deletedAt: null },
    });
    if (!student) {
      throw new NotFoundException("Student not found");
    }

    const guardian = await this.prisma.client.guardian.findFirst({
      where: { id: dto.guardianId, deletedAt: null },
    });
    if (!guardian) {
      throw new NotFoundException("Guardian not found");
    }

    const existingRelation = await this.repository.findByStudentAndGuardian(
      dto.studentId,
      dto.guardianId,
    );
    if (existingRelation) {
      throw new ConflictException("Student guardian relation already exists");
    }

    return this.repository.create({
      studentId: dto.studentId,
      guardianId: dto.guardianId,
      isPrimary: dto.isPrimary ?? false,
    });
  }

  async update(id: string, dto: UpdateStudentGuardianDto) {
    const current = await this.findOne(id);

    const targetStudentId = dto.studentId ?? current.studentId;
    const targetGuardianId = dto.guardianId ?? current.guardianId;

    if (dto.studentId !== undefined && dto.studentId !== current.studentId) {
      const student = await this.prisma.client.student.findFirst({
        where: { id: dto.studentId, deletedAt: null },
      });
      if (!student) {
        throw new NotFoundException("Student not found");
      }
    }

    if (dto.guardianId !== undefined && dto.guardianId !== current.guardianId) {
      const guardian = await this.prisma.client.guardian.findFirst({
        where: { id: dto.guardianId, deletedAt: null },
      });
      if (!guardian) {
        throw new NotFoundException("Guardian not found");
      }
    }

    if (
      targetStudentId !== current.studentId ||
      targetGuardianId !== current.guardianId
    ) {
      const existingRelation = await this.repository.findByStudentAndGuardian(
        targetStudentId,
        targetGuardianId,
      );
      if (existingRelation && existingRelation.id !== id) {
        throw new ConflictException("Student guardian relation already exists");
      }
    }

    return this.repository.update(id, {
      ...(dto.studentId !== undefined ? { studentId: dto.studentId } : {}),
      ...(dto.guardianId !== undefined ? { guardianId: dto.guardianId } : {}),
      ...(dto.isPrimary !== undefined ? { isPrimary: dto.isPrimary } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repository.delete(id);
    return { success: true, id };
  }
}
