import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateModuleSchema = z.object({
  class_subject_id: z.string().uuid().describe("Class subject ID"),
  title: z.string().min(1).describe("Module title"),
  description: z.string().optional().nullable().describe("Module description"),
  display_order: z
    .number()
    .int()
    .optional()
    .nullable()
    .describe("Display order"),
  is_published: z
    .boolean()
    .optional()
    .nullable()
    .describe("Is module published"),
  is_locked: z.boolean().optional().nullable().describe("Is module locked"),
});

export const UpdateModuleSchema = CreateModuleSchema.partial();

export class CreateModuleDto extends createZodDto(CreateModuleSchema) {}
export class UpdateModuleDto extends createZodDto(UpdateModuleSchema) {}
