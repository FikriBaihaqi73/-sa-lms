import type { PrismaClient } from "#generated/client";
import {
  type ModuleContentEntity,
  moduleContentSelect,
} from "#selects/module-content.select";

export interface CreateModuleContentInput {
  moduleId: string;
  title: string;
  contentType: string;
  content?: string | null;
  fileId?: string | null;
  sortOrder?: number | null;
}

export interface UpdateModuleContentInput {
  moduleId?: string;
  title?: string;
  contentType?: string;
  content?: string | null;
  fileId?: string | null;
  sortOrder?: number | null;
}

export class ModuleContentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateModuleContentInput): Promise<ModuleContentEntity> {
    return this.prisma.moduleContent.create({
      data: {
        moduleId: data.moduleId,
        title: data.title,
        contentType: data.contentType,
        ...(data.content !== undefined && { content: data.content }),
        ...(data.fileId !== undefined && { fileId: data.fileId }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
      select: moduleContentSelect,
    });
  }

  async findById(id: string): Promise<ModuleContentEntity | null> {
    return this.prisma.moduleContent.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: moduleContentSelect,
    });
  }

  async findByModuleId(moduleId: string): Promise<ModuleContentEntity[]> {
    return this.prisma.moduleContent.findMany({
      where: {
        moduleId,
        deletedAt: null,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: moduleContentSelect,
    });
  }

  async findAll(): Promise<ModuleContentEntity[]> {
    return this.prisma.moduleContent.findMany({
      where: {
        deletedAt: null,
      },
      select: moduleContentSelect,
    });
  }

  async update(
    id: string,
    data: UpdateModuleContentInput,
  ): Promise<ModuleContentEntity> {
    return this.prisma.moduleContent.update({
      where: {
        id,
      },
      data: {
        ...(data.moduleId !== undefined && { moduleId: data.moduleId }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.contentType !== undefined && { contentType: data.contentType }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.fileId !== undefined && { fileId: data.fileId }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
      },
      select: moduleContentSelect,
    });
  }

  async delete(id: string): Promise<ModuleContentEntity> {
    return this.prisma.moduleContent.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: moduleContentSelect,
    });
  }
}
