import type { Prisma } from "#generated/client";
import { teachingJournalSelect } from "#selects/journals.select";

export type TeachingJournalEntity = Prisma.TeachingJournalsGetPayload<{
  select: typeof teachingJournalSelect;
}>;

export type TeachingJournalListEntity = TeachingJournalEntity[];
