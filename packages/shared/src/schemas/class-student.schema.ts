import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateClassStudentSchema = z.object({
  classId: z.uuid().describe("Class ID"),
  studentId: z.uuid().describe("Student ID"),
});

export const UpdateClassStudentSchema = CreateClassStudentSchema.partial();

export const createClassStudentSchema = CreateClassStudentSchema;
export const updateClassStudentSchema = UpdateClassStudentSchema;

export class CreateClassStudentDto extends createZodDto(
  CreateClassStudentSchema,
) {}
export class UpdateClassStudentDto extends createZodDto(
  UpdateClassStudentSchema,
) {}
