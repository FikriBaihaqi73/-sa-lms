import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateClassSchema = z.object({
  institution_id: z.uuid().describe("Institution ID"),
  homeroom_teacher_id: z.uuid().optional().describe("Homeroom teacher ID"),
  academic_year_id: z.uuid().describe("Academic year ID"),
  name: z.string().min(1).describe("Class name"),
  grade_level: z.number().int().describe("Grade level"),
  capacity: z.number().int().optional().describe("Class capacity"),
});

export const UpdateClassSchema = z.object({
  institution_id: z.uuid().optional().describe("Institution ID"),
  homeroom_teacher_id: z
    .uuid()
    .nullable()
    .optional()
    .describe("Homeroom teacher ID"),
  academic_year_id: z.uuid().optional().describe("Academic year ID"),
  name: z.string().min(1).optional().describe("Class name"),
  grade_level: z.number().int().optional().describe("Grade level"),
  capacity: z.number().int().nullable().optional().describe("Class capacity"),
});

export const ClassQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().describe("Page number"),
  limit: z.coerce.number().int().min(1).optional().describe("Items per page"),
  search: z.string().trim().optional().describe("Search keyword"),
});

export class CreateClassDto extends createZodDto(CreateClassSchema) {}

export class UpdateClassDto extends createZodDto(UpdateClassSchema) {}

export class ClassQueryDto extends createZodDto(ClassQuerySchema) {}
