import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateAnnouncementSchema = z.object({
  institutionId: z
    .string()
    .uuid("Invalid institution ID format")
    .describe("ID of the institution"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .describe("Title of the announcement"),
  content: z
    .string()
    .optional()
    .describe("Content of the announcement"),
  isPublished: z
    .boolean()
    .optional()
    .describe("Whether the announcement is published"),
  publishedAt: z
    .string()
    .datetime()
    .optional()
    .describe("Date and time when the announcement was published"),
  expiredAt: z
    .string()
    .datetime()
    .optional()
    .describe("Date and time when the announcement expires"),
});

export const UpdateAnnouncementSchema = CreateAnnouncementSchema.partial();

export const createAnnouncementSchema = CreateAnnouncementSchema;
export const updateAnnouncementSchema = UpdateAnnouncementSchema;

export class CreateAnnouncementDto extends createZodDto(CreateAnnouncementSchema) {}
export class UpdateAnnouncementDto extends createZodDto(UpdateAnnouncementSchema) {}
