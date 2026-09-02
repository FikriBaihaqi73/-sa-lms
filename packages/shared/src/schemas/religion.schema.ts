import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateReligionSchema = z.object({
  name: z.string().min(1).describe("Religion name"),
});

export const UpdateReligionSchema = CreateReligionSchema.partial();

export class CreateReligionDto extends createZodDto(CreateReligionSchema) {}

export class UpdateReligionDto extends createZodDto(UpdateReligionSchema) {}
