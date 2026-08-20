import type { Prisma } from "#generated/client";

export const teacherSelect = {
  id: true,
  profile_id: true,
  department_id: true,
  specialization_id: true,
  employment_status_id: true,
  teacher_number: true,
  join_date: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.TeachersSelect;

export type TeacherSelectType = typeof teacherSelect;

export type TeacherEntity = Prisma.TeachersGetPayload<{
  select: TeacherSelectType;
}>;