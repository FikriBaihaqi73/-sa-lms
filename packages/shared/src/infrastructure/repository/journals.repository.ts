import type { PrismaClient } from "#generated/client";
import {
  type TeachingJournalEntity,
  teachingJournalSelect,
} from "#selects/journals.select";

export interface CreateTeachingJournalInput {
  schedule_id: string;
  meeting_number?: number | undefined;
  journal_date?: Date | undefined;
  topic?: string | undefined;
  material?: string | undefined;
  notes?: string | undefined;
}

export interface UpdateTeachingJournalInput {
  schedule_id?: string | undefined;
  meeting_number?: number | undefined;
  journal_date?: Date | undefined;
  topic?: string | undefined;
  material?: string | undefined;
  notes?: string | undefined;
}

export interface TeachingJournalSearchInput {
  search?: string | undefined;
  schedule_id?: string | undefined;
  journal_date?: string | undefined;
}

export class TeachingJournalRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateTeachingJournalInput,
  ): Promise<TeachingJournalEntity> {
    return this.prisma.teachingJournals.create({
      data: {
        schedule_id: data.schedule_id,
        meeting_number: data.meeting_number ?? null,
        journal_date: data.journal_date ?? null,
        topic: data.topic ?? null,
        material: data.material ?? null,
        notes: data.notes ?? null,
      },
      select: teachingJournalSelect,
    });
  }

  async findById(id: string): Promise<TeachingJournalEntity | null> {
    return this.prisma.teachingJournals.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: teachingJournalSelect,
    });
  }

  async findAll(
    page: number,
    limit: number,
    filters?: TeachingJournalSearchInput,
  ): Promise<{ data: TeachingJournalEntity[]; meta: any }> {
    const skip = (page - 1) * limit;

    const where: any = {
      deleted_at: null,
      ...(filters?.search
        ? {
            OR: [
              { topic: { contains: filters.search, mode: "insensitive" } },
              { material: { contains: filters.search, mode: "insensitive" } },
              { notes: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters?.schedule_id ? { schedule_id: filters.schedule_id } : {}),
      ...(filters?.journal_date
        ? { journal_date: new Date(filters.journal_date) }
        : {}),
    };

    const [data, totalData] = await Promise.all([
      this.prisma.teachingJournals.findMany({
        where,
        skip,
        take: limit,
        select: teachingJournalSelect,
        orderBy: {
          created_at: "desc",
        },
      }),
      this.prisma.teachingJournals.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalData / limit);

    return {
      data,
      meta: {
        totalData,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    };
  }

  async update(
    id: string,
    data: UpdateTeachingJournalInput,
  ): Promise<TeachingJournalEntity> {
    return this.prisma.teachingJournals.update({
      where: {
        id,
      },
      data: {
        ...(data.schedule_id !== undefined && {
          schedule_id: data.schedule_id,
        }),
        ...(data.meeting_number !== undefined && {
          meeting_number: data.meeting_number,
        }),
        ...(data.journal_date !== undefined && {
          journal_date: data.journal_date,
        }),
        ...(data.topic !== undefined && {
          topic: data.topic,
        }),
        ...(data.material !== undefined && {
          material: data.material,
        }),
        ...(data.notes !== undefined && {
          notes: data.notes,
        }),
      },
      select: teachingJournalSelect,
    });
  }

  async delete(id: string): Promise<TeachingJournalEntity> {
    return this.prisma.teachingJournals.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: teachingJournalSelect,
    });
  }
}
