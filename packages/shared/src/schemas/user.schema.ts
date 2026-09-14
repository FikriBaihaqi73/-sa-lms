import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email().max(255).describe("Unique email address for login"),
  password: z
    .string()
    .min(8)
    .max(128)
    .describe("User password (8 to 128 characters)"),
  is_active: z
    .boolean()
    .optional()
    .default(true)
    .describe("User active status"),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
