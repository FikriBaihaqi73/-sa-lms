import type { Prisma } from "#generated/client";

export const semesterSelect = {
  id: true,
  academic_year_id: true,
  name: true,
  start_date: true,
  end_date: true,
  is_active: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.SemestersSelect;

export type SemesterSelectType = typeof semesterSelect;

