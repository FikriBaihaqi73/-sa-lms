import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateScheduleSchema = z.object({
  classSubjectId: z.uuid().describe("Class subject ID"),
  classroomId: z.uuid().describe("Classroom ID"),
  day: z.string().min(1).describe("Schedule day"),
  startTime: z.coerce.date().optional().describe("Start time"),
  endTime: z.coerce.date().optional().describe("End time"),
});

export const UpdateScheduleSchema = z.object({
  classSubjectId: z.uuid().optional().describe("Class subject ID"),
  classroomId: z.uuid().optional().describe("Classroom ID"),
  day: z.string().min(1).optional().describe("Schedule day"),
  startTime: z.coerce.date().optional().describe("Start time"),
  endTime: z.coerce.date().optional().describe("End time"),
});

export class CreateScheduleDto extends createZodDto(CreateScheduleSchema) {}

export class UpdateScheduleDto extends createZodDto(UpdateScheduleSchema) {}
