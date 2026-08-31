import type { PrismaClient } from "#generated/client";
import { type SubjectEntity, subjectSelect } from "#selects/subject.select";

export interface CreateSubjectInput {
  code: string;
  name: string;
  credits?: number;
  description?: string;
  institutionId: string;
  departmentId?: string;
}

export interface UpdateSubjectInput {
  code?: string;
  name?: string;
  credits?: number;
  description?: string;
  institutionId?: string;
  departmentId?: string;
}

export class SubjectRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateSubjectInput): Promise<SubjectEntity> {
    return this.prisma.subject.create({
      data: {
        code: data.code,
        name: data.name,
        credits: data.credits ?? null,
        description: data.description ?? null,
        institutionId: data.institutionId,
        departmentId: data.departmentId ?? null,
      },
      select: subjectSelect,
    });
  }

  async findById(id: string): Promise<SubjectEntity | null> {
    return this.prisma.subject.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: subjectSelect,
    });
  }

  async findByCode(code: string): Promise<SubjectEntity | null> {
    return this.prisma.subject.findFirst({
      where: {
        code,
        deletedAt: null,
      },
      select: subjectSelect,
    });
  }

  async findAll(): Promise<SubjectEntity[]> {
    return this.prisma.subject.findMany({
      where: {
        deletedAt: null,
      },
      select: subjectSelect,
    });
  }

  async update(id: string, data: UpdateSubjectInput): Promise<SubjectEntity> {
    return this.prisma.subject.update({
      where: { id },
      data: {
        ...(data.code !== undefined && {
          code: data.code,
        }),
        ...(data.name !== undefined && {
          name: data.name,
        }),
        ...(data.credits !== undefined && {
          credits: data.credits,
        }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.institutionId !== undefined && {
          institutionId: data.institutionId,
        }),
        ...(data.departmentId !== undefined && {
          departmentId: data.departmentId,
        }),
      },
      select: subjectSelect,
    });
  }

  async delete(id: string): Promise<SubjectEntity> {
    return this.prisma.subject.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
      select: subjectSelect,
    });
  }
}
