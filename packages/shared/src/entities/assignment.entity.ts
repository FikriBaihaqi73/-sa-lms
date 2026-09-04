import type { Prisma } from "#generated/client";
import { assignmentSelect } from "#selects/assignment.select";

export type AssignmentEntity = Prisma.AssignmentsGetPayload<{
  select: typeof assignmentSelect;
}>;

export type AssignmentListEntity = AssignmentEntity[];
