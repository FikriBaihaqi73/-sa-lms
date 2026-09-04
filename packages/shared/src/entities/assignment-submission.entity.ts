import type { Prisma } from "#generated/client";
import { assignmentSubmissionSelect } from "#selects/assignment-submission.select";

export type AssignmentSubmissionEntity = Prisma.AssignmentSubmissionGetPayload<{
	select: typeof assignmentSubmissionSelect;
}>;

export type AssignmentSubmissionListEntity = AssignmentSubmissionEntity[];
