import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateAssignmentTypeSchema = z.object({
  name: z.string().min(1).describe("Assignment type name"),
  description: z.string().optional().describe("Assignment type description"),
});

export const UpdateAssignmentTypeSchema = CreateAssignmentTypeSchema.partial();

export class CreateAssignmentTypeDto extends createZodDto(
  CreateAssignmentTypeSchema,
) {}
export class UpdateAssignmentTypeDto extends createZodDto(
  UpdateAssignmentTypeSchema,
) {}
