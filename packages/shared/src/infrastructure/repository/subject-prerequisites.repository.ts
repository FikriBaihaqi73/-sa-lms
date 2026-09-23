import type { Prisma, PrismaClient } from "#generated/client";
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

export interface SubjectPrerequisitesSearchInput {
  search?: string | undefined;
}

export interface SubjectPrerequisitesPaginationResult {
  data: SubjectPrerequisitesEntity[];
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
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

  async findBySubjectAndPrerequisite(
    subjectId: string,
    prerequisiteSubjectId: string,
  ): Promise<SubjectPrerequisitesEntity | null> {
    return this.prisma.subjectPrerequisites.findFirst({
      where: {
        subjectId,
        prerequisiteSubjectId,
        deletedAt: null,
      },
      select: subjectPrerequisitesSelect,
    });
  }

  async findByUniqueCombination(
    subjectId: string,
    prerequisiteSubjectId: string,
  ): Promise<SubjectPrerequisitesEntity | null> {
    return this.prisma.subjectPrerequisites.findFirst({
      where: {
        subjectId,
        prerequisiteSubjectId,
      },
      select: subjectPrerequisitesSelect,
    });
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: SubjectPrerequisitesSearchInput,
  ): Promise<SubjectPrerequisitesPaginationResult> {
    const skip = (page - 1) * limit;
    const search = filters?.search?.trim();

    const where: Prisma.SubjectPrerequisitesWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              {
                subject: {
                  name: { contains: search, mode: "insensitive" },
                },
              },
              {
                subject: {
                  code: { contains: search, mode: "insensitive" },
                },
              },
              {
                prerequisiteSubject: {
                  name: { contains: search, mode: "insensitive" },
                },
              },
              {
                prerequisiteSubject: {
                  code: { contains: search, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    };

    const [data, totalData] = await Promise.all([
      this.prisma.subjectPrerequisites.findMany({
        where,
        skip,
        take: limit,
        select: subjectPrerequisitesSelect,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.subjectPrerequisites.count({ where }),
    ]);

    return {
      data,
      meta: {
        totalData,
        totalPages: Math.ceil(totalData / limit),
        currentPage: page,
        perPage: limit,
      },
    };
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
