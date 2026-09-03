import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createNationalitySchema = z.object({
  name: z.string().min(1).describe("Nama kewarganegaraan"),
  description: z.string().optional().describe("Deskripsi kewarganegaraan"),
});

export const updateNationalitySchema = createNationalitySchema.partial();

export class CreateNationalityDto extends createZodDto(
  createNationalitySchema,
) {}
export class UpdateNationalityDto extends createZodDto(
  updateNationalitySchema,
) {}
