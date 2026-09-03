import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateStudyPlanSchema = z.object({
  student_id: z.string().uuid().describe("Student ID"),
  class_subject_id: z.string().uuid().describe("Class subject ID"),
  academic_year_id: z.string().uuid().describe("Academic year ID"),
});

export const UpdateStudyPlanSchema = CreateStudyPlanSchema.partial();

export class CreateStudyPlanDto extends createZodDto(CreateStudyPlanSchema) {}
export class UpdateStudyPlanDto extends createZodDto(UpdateStudyPlanSchema) {}
