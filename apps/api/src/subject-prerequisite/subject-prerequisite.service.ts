import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SubjectRepository } from "@repo/shared/infrastructure/repository/subject.repository";
import { SubjectPrerequisitesRepository } from "@repo/shared/infrastructure/repository/subject-prerequisites.repository";
import type {
  CreateSubjectPrerequisiteDto,
  SubjectPrerequisiteQueryDto,
  UpdateSubjectPrerequisiteDto,
} from "@repo/shared/schemas/subject-prerequisite.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SubjectPrerequisiteService {
  private readonly repository: SubjectPrerequisitesRepository;
  private readonly subjectRepository: SubjectRepository;

  constructor(private readonly prisma: PrismaService) {
    this.repository = new SubjectPrerequisitesRepository(this.prisma.client);
    this.subjectRepository = new SubjectRepository(this.prisma.client);
  }

  async create(dto: CreateSubjectPrerequisiteDto) {
    this.ensureDifferentSubjects(dto.subjectId, dto.prerequisiteSubjectId);
    await this.ensureSubjectExists(dto.subjectId, "Subject not found");
    await this.ensureSubjectExists(
      dto.prerequisiteSubjectId,
      "Prerequisite subject not found",
    );

    const existing = await this.repository.findByUniqueCombination(
      dto.subjectId,
      dto.prerequisiteSubjectId,
    );
    if (existing) {
      throw new ConflictException(
        "Subject prerequisite relation already exists",
      );
    }

    return this.createSafely(dto);
  }

  async findAll(query: SubjectPrerequisiteQueryDto) {
    return this.repository.findAll(query.page, query.limit, {
      search: query.search,
    });
  }

  async findOne(id: string) {
    const record = await this.repository.findById(id);
    if (!record) {
      throw new NotFoundException("Subject prerequisite relation not found");
    }
    return record;
  }

  async update(id: string, dto: UpdateSubjectPrerequisiteDto) {
    const current = await this.findOne(id);
    const subjectId = dto.subjectId ?? current.subjectId;
    const prerequisiteSubjectId =
      dto.prerequisiteSubjectId ?? current.prerequisiteSubjectId;

    this.ensureDifferentSubjects(subjectId, prerequisiteSubjectId);

    if (dto.subjectId !== undefined) {
      await this.ensureSubjectExists(dto.subjectId, "Subject not found");
    }
    if (dto.prerequisiteSubjectId !== undefined) {
      await this.ensureSubjectExists(
        dto.prerequisiteSubjectId,
        "Prerequisite subject not found",
      );
    }

    if (
      subjectId !== current.subjectId ||
      prerequisiteSubjectId !== current.prerequisiteSubjectId
    ) {
      const existing = await this.repository.findByUniqueCombination(
        subjectId,
        prerequisiteSubjectId,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          "Subject prerequisite relation already exists",
        );
      }
    }

    return this.updateSafely(id, dto);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.repository.delete(id);
  }

  private async ensureSubjectExists(id: string, message: string) {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new NotFoundException(message);
    }
  }

  private ensureDifferentSubjects(
    subjectId: string,
    prerequisiteSubjectId: string,
  ) {
    if (subjectId === prerequisiteSubjectId) {
      throw new BadRequestException("A subject cannot be its own prerequisite");
    }
  }

  private async createSafely(dto: CreateSubjectPrerequisiteDto) {
    try {
      return await this.repository.create({
        subjectId: dto.subjectId,
        prerequisiteSubjectId: dto.prerequisiteSubjectId,
      });
    } catch (error: unknown) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          "Subject prerequisite relation already exists",
        );
      }
      throw error;
    }
  }

  private async updateSafely(id: string, dto: UpdateSubjectPrerequisiteDto) {
    try {
      return await this.repository.update(id, {
        ...(dto.subjectId !== undefined ? { subjectId: dto.subjectId } : {}),
        ...(dto.prerequisiteSubjectId !== undefined
          ? { prerequisiteSubjectId: dto.prerequisiteSubjectId }
          : {}),
      });
    } catch (error: unknown) {
      if (this.isUniqueConstraintError(error)) {
        throw new ConflictException(
          "Subject prerequisite relation already exists",
        );
      }
      throw error;
    }
  }

  private isUniqueConstraintError(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    );
  }
}
