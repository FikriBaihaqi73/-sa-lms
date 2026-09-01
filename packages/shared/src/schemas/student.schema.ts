import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateStudentSchema = z.object({
  profileId: z
    .string()
    .uuid("Invalid UUID format for profileId")
    .describe("Profile ID (UUID)"),
  departmentId: z
    .string()
    .uuid("Invalid UUID format for departmentId")
    .optional()
    .describe("Department ID (UUID)"),
  academicStatusId: z
    .string()
    .uuid("Invalid UUID format for academicStatusId")
    .describe("Academic Status ID (UUID)"),
  studentNumber: z
    .string()
    .min(1, "Student number is required")
    .describe("Student Number/NIM"),
  enrollmentYear: z.number().int().optional().describe("Enrollment Year"),
});

export const UpdateStudentSchema = CreateStudentSchema.partial();

export class CreateStudentDto extends createZodDto(CreateStudentSchema) {}
export class UpdateStudentDto extends createZodDto(UpdateStudentSchema) {}
