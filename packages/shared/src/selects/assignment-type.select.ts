import type { Prisma } from "#generated/client";

export const assignmentTypeSelect = {
  id: true,
  name: true,
  description: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.AssignmentTypesSelect;

export type AssignmentTypeSelectType = typeof assignmentTypeSelect;

export type AssignmentTypeEntity = Prisma.AssignmentTypesGetPayload<{
  select: AssignmentTypeSelectType;
}>;
