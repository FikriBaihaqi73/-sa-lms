import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateEmploymentStatusSchema = z.object({
  name: z.string().min(1).describe("Employment status name"),
  description: z
  .string()
  .optional()
  .describe("Employment status description"),
});

export const UpdateEmploymentStatusSchema = CreateEmploymentStatusSchema.partial();

export class CreateEmploymentStatusDto extends createZodDto(CreateEmploymentStatusSchema) {}
export class UpdateEmploymentStatusDto extends createZodDto(UpdateEmploymentStatusSchema) {}
