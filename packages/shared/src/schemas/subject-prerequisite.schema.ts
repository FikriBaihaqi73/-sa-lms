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

export class CreateSubjectPrerequisiteDto extends createZodDto(
  CreateSubjectPrerequisiteSchema,
) {}

export class UpdateSubjectPrerequisiteDto extends createZodDto(
  UpdateSubjectPrerequisiteSchema,
) {}
