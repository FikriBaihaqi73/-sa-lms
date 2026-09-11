import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AssignmentTypeRepository } from "@repo/shared/infrastructure/repository/assignment-type.repository";
import {
  CreateAssignmentTypeDto,
  UpdateAssignmentTypeDto,
} from "@repo/shared/schemas/assignment-type.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AssignmentTypesService {
  private readonly assignmentTypeRepository: AssignmentTypeRepository;

  constructor(private readonly prisma: PrismaService) {
    this.assignmentTypeRepository = new AssignmentTypeRepository(
      this.prisma.client,
    );
  }

  async create(data: CreateAssignmentTypeDto) {
    const existing = await this.assignmentTypeRepository.findByName(data.name);
    if (existing) {
      throw new ConflictException("Assignment type name already exists");
    }

    return this.assignmentTypeRepository.create({
      name: data.name,
      ...(data.description !== undefined && {
        description: data.description,
      }),
    });
  }

  async findAll() {
    return this.assignmentTypeRepository.findAll();
  }

  async findOne(id: string) {
    const assignmentType = await this.assignmentTypeRepository.findById(id);
    if (!assignmentType) {
      throw new NotFoundException("Assignment type not found");
    }
    return assignmentType;
  }

  async update(id: string, data: UpdateAssignmentTypeDto) {
    await this.findOne(id);

    if (data.name !== undefined) {
      const existing = await this.assignmentTypeRepository.findByName(
        data.name,
      );
      if (existing && existing.id !== id) {
        throw new ConflictException(
          "Assignment type name already in use by another assignment type",
        );
      }
    }

    return this.assignmentTypeRepository.update(id, {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && {
        description: data.description,
      }),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.assignmentTypeRepository.delete(id);
  }
}
