import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { GradeRepository } from "@repo/shared/infrastructure/repository/grades.repository";
import type {
  CreateGradeDto,
  UpdateGradeDto,
} from "@repo/shared/schemas/grade.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class GradeService {
  private readonly gradesRepository: GradeRepository;

  constructor(private readonly prisma: PrismaService) {
    this.gradesRepository = new GradeRepository(this.prisma.client);
  }

  async findAll() {
    return this.gradesRepository.findAll();
  }

  async findOne(id: string) {
    const grade = await this.gradesRepository.findById(id);
    if (!grade) {
      throw new NotFoundException("Grade not found");
    }
    return grade;
  }

  async create(dto: CreateGradeDto) {
    const existing = await this.gradesRepository.findByGrade(dto.grade);
    if (existing) {
      throw new ConflictException("Grade already exists");
    }

    return this.gradesRepository.create({
      grade: dto.grade,
      ...(dto.minimumScore !== undefined
        ? { minimumScore: dto.minimumScore }
        : {}),
      ...(dto.maximumScore !== undefined
        ? { maximumScore: dto.maximumScore }
        : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async update(id: string, dto: UpdateGradeDto) {
    await this.findOne(id);

    if (dto.grade !== undefined) {
      const existing = await this.gradesRepository.findByGrade(dto.grade);
      if (existing && existing.id !== id) {
        throw new ConflictException("Grade is already in use by another grade");
      }
    }

    return this.gradesRepository.update(id, {
      ...(dto.grade !== undefined ? { grade: dto.grade } : {}),
      ...(dto.minimumScore !== undefined
        ? { minimumScore: dto.minimumScore }
        : {}),
      ...(dto.maximumScore !== undefined
        ? { maximumScore: dto.maximumScore }
        : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.gradesRepository.delete(id);
    return { success: true, id };
  }
}
