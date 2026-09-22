import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateStudyResultSchema = z.object({
  studentId: z
    .string()
    .uuid("Invalid studentId UUID format")
    .describe("Student ID"),
  academicYearId: z
    .string()
    .uuid("Invalid academicYearId UUID format")
    .describe("Academic Year ID"),
  semesterId: z
    .string()
    .uuid("Invalid semesterId UUID format")
    .describe("Semester ID"),
  totalCredits: z
    .number()
    .int("Total credits must be an integer")
    .min(0, "Total credits must be non-negative")
    .optional()
    .nullable()
    .describe("Total credits taken"),
  semesterGpa: z
    .number()
    .min(0, "GPA must be at least 0.0")
    .max(4, "GPA must not exceed 4.0")
    .optional()
    .nullable()
    .describe("Semester GPA (0.0 - 4.0)"),
  cumulativeGpa: z
    .number()
    .min(0, "GPA must be at least 0.0")
    .max(4, "GPA must not exceed 4.0")
    .optional()
    .nullable()
    .describe("Cumulative GPA (0.0 - 4.0)"),
  academicStatusId: z
    .string()
    .uuid("Invalid academicStatusId UUID format")
    .optional()
    .nullable()
    .describe("Academic Status ID"),
});

export const UpdateStudyResultSchema = CreateStudyResultSchema.partial();

export const QueryStudyResultSchema = z.object({
  page: z.string().optional().describe("Page number (default: 1)"),
  limit: z.string().optional().describe("Items per page (default: 10)"),
  search: z.string().optional().describe("Search term for filtering"),
});

export class CreateStudyResultDto extends createZodDto(
  CreateStudyResultSchema,
) {}

export class UpdateStudyResultDto extends createZodDto(
  UpdateStudyResultSchema,
) {}

export class QueryStudyResultDto extends createZodDto(QueryStudyResultSchema) {}
