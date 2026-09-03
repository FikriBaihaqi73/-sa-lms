import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateExaminationScoreSchema = z.object({
  examinationId: z
    .string()
    .uuid("Invalid examination ID format")
    .describe("ID of the examination"),
  studentId: z
    .string()
    .uuid("Invalid student ID format")
    .describe("ID of the student"),
  score: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score must not exceed 100")
    .optional()
    .describe("Score achieved by the student"),
  notes: z
    .string()
    .optional()
    .describe("Additional notes about the examination score"),
  gradedBy: z
    .string()
    .uuid("Invalid grader ID format")
    .optional()
    .describe("ID of the user who graded the examination"),
  gradedAt: z
    .string()
    .datetime()
    .optional()
    .describe("Date and time when the examination was graded"),
});

export const UpdateExaminationScoreSchema = CreateExaminationScoreSchema.partial();

export const createExaminationScoreSchema = CreateExaminationScoreSchema;
export const updateExaminationScoreSchema = UpdateExaminationScoreSchema;

export class CreateExaminationScoreDto extends createZodDto(CreateExaminationScoreSchema) {}
export class UpdateExaminationScoreDto extends createZodDto(UpdateExaminationScoreSchema) {}
