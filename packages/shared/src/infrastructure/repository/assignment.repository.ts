import type { Prisma, PrismaClient } from "#generated/client";
import {
  type AssignmentEntity,
  assignmentSelect,
} from "#selects/assignment.select";

export interface CreateAssignmentInput {
  assignment_type_id: string;
  module_id: string;
  title: string;
  description?: string | null;
  due_date?: Date | null;
  max_score?: number | null;
}

export interface UpdateAssignmentInput {
  assignment_type_id?: string;
  module_id?: string;
  title?: string;
  description?: string | null;
  due_date?: Date | null;
  max_score?: number | null;
}

export interface AssignmentSearchInput {
  search?: string | undefined;
}

export interface AssignmentPaginationResult {
  data: AssignmentEntity[];
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
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
        max_score: data.max_score ?? null,
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

  async findAll(
    page = 1,
    limit = 10,
    filters?: AssignmentSearchInput,
  ): Promise<AssignmentPaginationResult> {
    const currentPage = Math.max(Math.floor(page || 1), 1);
    const perPage = Math.min(Math.max(Math.floor(limit || 10), 1), 100);
    const search = filters?.search?.trim();

    const where: Prisma.AssignmentsWhereInput = {
      deleted_at: null,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              {
                assignment_type: {
                  name: { contains: search, mode: "insensitive" },
                },
              },
              {
                module: {
                  title: { contains: search, mode: "insensitive" },
                },
              },
              {
                module: {
                  class_subject: {
                    class: { name: { contains: search, mode: "insensitive" } },
                  },
                },
              },
              {
                module: {
                  class_subject: {
                    subject: {
                      name: { contains: search, mode: "insensitive" },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [data, totalData] = await Promise.all([
      this.prisma.assignments.findMany({
        where,
        skip: (currentPage - 1) * perPage,
        take: perPage,
        select: assignmentSelect,
        orderBy: { created_at: "desc" },
      }),
      this.prisma.assignments.count({ where }),
    ]);

    return {
      data,
      meta: {
        totalData,
        totalPages: Math.ceil(totalData / perPage),
        currentPage,
        perPage,
      },
    };
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
        ...(data.max_score !== undefined && {
          max_score: data.max_score,
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
