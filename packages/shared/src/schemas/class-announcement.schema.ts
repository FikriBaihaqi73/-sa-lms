import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateClassAnnouncementSchema = z.object({
  classId: z.uuid().describe("Class ID"),
  title: z.string().min(1).describe("Announcement title"),
  content: z.string().optional().describe("Announcement content"),
});

export const UpdateClassAnnouncementSchema = z.object({
  classId: z.uuid().optional().describe("Class ID"),
  title: z.string().min(1).optional().describe("Announcement title"),
  content: z.string().optional().describe("Announcement content"),
});

export class CreateClassAnnouncementDto extends createZodDto(
  CreateClassAnnouncementSchema,
) {}

export class UpdateClassAnnouncementDto extends createZodDto(
  UpdateClassAnnouncementSchema,
) {}
