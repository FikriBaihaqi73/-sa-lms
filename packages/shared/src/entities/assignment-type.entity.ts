import type { Prisma } from "#generated/client";
import { assignmentTypeSelect } from "#selects/assignment-type.select";

export type AssignmentTypeEntity = Prisma.AssignmentTypesGetPayload<{
  select: typeof assignmentTypeSelect;
}>;

export type AssignmentTypeListEntity = AssignmentTypeEntity[];
