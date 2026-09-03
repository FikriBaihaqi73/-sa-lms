import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createInstitutionSchema = z.object({
  institutionLevelId: z.string().uuid().describe("ID level institusi"),
  name: z.string().min(1).describe("Nama institusi"),
  shortName: z.string().optional().describe("Nama singkat institusi"),
  address: z.string().optional().describe("Alamat institusi"),
  city: z.string().optional().describe("Kota institusi"),
  province: z.string().optional().describe("Provinsi institusi"),
  postalCode: z.string().optional().describe("Kode pos institusi"),
  phoneNumber: z.string().optional().describe("Nomor telepon institusi"),
  email: z.string().email().optional().describe("Email institusi"),
  website: z.string().url().optional().describe("Website institusi"),
  logoUrl: z.string().url().optional().describe("URL logo institusi"),
});

export const updateInstitutionSchema = createInstitutionSchema.partial();

export class CreateInstitutionDto extends createZodDto(
  createInstitutionSchema,
) {}

export class UpdateInstitutionDto extends createZodDto(
  updateInstitutionSchema,
) {}
