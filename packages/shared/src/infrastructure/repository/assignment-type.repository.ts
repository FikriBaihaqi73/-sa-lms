import type { PrismaClient } from "#generated/client";
import {
  assignmentTypeSelect,
  type AssignmentTypeEntity,
} from "#selects/assignment-type.select";

export interface CreateAssignmentTypeInput {
  name: string;
  description?: string;
}

export interface UpdateAssignmentTypeInput {
  name?: string;
  description?: string;
}

export class AssignmentTypeRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAssignmentTypeInput): Promise<AssignmentTypeEntity> {
    return this.prisma.assignmentTypes.create({
      data: {
        name: data.name,
        description: data.description ?? null,
      },
      select: assignmentTypeSelect,
    });
  }

  async findById(id: string): Promise<AssignmentTypeEntity | null> {
    return this.prisma.assignmentTypes.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: assignmentTypeSelect,
    });
  }

  async findByName(name: string): Promise<AssignmentTypeEntity | null> {
    return this.prisma.assignmentTypes.findFirst({
      where: {
        name,
        deleted_at: null,
      },
      select: assignmentTypeSelect,
    });
  }

  async findAll(): Promise<AssignmentTypeEntity[]> {
    return this.prisma.assignmentTypes.findMany({
      where: {
        deleted_at: null,
      },
      select: assignmentTypeSelect,
    });
  }

  async update(
    id: string,
    data: UpdateAssignmentTypeInput,
  ): Promise<AssignmentTypeEntity> {
    return this.prisma.assignmentTypes.update({
      where: {
        id,
      },
      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
      },
      select: assignmentTypeSelect,
    });
  }

  async delete(id: string): Promise<AssignmentTypeEntity> {
    return this.prisma.assignmentTypes.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: assignmentTypeSelect,
    });
  }
}
