import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateReligionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Religion name is required")
    .max(100, "Religion name must not exceed 100 characters")
    .describe("Unique religion name"),
});

export const UpdateReligionSchema = CreateReligionSchema.partial();

export class CreateReligionDto extends createZodDto(CreateReligionSchema) {}

export class UpdateReligionDto extends createZodDto(UpdateReligionSchema) {}
