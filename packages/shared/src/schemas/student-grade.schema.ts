import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateStudentGradeSchema = z.object({
  studentId: z
    .string()
    .uuid("Invalid student ID format")
    .describe("ID of the student"),
  classSubjectId: z
    .string()
    .uuid("Invalid class subject ID format")
    .describe("ID of the class subject"),
  academicYearId: z
    .string()
    .uuid("Invalid academic year ID format")
    .describe("ID of the academic year"),
  assignmentScore: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score must not exceed 100")
    .optional()
    .describe("Score for assignments"),
  quizScore: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score must not exceed 100")
    .optional()
    .describe("Score for quizzes"),
  midExamScore: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score must not exceed 100")
    .optional()
    .describe("Score for mid examination"),
  finalExamScore: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score must not exceed 100")
    .optional()
    .describe("Score for final examination"),
  finalScore: z
    .number()
    .min(0, "Score must be at least 0")
    .max(100, "Score must not exceed 100")
    .optional()
    .describe("Final calculated score"),
  gradeId: z
    .string()
    .uuid("Invalid grade ID format")
    .optional()
    .describe("ID of the grade letter"),
  remarks: z.string().optional().describe("Additional remarks about the grade"),
});

export const UpdateStudentGradeSchema = CreateStudentGradeSchema.partial();

export class CreateStudentGradeDto extends createZodDto(
  CreateStudentGradeSchema,
) {}
export class UpdateStudentGradeDto extends createZodDto(
  UpdateStudentGradeSchema,
) {}
