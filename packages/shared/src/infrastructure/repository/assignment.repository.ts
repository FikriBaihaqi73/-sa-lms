import type { PrismaClient } from "#generated/client";
import {
  assignmentSelect,
  type AssignmentEntity,
} from "#selects/assignment.select";

export interface CreateAssignmentInput {
  assignment_type_id: string;
  module_id: string;
  title: string;
  description?: string;
  due_date?: Date;
}

export interface UpdateAssignmentInput {
  assignment_type_id?: string;
  module_id?: string;
  title?: string;
  description?: string;
  due_date?: Date;
}

export class AssignmentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAssignmentInput): Promise<AssignmentEntity> {
    return this.prisma.assignments.create({
      data: {
        assignment_type_id: data.assignment_type_id,
        module_id: data.module_id,
        title: data.title,
        description: data.description ?? null,
        due_date: data.due_date ?? null,
      },
      select: assignmentSelect,
    });
  }

  async findById(id: string): Promise<AssignmentEntity | null> {
    return this.prisma.assignments.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: assignmentSelect,
    });
  }

  async findAll(): Promise<AssignmentEntity[]> {
    return this.prisma.assignments.findMany({
      where: {
        deleted_at: null,
      },
      select: assignmentSelect,
    });
  }

  async update(
    id: string,
    data: UpdateAssignmentInput,
  ): Promise<AssignmentEntity> {
    return this.prisma.assignments.update({
      where: {
        id,
      },
      data: {
        ...(data.assignment_type_id !== undefined && {
          assignment_type_id: data.assignment_type_id,
        }),
        ...(data.module_id !== undefined && {
          module_id: data.module_id,
        }),
        ...(data.title !== undefined && {
          title: data.title,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.due_date !== undefined && {
          due_date: data.due_date,
        }),
      },
      select: assignmentSelect,
    });
  }

  async delete(id: string): Promise<AssignmentEntity> {
    return this.prisma.assignments.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: assignmentSelect,
    });
  }
}