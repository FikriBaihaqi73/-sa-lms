import type { Prisma } from "#generated/client";

export const classSubjectsSelect = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  class_id: true,
  subject_id: true,
  teacher_id: true,
  academic_year_id: true,
} satisfies Prisma.ClassSubjectsSelect;

export type ClassSubjectsSelectType = typeof classSubjectsSelect;

export type ClassSubjectsEntity = Prisma.ClassSubjectsGetPayload<{
  select: ClassSubjectsSelectType;
}>;
