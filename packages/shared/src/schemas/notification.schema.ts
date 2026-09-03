import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateNotificationSchema = z.object({
  userId: z
    .string()
    .uuid("Invalid user ID format")
    .describe("ID of the user"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title must not exceed 255 characters")
    .describe("Title of the notification"),
  message: z
    .string()
    .optional()
    .describe("Message content of the notification"),
  isRead: z
    .boolean()
    .optional()
    .describe("Whether the notification has been read"),
  readAt: z
    .string()
    .datetime()
    .optional()
    .describe("Date and time when the notification was read"),
});

export const UpdateNotificationSchema = CreateNotificationSchema.partial();

export const createNotificationSchema = CreateNotificationSchema;
export const updateNotificationSchema = UpdateNotificationSchema;

export class CreateNotificationDto extends createZodDto(CreateNotificationSchema) {}
export class UpdateNotificationDto extends createZodDto(UpdateNotificationSchema) {}
