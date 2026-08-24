import type { PrismaClient } from "#generated/client";
import {
  teachingJournalSelect,
  type TeachingJournalEntity,
} from "#selects/journals.select";

export interface CreateTeachingJournalInput {
  schedule_id: string;
  meeting_number?: number | null;
  journal_date?: Date | null;
  topic?: string | null;
  material?: string | null;
  notes?: string | null;
}

export interface UpdateTeachingJournalInput {
  schedule_id?: string;
  meeting_number?: number | null;
  journal_date?: Date | null;
  topic?: string | null;
  material?: string | null;
  notes?: string | null;
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

  async findAll(): Promise<TeachingJournalEntity[]> {
    return this.prisma.teachingJournals.findMany({
      where: {
        deleted_at: null,
      },
      select: teachingJournalSelect,
    });
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