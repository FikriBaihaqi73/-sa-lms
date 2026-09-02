import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateAssignmentSubmissionSchema = z.object({
	assignmentId: z.string().uuid().describe("ID of the assignment"),
	studentId: z.string().uuid().describe("ID of the submitting student"),
	submittedAt: z
		.string()
		.datetime({ message: "Invalid date format" })
		.optional()
		.describe("Date and time when the assignment was submitted"),
	score: z
		.number()
		.min(0, "Score must not be negative")
		.optional()
		.describe("Score awarded for the submission"),
	feedback: z.string().optional().describe("Feedback for the submission"),
	status: z.string().optional().describe("Current status of the submission"),
	gradedBy: z.string().uuid().optional().describe("ID of the user grading the submission"),
	gradedAt: z
		.string()
		.datetime({ message: "Invalid date format" })
		.optional()
		.describe("Date and time when the submission was graded"),
});

export const UpdateAssignmentSubmissionSchema = z.object({
	submittedAt: z
		.string()
		.datetime({ message: "Invalid date format" })
		.optional()
		.describe("Date and time when the assignment was submitted"),
	score: z
		.number()
		.min(0, "Score must not be negative")
		.optional()
		.describe("Score awarded for the submission"),
	feedback: z.string().optional().describe("Feedback for the submission"),
	status: z.string().optional().describe("Current status of the submission"),
	gradedBy: z.string().uuid().optional().describe("ID of the user grading the submission"),
	gradedAt: z
		.string()
		.datetime({ message: "Invalid date format" })
		.optional()
		.describe("Date and time when the submission was graded"),
});

export const createAssignmentSubmissionSchema = CreateAssignmentSubmissionSchema;
export const updateAssignmentSubmissionSchema = UpdateAssignmentSubmissionSchema;

export class CreateAssignmentSubmissionDto extends createZodDto(
	CreateAssignmentSubmissionSchema,
) {}

export class UpdateAssignmentSubmissionDto extends createZodDto(
	UpdateAssignmentSubmissionSchema,
) {}
