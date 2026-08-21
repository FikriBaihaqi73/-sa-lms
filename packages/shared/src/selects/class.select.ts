import type { Prisma } from "#generated/client";

export const classSelect = {
  id: true,
  institution_id: true,
  homeroom_teacher_id: true,
  academic_year_id: true,
  name: true,
  grade_level: true,
  capacity: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.ClassesSelect;

export type ClassSelectType = typeof classSelect;

export type ClassEntity = Prisma.ClassesGetPayload<{
  select: ClassSelectType;
}>;
