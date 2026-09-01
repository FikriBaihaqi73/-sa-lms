import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateGradeSchema = z.object({
  grade: z.string().min(1).describe("Grade name"),

  minimumScore: z.coerce
    .number()
    .optional()
    .describe("Minimum score"),

  maximumScore: z.coerce
    .number()
    .optional()
    .describe("Maximum score"),

  description: z.string().optional().describe("Grade description"),
});

export const UpdateGradeSchema = CreateGradeSchema.partial();

export class CreateGradeDto extends createZodDto(CreateGradeSchema) {}

export class UpdateGradeDto extends createZodDto(UpdateGradeSchema) {}
