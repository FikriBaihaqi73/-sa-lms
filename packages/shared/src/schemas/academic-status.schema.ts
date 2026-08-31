import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateAcademicStatusSchema = z.object({
  name: z.string().min(1).describe("Academic status name"),
  description: z.string().optional().describe("Academic status description"),
});

export const UpdateAcademicStatusSchema = z.object({
  name: z.string().min(1).optional().describe("Academic status name"),
  description: z.string().optional().describe("Academic status description"),
});

export class CreateAcademicStatusDto extends createZodDto(
  CreateAcademicStatusSchema,
) {}

export class UpdateAcademicStatusDto extends createZodDto(
  UpdateAcademicStatusSchema,
) {}
