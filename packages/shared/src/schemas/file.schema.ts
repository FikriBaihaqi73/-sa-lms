import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateFileSchema = z.object({
  original_name: z
    .string()
    .min(1, "Original name is required")
    .max(255)
    .describe("Original file name"),
  file_name: z
    .string()
    .min(1, "File name is required")
    .max(255)
    .describe("Saved file name on storage"),
  file_path: z
    .string()
    .min(1, "File path is required")
    .describe("Path to the file on storage"),
  file_extension: z
    .string()
    .max(50)
    .optional()
    .nullable()
    .describe("File extension (e.g. .jpg)"),
  mime_type: z
    .string()
    .max(255)
    .optional()
    .nullable()
    .describe("MIME type (e.g. image/jpeg)"),
  file_size: z.coerce
    .number()
    .int()
    .nonnegative()
    .optional()
    .nullable()
    .describe("File size in bytes"),
  uploaded_by: z
    .string()
    .uuid("Invalid uploaded_by UUID format")
    .optional()
    .nullable()
    .describe("User ID who uploaded the file"),
});

export const UpdateFileSchema = CreateFileSchema.partial();

export class CreateFileDto extends createZodDto(CreateFileSchema) {}
export class UpdateFileDto extends createZodDto(UpdateFileSchema) {}
