import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateSubjectSchema = z.object({
  code: z
    .string()
    .min(1, "Subject code is required")
    .max(100, "Subject code must not exceed 100 characters")
    .describe("Unique subject code"),
  name: z
    .string()
    .min(1, "Subject name is required")
    .max(255, "Subject name must not exceed 255 characters")
    .describe("Subject name"),
  credits: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .describe("Number of credits for the subject"),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .describe("Subject description"),
  institutionId: z.uuid().describe("Institution ID"),
  departmentId: z.uuid().optional().describe("Department ID"),
});

export const UpdateSubjectSchema = CreateSubjectSchema.partial();

export const createSubjectSchema = CreateSubjectSchema;
export const updateSubjectSchema = UpdateSubjectSchema;

export class CreateSubjectDto extends createZodDto(CreateSubjectSchema) {}
export class UpdateSubjectDto extends createZodDto(UpdateSubjectSchema) {}
