import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateModuleContentSchema = z.object({
  moduleId: z.string().uuid().describe("ID of the related module"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .describe("Title of the module content"),
  contentType: z
    .string()
    .min(1, "Content type is required")
    .describe("Type of the content (e.g., video, text, pdf)"),
  content: z
    .string()
    .optional()
    .nullable()
    .describe("Text content or URL to the content"),
  fileId: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .describe("ID of the uploaded file if applicable"),
  sortOrder: z
    .number()
    .int()
    .optional()
    .nullable()
    .describe("Display order of the content within the module"),
});

export const UpdateModuleContentSchema = CreateModuleContentSchema.partial();

export class CreateModuleContentDto extends createZodDto(
  CreateModuleContentSchema,
) {}
export class UpdateModuleContentDto extends createZodDto(
  UpdateModuleContentSchema,
) {}
