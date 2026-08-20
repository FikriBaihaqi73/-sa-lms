import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateUserSchema = z.object({
  role_id: z.string().uuid().describe("Role ID (UUID) of the user"),
  username: z.string().min(3).max(50).describe("Unique username for login"),
  password: z.string().min(8).describe("User password (min 8 characters)"),
  is_active: z
    .boolean()
    .optional()
    .default(true)
    .describe("User active status"),
});

export const UpdateUserSchema = z.object({
  role_id: z.string().uuid().optional().describe("Role ID (UUID) of the user"),
  username: z
    .string()
    .min(3)
    .max(50)
    .optional()
    .describe("Unique username for login"),
  password: z
    .string()
    .min(8)
    .optional()
    .describe("User password (min 8 characters)"),
  is_active: z.boolean().optional().describe("User active status"),
});

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
