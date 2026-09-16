import { Injectable, NotFoundException, ConflictException } from "@nestjs/common";
import { SubjectRepository } from "@repo/shared/infrastructure/repository/subject.repository";
import type { CreateSubjectDto, UpdateSubjectDto, SubjectQueryDto } from "@repo/shared/schemas/subject.schema";
import type { SubjectEntity } from "@repo/shared/entities/subject.entity";

import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SubjectService {
  private readonly subjectRepository: SubjectRepository;

  constructor(private readonly prisma: PrismaService) {
    this.subjectRepository = new SubjectRepository(this.prisma.client);
  }

  async create(data: CreateSubjectDto): Promise<SubjectEntity> {
    const existing = await this.subjectRepository.findByCode(data.code);
    if (existing) {
      throw new ConflictException("Subject code already exists");
    }
    return this.subjectRepository.create(data);
  }

  async findAll(query: SubjectQueryDto) {
    const { page, limit, search, institutionId, departmentId } = query;
    return this.subjectRepository.findAll({
      page,
      limit,
      search,
      institutionId,
      departmentId,
    });
  }

  async findOne(id: string): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new NotFoundException("Subject not found");
    }
    return subject;
  }

  async update(id: string, data: UpdateSubjectDto): Promise<SubjectEntity> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new NotFoundException("Subject not found");
    }

    if (data.code && data.code !== subject.code) {
      const existing = await this.subjectRepository.findByCode(data.code);
      if (existing) {
        throw new ConflictException("Subject code already exists");
      }
    }

    return this.subjectRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) {
      throw new NotFoundException("Subject not found");
    }
    await this.subjectRepository.delete(id);
  }
}
