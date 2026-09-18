import { createZodDto } from "nestjs-zod/dto";

import { z } from "zod";

export const CreateSemesterSchema = z.object({
  academic_year_id: z.string().uuid().describe("Academic year ID"),

  name: z.string().min(1).describe("Semester name"),

  start_date: z.string().datetime({ message: "Invalid date format" }).optional().describe("Semester start date (ISO 8601)"),

  end_date: z.string().datetime({ message: "Invalid date format" }).optional().describe("Semester end date (ISO 8601)"),

  is_active: z.boolean().optional().describe("Semester active status"),
});

export const UpdateSemesterSchema = CreateSemesterSchema.partial();

export class CreateSemesterDto extends createZodDto(CreateSemesterSchema) {}

export class UpdateSemesterDto extends createZodDto(UpdateSemesterSchema) {}
