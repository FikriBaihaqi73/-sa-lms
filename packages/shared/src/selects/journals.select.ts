import type { Prisma } from "#generated/client";

export const teachingJournalSelect = {
  id: true,
  schedule_id: true,
  meeting_number: true,
  journal_date: true,
  topic: true,
  material: true,
  notes: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.TeachingJournalsSelect;

export type TeachingJournalEntity = Prisma.TeachingJournalsGetPayload<{
  select: typeof teachingJournalSelect;
}>;
