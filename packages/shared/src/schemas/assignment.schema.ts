import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateAssignmentSchema = z.object({
  module_id: z.string().uuid().describe("ID of the related module"),
  assignment_type_id: z.string().uuid().describe("ID of the assignment type"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .describe("Title of the assignment"),
  description: z
    .string()
    .optional()
    .nullable()
    .describe("Detailed description of the assignment"),
  due_date: z
    .string()
    .datetime()
    .optional()
    .nullable()
    .describe("Due date of the assignment"),
  max_score: z
    .number()
    .optional()
    .nullable()
    .describe("Maximum score achievable for this assignment"),
});

export const UpdateAssignmentSchema = CreateAssignmentSchema.partial();

export class CreateAssignmentDto extends createZodDto(CreateAssignmentSchema) {}
export class UpdateAssignmentDto extends createZodDto(UpdateAssignmentSchema) {}
