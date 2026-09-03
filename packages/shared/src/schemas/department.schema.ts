import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateDepartmentSchema = z.object({
  name: z
    .string()
    .min(1, "Department name is required")
    .max(255, "Department name must not exceed 255 characters")
    .describe("Name of the department"),
  code: z
    .string()
    .min(1, "Department code is required")
    .max(50, "Department code must not exceed 50 characters")
    .describe("Unique code of the department"),
});

export const UpdateDepartmentSchema = CreateDepartmentSchema.partial();

export class CreateDepartmentDto extends createZodDto(CreateDepartmentSchema) {}
export class UpdateDepartmentDto extends createZodDto(UpdateDepartmentSchema) {}
