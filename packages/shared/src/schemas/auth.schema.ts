import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const RegisterSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must contain at least 3 characters")
    .max(50, "Username must not exceed 50 characters")
    .regex(/^[a-zA-Z0-9._-]+$/, "Username contains invalid characters")
    .describe(
      "Unique login name; letters, numbers, dots, underscores, and hyphens only",
    ),
  email: z
    .email("Email format is invalid")
    .max(255, "Email must not exceed 255 characters")
    .describe("Unique email address used for the account"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .describe("Password between 8 and 128 characters"),
});

export class RegisterDto extends createZodDto(RegisterSchema) {}

export const LoginSchema = z.object({
  email: z
    .email("Email format is invalid")
    .max(255, "Email must not exceed 255 characters")
    .describe("Registered email address"),
  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(128, "Password must not exceed 128 characters")
    .describe("Account password"),
});

export class LoginDto extends createZodDto(LoginSchema) {}

export const LogoutSchema = z
  .object({})
  .describe("Empty body for logout request");

export class logoutDto extends createZodDto(LogoutSchema) {}
