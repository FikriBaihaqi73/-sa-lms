import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const CreateStudentGuardianSchema = z.object({
  studentId: z.uuid().describe("Student ID"),

  guardianId: z.uuid().describe("Guardian ID"),

  isPrimary: z.boolean().optional().describe("Primary guardian status"),
});

export const UpdateStudentGuardianSchema = z.object({
  studentId: z.uuid().optional().describe("Student ID"),

  guardianId: z.uuid().optional().describe("Guardian ID"),

  isPrimary: z.boolean().optional().describe("Primary guardian status"),
});

export class CreateStudentGuardianDto extends createZodDto(
  CreateStudentGuardianSchema,
) {}

export class UpdateStudentGuardianDto extends createZodDto(
  UpdateStudentGuardianSchema,
) {}