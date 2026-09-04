import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateSpecializationSchema = z.object({
  name: z.string().min(1).describe("Specialization name"),
  description: z.string().optional().describe("Specialization description"),
});

export const UpdateSpecializationSchema = CreateSpecializationSchema.partial();

export class CreateSpecializationDto extends createZodDto(
  CreateSpecializationSchema,
) {}
export class UpdateSpecializationDto extends createZodDto(
  UpdateSpecializationSchema,
) {}
