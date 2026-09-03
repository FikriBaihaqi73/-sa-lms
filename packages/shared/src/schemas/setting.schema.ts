import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateSettingSchema = z.object({
  settingKey: z.string().min(1).describe("Unique key of the setting"),
  settingValue: z
    .string()
    .optional()
    .nullable()
    .describe("Value of the setting"),
  description: z
    .string()
    .optional()
    .nullable()
    .describe("Description of the setting"),
  updatedBy: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .describe("ID of the user updating the setting"),
});

export const UpdateSettingSchema = CreateSettingSchema.partial();

export class CreateSettingDto extends createZodDto(CreateSettingSchema) {}
export class UpdateSettingDto extends createZodDto(UpdateSettingSchema) {}
