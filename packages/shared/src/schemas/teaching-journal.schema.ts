import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateTeachingJournalSchema = z.object({
  schedule_id: z
    .string()
    .uuid("Invalid schedule ID format")
    .describe("ID of the schedule"),
  meeting_number: z
    .number()
    .int("Meeting number must be an integer")
    .min(1, "Meeting number must be at least 1")
    .optional()
    .describe("Meeting number of the class"),
  journal_date: z
    .string()
    .datetime({ message: "Invalid date format" })
    .optional()
    .describe("Date of the teaching journal"),
  topic: z
    .string()
    .max(255, "Topic must not exceed 255 characters")
    .optional()
    .describe("Topic of the teaching session"),
  material: z
    .string()
    .optional()
    .describe("Material covered during the teaching session"),
  notes: z
    .string()
    .optional()
    .describe("Additional notes for the teaching journal"),
});

export const UpdateTeachingJournalSchema =
  CreateTeachingJournalSchema.partial();

export class CreateTeachingJournalDto extends createZodDto(
  CreateTeachingJournalSchema,
) {}
export class UpdateTeachingJournalDto extends createZodDto(
  UpdateTeachingJournalSchema,
) {}
