import type { Prisma } from "#generated/client";

export const assignmentSelect = {
  id: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  assignment_type_id: true,
  module_id: true,
  title: true,
  description: true,
  due_date: true,
  max_score: true,
} satisfies Prisma.AssignmentsSelect;

export type AssignmentSelectType = typeof assignmentSelect;

export type AssignmentEntity = Prisma.AssignmentsGetPayload<{
  select: AssignmentSelectType;
}>;
