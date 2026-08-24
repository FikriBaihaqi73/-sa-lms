import type { Prisma } from "#generated/client";

export const studyPlanSelect = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  student_id: true,
  class_subject_id: true,
  academic_year_id: true,
} satisfies Prisma.StudyPlansSelect;

export type StudyPlanEntity = Prisma.StudyPlansGetPayload<{
  select: typeof studyPlanSelect;
}>;