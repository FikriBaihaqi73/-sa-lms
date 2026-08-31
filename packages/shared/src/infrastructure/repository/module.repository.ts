import type { PrismaClient } from "#generated/client";
import { type ModuleEntity, moduleSelect } from "#selects/module.select";

export interface CreateModuleInput {
  created_by?: string;
  class_subject_id: string;
  title: string;
  description?: string;
  display_order?: number;
  is_published?: boolean;
  is_locked?: boolean;
}

export interface UpdateModuleInput {
  updated_by?: string;
  class_subject_id?: string;
  title?: string;
  description?: string;
  display_order?: number;
  is_published?: boolean;
  is_locked?: boolean;
}

export class ModuleRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateModuleInput): Promise<ModuleEntity> {
    return this.prisma.modules.create({
      data: {
        created_by: data.created_by ?? null,
        class_subject_id: data.class_subject_id,
        title: data.title,
        description: data.description ?? null,
        display_order: data.display_order ?? null,
        is_published: data.is_published ?? false,
        is_locked: data.is_locked ?? false,
      },
      select: moduleSelect,
    });
  }
  async findById(id: string): Promise<ModuleEntity | null> {
    return this.prisma.modules.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: moduleSelect,
    });
  }

  async findAll(): Promise<ModuleEntity[]> {
    return this.prisma.modules.findMany({
      where: {
        deleted_at: null,
      },
      select: moduleSelect,
    });
  }

  async findByClassSubjectId(
    class_subject_id: string,
  ): Promise<ModuleEntity[]> {
    return this.prisma.modules.findMany({
      where: {
        class_subject_id,
        deleted_at: null,
      },
      orderBy: {
        display_order: "asc",
      },
      select: moduleSelect,
    });
  }

  async update(id: string, data: UpdateModuleInput): Promise<ModuleEntity> {
    return this.prisma.modules.update({
      where: { id },
      data: {
        ...(data.updated_by !== undefined && {
          updated_by: data.updated_by,
        }),
        ...(data.class_subject_id !== undefined && {
          class_subject_id: data.class_subject_id,
        }),
        ...(data.title !== undefined && {
          title: data.title,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.display_order !== undefined && {
          display_order: data.display_order,
        }),
        ...(data.is_published !== undefined && {
          is_published: data.is_published,
        }),
        ...(data.is_locked !== undefined && {
          is_locked: data.is_locked,
        }),
      },
      select: moduleSelect,
    });
  }

  async delete(id: string): Promise<ModuleEntity> {
    return this.prisma.modules.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
      select: moduleSelect,
    });
  }
}
