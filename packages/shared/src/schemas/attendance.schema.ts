import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateAttendanceSchema = z.object({
  schedule_id: z
    .string()
    .uuid("Invalid schedule ID format")
    .describe("ID of the schedule"),
  student_id: z
    .string()
    .uuid("Invalid student ID format")
    .describe("ID of the student"),
  attendance_status_id: z
    .string()
    .uuid("Invalid attendance status ID format")
    .describe("ID of the attendance status"),
  attendance_date: z
    .string()
    .datetime({ message: "Invalid date format" })
    .optional()
    .describe("Date of the attendance"),
  notes: z.string().optional().describe("Notes for the attendance"),
});

export const UpdateAttendanceSchema = CreateAttendanceSchema.partial();

export const createAttendanceSchema = CreateAttendanceSchema;
export const updateAttendanceSchema = UpdateAttendanceSchema;

export class CreateAttendanceDto extends createZodDto(CreateAttendanceSchema) {}
export class UpdateAttendanceDto extends createZodDto(UpdateAttendanceSchema) {}
