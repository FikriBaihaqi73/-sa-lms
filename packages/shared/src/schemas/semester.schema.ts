import { createZodDto } from "nestjs-zod/dto";

import { z } from "zod";

export const CreateSemesterSchema = z.object({
  academic_year_id: z.string().uuid().describe("Academic year ID"),

  name: z.string().min(1).describe("Semester name"),

  start_date: z.coerce.date().optional().describe("Semester start date"),

  end_date: z.coerce.date().optional().describe("Semester end date"),

  is_active: z.boolean().optional().describe("Semester active status"),
});

export const UpdateSemesterSchema = CreateSemesterSchema.partial();

export class CreateSemesterDto extends createZodDto(CreateSemesterSchema) {}

export class UpdateSemesterDto extends createZodDto(UpdateSemesterSchema) {}
