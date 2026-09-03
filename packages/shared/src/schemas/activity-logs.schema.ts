import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateActivityLogSchema = z.object({
  user_id: z
    .string()
    .uuid()
    .describe("ID of the user who performed the action"),
  module: z.string().min(1).describe("Module where the action occurred"),
  action: z.string().min(1).describe("Action performed by the user"),
  table_name: z
    .string()
    .min(1)
    .optional()
    .nullable()
    .describe("Affected database table name"),
  record_id: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .describe("ID of the affected record"),
  ip_address: z
    .string()
    .min(1)
    .optional()
    .nullable()
    .describe("IP address of the user"),
  user_agent: z
    .string()
    .optional()
    .nullable()
    .describe("User agent of the requesting client"),
});

export const UpdateActivityLogSchema = CreateActivityLogSchema.partial();

export class CreateActivityLogDto extends createZodDto(
  CreateActivityLogSchema,
) {}
export class UpdateActivityLogDto extends createZodDto(
  UpdateActivityLogSchema,
) {}
