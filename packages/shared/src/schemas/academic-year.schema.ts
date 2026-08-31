import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateAcademicYearSchema = z.object({
  academic_year: z.string().min(1).describe("Academic year"),
  is_active: z
    .boolean()
    .optional()
    .default(false)
    .describe("Academic year active status"),
});

export const UpdateAcademicYearSchema = z.object({
  academic_year: z.string().min(1).optional().describe("Academic year"),
  is_active: z.boolean().optional().describe("Academic year active status"),
});

export class CreateAcademicYearDto extends createZodDto(
  CreateAcademicYearSchema,
) {}

export class UpdateAcademicYearDto extends createZodDto(
  UpdateAcademicYearSchema,
) {}
