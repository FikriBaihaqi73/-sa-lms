import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ExaminationScoreRepository } from "@repo/shared/infrastructure/repository/examination-score.repository";
import type {
  CreateExaminationScoreDto,
  UpdateExaminationScoreDto,
} from "@repo/shared/schemas/examination-score.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ExaminationScoreService {
  private readonly repository: ExaminationScoreRepository;

  constructor(private readonly prisma: PrismaService) {
    this.repository = new ExaminationScoreRepository(this.prisma.client);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    void page;
    void limit;
    void search;
    return this.repository.findAll();
  }

  async findOne(id: string) {
    const score = await this.repository.findById(id);
    if (!score) {
      throw new NotFoundException("Examination score not found");
    }
    return score;
  }

  async findByExamination(examinationId: string) {
    return this.repository.findByExamination(examinationId);
  }

  async findByStudent(studentId: string) {
    return this.repository.findByStudent(studentId);
  }

  async create(dto: CreateExaminationScoreDto) {
    const existing = await this.repository.findByExaminationAndStudent(
      dto.examinationId,
      dto.studentId,
    );
    if (existing) {
      throw new ConflictException(
        "Examination score already exists for this examination and student",
      );
    }

    return this.repository.create({
      examinationId: dto.examinationId,
      studentId: dto.studentId,
      ...(dto.score !== undefined ? { score: dto.score } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      ...(dto.gradedBy !== undefined ? { gradedBy: dto.gradedBy } : {}),
      ...(dto.gradedAt !== undefined
        ? { gradedAt: new Date(dto.gradedAt) }
        : {}),
    });
  }

  async update(id: string, dto: UpdateExaminationScoreDto) {
    await this.findOne(id);

    if (dto.examinationId !== undefined || dto.studentId !== undefined) {
      const current = await this.repository.findById(id);
      const targetExaminationId = dto.examinationId ?? current?.examinationId;
      const targetStudentId = dto.studentId ?? current?.studentId;

      if (!targetExaminationId || !targetStudentId) {
        throw new NotFoundException("Examination score data is incomplete");
      }

      const existing = await this.repository.findByExaminationAndStudent(
        targetExaminationId,
        targetStudentId,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          "Another examination score already exists for this examination and student",
        );
      }
    }

    return this.repository.update(id, {
      ...(dto.score !== undefined ? { score: dto.score } : {}),
      ...(dto.notes !== undefined ? { notes: dto.notes } : {}),
      ...(dto.gradedBy !== undefined ? { gradedBy: dto.gradedBy } : {}),
      ...(dto.gradedAt !== undefined
        ? { gradedAt: new Date(dto.gradedAt) }
        : {}),
      ...(dto.examinationId !== undefined
        ? { examinationId: dto.examinationId }
        : {}),
      ...(dto.studentId !== undefined ? { studentId: dto.studentId } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.repository.delete(id);
    return { success: true, id };
  }
}
