import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateExaminationSchema = z.object({
	createdBy: z.string().uuid().optional().describe("ID of the user creating the examination"),
	classSubjectId: z
		.string()
		.uuid()
		.optional()
		.describe("ID of the related class subject"),
	assignmentTypeId: z
		.string()
		.uuid()
		.optional()
		.describe("ID of the related assignment type"),
	title: z
		.string()
		.min(1, "Title is required")
		.max(255, "Title must not exceed 255 characters")
		.describe("Title of the examination"),
	description: z.string().optional().describe("Description of the examination"),
	examinationDate: z
		.string()
		.datetime({ message: "Invalid date format" })
		.optional()
		.describe("Scheduled date of the examination"),
	duration: z
		.number()
		.int("Duration must be an integer")
		.min(0, "Duration must not be negative")
		.optional()
		.describe("Duration of the examination in minutes"),
	maximumScore: z
		.number()
		.min(0, "Maximum score must not be negative")
		.optional()
		.describe("Maximum score for the examination"),
});

export const UpdateExaminationSchema = z.object({
	updatedBy: z.string().uuid().optional().describe("ID of the user updating the examination"),
	classSubjectId: z
		.string()
		.uuid()
		.optional()
		.describe("ID of the related class subject"),
	assignmentTypeId: z
		.string()
		.uuid()
		.optional()
		.describe("ID of the related assignment type"),
	title: z
		.string()
		.min(1, "Title is required")
		.max(255, "Title must not exceed 255 characters")
		.optional()
		.describe("Title of the examination"),
	description: z.string().optional().describe("Description of the examination"),
	examinationDate: z
		.string()
		.datetime({ message: "Invalid date format" })
		.optional()
		.describe("Scheduled date of the examination"),
	duration: z
		.number()
		.int("Duration must be an integer")
		.min(0, "Duration must not be negative")
		.optional()
		.describe("Duration of the examination in minutes"),
	maximumScore: z
		.number()
		.min(0, "Maximum score must not be negative")
		.optional()
		.describe("Maximum score for the examination"),
});

export class CreateExaminationDto extends createZodDto(
	CreateExaminationSchema,
) {}

export class UpdateExaminationDto extends createZodDto(
	UpdateExaminationSchema,
) {}
