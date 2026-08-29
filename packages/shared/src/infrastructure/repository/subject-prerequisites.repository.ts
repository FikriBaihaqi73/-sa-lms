import type { PrismaClient } from "#generated/client";
import {
  type SubjectPrerequisitesEntity,
  subjectPrerequisitesSelect,
} from "#selects/subject-prerequisites.select";

export interface CreateSubjectPrerequisitesInput {
  subjectId: string;
  prerequisiteSubjectId: string;
}

export interface UpdateSubjectPrerequisitesInput {
  subjectId?: string;
  prerequisiteSubjectId?: string;
}

export class SubjectPrerequisitesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateSubjectPrerequisitesInput,
  ): Promise<SubjectPrerequisitesEntity> {
    return this.prisma.subjectPrerequisites.create({
      data: {
        subjectId: data.subjectId,
        prerequisiteSubjectId: data.prerequisiteSubjectId,
      },
      select: subjectPrerequisitesSelect,
    });
  }

  async findById(id: string): Promise<SubjectPrerequisitesEntity | null> {
    return this.prisma.subjectPrerequisites.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: subjectPrerequisitesSelect,
    });
  }

  async findBySubjectId(
    subjectId: string,
  ): Promise<SubjectPrerequisitesEntity[]> {
    return this.prisma.subjectPrerequisites.findMany({
      where: {
        subjectId,
        deletedAt: null,
      },
      select: subjectPrerequisitesSelect,
    });
  }

  async findByPrerequisiteSubjectId(
    prerequisiteSubjectId: string,
  ): Promise<SubjectPrerequisitesEntity[]> {
    return this.prisma.subjectPrerequisites.findMany({
      where: {
        prerequisiteSubjectId,
        deletedAt: null,
      },
      select: subjectPrerequisitesSelect,
    });
  }

  async findAll(): Promise<SubjectPrerequisitesEntity[]> {
    return this.prisma.subjectPrerequisites.findMany({
      where: {
        deletedAt: null,
      },
      select: subjectPrerequisitesSelect,
    });
  }

  async update(
    id: string,
    data: UpdateSubjectPrerequisitesInput,
  ): Promise<SubjectPrerequisitesEntity> {
    return this.prisma.subjectPrerequisites.update({
      where: {
        id,
      },
      data: {
        ...(data.subjectId !== undefined && {
          subjectId: data.subjectId,
        }),
        ...(data.prerequisiteSubjectId !== undefined && {
          prerequisiteSubjectId: data.prerequisiteSubjectId,
        }),
      },
      select: subjectPrerequisitesSelect,
    });
  }

  async delete(id: string): Promise<SubjectPrerequisitesEntity> {
    return this.prisma.subjectPrerequisites.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: subjectPrerequisitesSelect,
    });
  }
}
