import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createInstitutionLevelSchema = z.object({
  name: z
    .string()
    .min(1)
    .describe("Nama level institusi (Contoh: SD, SMP, SMA)"),
  description: z
    .string()
    .optional()
    .describe("Deskripsi singkat mengenai level institusi"),
});

export const updateInstitutionLevelSchema =
  createInstitutionLevelSchema.partial();

export class CreateInstitutionLevelDto extends createZodDto(
  createInstitutionLevelSchema,
) {}
export class UpdateInstitutionLevelDto extends createZodDto(
  updateInstitutionLevelSchema,
) {}
