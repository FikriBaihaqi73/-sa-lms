import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateSubjectPrerequisiteSchema = z.object({
  subjectId: z.uuid().describe("Subject ID"),
  prerequisiteSubjectId: z.uuid().describe("Prerequisite subject ID"),
});

export const UpdateSubjectPrerequisiteSchema = z.object({
  subjectId: z.uuid().optional().describe("Subject ID"),
  prerequisiteSubjectId: z
    .uuid()
    .optional()
    .describe("Prerequisite subject ID"),
});

export const SubjectPrerequisiteQuerySchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1)
    .default(1)
    .describe("Page number for pagination"),
  limit: z.coerce
    .number()
    .int()
    .min(1)
    .default(10)
    .describe("Number of items per page"),
  search: z
    .string()
    .trim()
    .optional()
    .describe("Search subject or prerequisite subject by code or name"),
});

export class CreateSubjectPrerequisiteDto extends createZodDto(
  CreateSubjectPrerequisiteSchema,
) {}

export class UpdateSubjectPrerequisiteDto extends createZodDto(
  UpdateSubjectPrerequisiteSchema,
) {}

export class SubjectPrerequisiteQueryDto extends createZodDto(
  SubjectPrerequisiteQuerySchema,
) {}
