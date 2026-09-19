import { Injectable, NotFoundException } from "@nestjs/common";
import {
  ExaminationRepository,
  type ExaminationPaginationResult,
  type ExaminationSearchInput,
} from "@repo/shared/infrastructure/repository/examination.repository";
import type { ExaminationEntity } from "@repo/shared/selects/examination.select";
import type {
  CreateExaminationDto,
  UpdateExaminationDto,
} from "@repo/shared/schemas/examination.schema";

@Injectable()
export class ExaminationService {
  constructor(private readonly repository: ExaminationRepository) {}

  async create(data: CreateExaminationDto): Promise<ExaminationEntity> {
    return this.repository.create({
      title: data.title,
      ...(data.createdBy !== undefined && { createdBy: data.createdBy }),
      ...(data.classSubjectId !== undefined && { classSubjectId: data.classSubjectId }),
      ...(data.assignmentTypeId !== undefined && { assignmentTypeId: data.assignmentTypeId }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.examinationDate !== undefined && { examinationDate: new Date(data.examinationDate) }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.maximumScore !== undefined && { maximumScore: data.maximumScore }),
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    search?: string,
  ): Promise<ExaminationPaginationResult> {
    const filters: ExaminationSearchInput = { search };
    return this.repository.findAll(page, limit, filters);
  }

  async findById(id: string): Promise<ExaminationEntity> {
    const examination = await this.repository.findById(id);
    if (!examination) {
      throw new NotFoundException(`Examination with ID ${id} not found`);
    }
    return examination;
  }

  async update(
    id: string,
    data: UpdateExaminationDto,
  ): Promise<ExaminationEntity> {
    await this.findById(id);

    return this.repository.update(id, {
      ...(data.updatedBy !== undefined && { updatedBy: data.updatedBy }),
      ...(data.classSubjectId !== undefined && { classSubjectId: data.classSubjectId }),
      ...(data.assignmentTypeId !== undefined && { assignmentTypeId: data.assignmentTypeId }),
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.examinationDate !== undefined && { examinationDate: new Date(data.examinationDate) }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.maximumScore !== undefined && { maximumScore: data.maximumScore }),
    });
  }

  async softDelete(id: string): Promise<ExaminationEntity> {
    await this.findById(id);
    return this.repository.softDelete(id);
  }
}
