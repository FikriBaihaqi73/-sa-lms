import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AssignmentTypeRepository } from "@repo/shared/infrastructure/repository/assignment-type.repository";
import type {
  CreateAssignmentTypeDto,
  UpdateAssignmentTypeDto,
} from "@repo/shared/schemas/assignment-type.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AssignmentTypeService {
  private readonly assignmentTypeRepository: AssignmentTypeRepository;

  constructor(private readonly prisma: PrismaService) {
    this.assignmentTypeRepository = new AssignmentTypeRepository(
      this.prisma.client,
    );
  }

  async findAll() {
    return this.assignmentTypeRepository.findAll();
  }

  async findOne(id: string) {
    const assignmentType = await this.assignmentTypeRepository.findById(id);
    if (!assignmentType)
      throw new NotFoundException("Assignment type not found");
    return assignmentType;
  }

  async create(dto: CreateAssignmentTypeDto) {
    await this.ensureUniqueName(dto.name);
    return this.assignmentTypeRepository.create({
      name: dto.name,
      ...(dto.description !== undefined && { description: dto.description }),
    });
  }

  async update(id: string, dto: UpdateAssignmentTypeDto) {
    await this.findOne(id);
    if (dto.name) {
      await this.ensureUniqueName(dto.name, id);
    }
    return this.assignmentTypeRepository.update(id, {
      ...(dto.name !== undefined && { name: dto.name }),
      ...(dto.description !== undefined && { description: dto.description }),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.assignmentTypeRepository.delete(id);
    return { success: true, id };
  }

  private async ensureUniqueName(name: string, excludedId?: string) {
    const existing = await this.assignmentTypeRepository.findByName(name);
    if (existing && existing.id !== excludedId) {
      throw new ConflictException("Assignment type name already exists");
    }
  }
}
