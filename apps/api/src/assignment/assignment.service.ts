import { Injectable, NotFoundException } from "@nestjs/common";
import { AssignmentRepository } from "@repo/shared/infrastructure/repository/assignment.repository";
import { AssignmentTypeRepository } from "@repo/shared/infrastructure/repository/assignment-type.repository";
import { ModuleRepository } from "@repo/shared/infrastructure/repository/module.repository";
import type {
  CreateAssignmentDto,
  UpdateAssignmentDto,
} from "@repo/shared/schemas/assignment.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AssignmentService {
  private readonly assignmentRepository: AssignmentRepository;
  private readonly assignmentTypeRepository: AssignmentTypeRepository;
  private readonly moduleRepository: ModuleRepository;

  constructor(private readonly prisma: PrismaService) {
    const client = this.prisma.client;
    this.assignmentRepository = new AssignmentRepository(client);
    this.assignmentTypeRepository = new AssignmentTypeRepository(client);
    this.moduleRepository = new ModuleRepository(client);
  }

  findAll(page = 1, limit = 10, search?: string) {
    return this.assignmentRepository.findAll(page, limit, { search });
  }

  async findOne(id: string) {
    const assignment = await this.assignmentRepository.findById(id);
    if (!assignment) {
      throw new NotFoundException("Assignment not found");
    }
    return assignment;
  }

  async create(dto: CreateAssignmentDto) {
    await this.ensureModuleExists(dto.module_id);
    await this.ensureAssignmentTypeExists(dto.assignment_type_id);

    return this.assignmentRepository.create({
      module_id: dto.module_id,
      assignment_type_id: dto.assignment_type_id,
      title: dto.title,
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.due_date !== undefined && {
        due_date: dto.due_date ? new Date(dto.due_date) : null,
      }),
      ...(dto.max_score !== undefined && { max_score: dto.max_score }),
    });
  }

  async update(id: string, dto: UpdateAssignmentDto) {
    await this.findOne(id);

    if (dto.module_id !== undefined) {
      await this.ensureModuleExists(dto.module_id);
    }
    if (dto.assignment_type_id !== undefined) {
      await this.ensureAssignmentTypeExists(dto.assignment_type_id);
    }

    return this.assignmentRepository.update(id, {
      ...(dto.module_id !== undefined && { module_id: dto.module_id }),
      ...(dto.assignment_type_id !== undefined && {
        assignment_type_id: dto.assignment_type_id,
      }),
      ...(dto.title !== undefined && { title: dto.title }),
      ...(dto.description !== undefined && { description: dto.description }),
      ...(dto.due_date !== undefined && {
        due_date: dto.due_date ? new Date(dto.due_date) : null,
      }),
      ...(dto.max_score !== undefined && { max_score: dto.max_score }),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.assignmentRepository.delete(id);
    return { success: true, id };
  }

  private async ensureModuleExists(id: string) {
    const module = await this.moduleRepository.findById(id);
    if (!module) {
      throw new NotFoundException("Learning module not found");
    }
  }

  private async ensureAssignmentTypeExists(id: string) {
    const assignmentType = await this.assignmentTypeRepository.findById(id);
    if (!assignmentType) {
      throw new NotFoundException("Assignment type not found");
    }
  }
}
