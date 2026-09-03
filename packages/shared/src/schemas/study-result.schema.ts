import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateStudyResultSchema = z.object({
  student_id: z
    .string()
    .uuid("Invalid student_id UUID format")
    .describe("Student ID"),
  academic_year_id: z
    .string()
    .uuid("Invalid academic_year_id UUID format")
    .describe("Academic Year ID"),
  semester_id: z
    .string()
    .uuid("Invalid semester_id UUID format")
    .describe("Semester ID"),
  total_credits: z
    .number()
    .int()
    .nonnegative()
    .optional()
    .nullable()
    .describe("Total credits taken"),
  semester_gpa: z
    .number()
    .min(0)
    .max(4)
    .optional()
    .nullable()
    .describe("Semester GPA (0.0 - 4.0)"),
  cumulative_gpa: z
    .number()
    .min(0)
    .max(4)
    .optional()
    .nullable()
    .describe("Cumulative GPA (0.0 - 4.0)"),
  academic_status_id: z
    .string()
    .uuid("Invalid academic_status_id UUID format")
    .optional()
    .nullable()
    .describe("Academic Status ID"),
});

export const UpdateStudyResultSchema = CreateStudyResultSchema.partial();

export class CreateStudyResultDto extends createZodDto(CreateStudyResultSchema) {}
export class UpdateStudyResultDto extends createZodDto(UpdateStudyResultSchema) {}
