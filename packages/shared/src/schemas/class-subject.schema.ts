import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateClassSubjectSchema = z.object({
  class_id: z.uuid().describe("Class ID"),
  subject_id: z.uuid().describe("Subject ID"),
  teacher_id: z.uuid().describe("Teacher ID"),
  academic_year_id: z.uuid().describe("Academic year ID"),
});

export const UpdateClassSubjectSchema = z.object({
  class_id: z.uuid().optional().describe("Class ID"),
  subject_id: z.uuid().optional().describe("Subject ID"),
  teacher_id: z.uuid().optional().describe("Teacher ID"),
  academic_year_id: z.uuid().optional().describe("Academic year ID"),
});

export class CreateClassSubjectDto extends createZodDto(
  CreateClassSubjectSchema,
) {}

export class UpdateClassSubjectDto extends createZodDto(
  UpdateClassSubjectSchema,
) {}
