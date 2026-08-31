import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreatePermissionSchema = z.object({
  name: z
    .string()
    .min(1, "Permission name is required")
    .max(255, "Permission name must not exceed 255 characters")
    .describe("Unique permission name (e.g., users.create, classes.read)"),
  module: z
    .string()
    .min(1, "Module name is required")
    .max(255, "Module name must not exceed 255 characters")
    .describe(
      "Module or domain name the permission belongs to (e.g., users, classes)",
    ),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .nullable()
    .describe("Optional description of the permission"),
});

export const UpdatePermissionSchema = z.object({
  name: z
    .string()
    .min(1, "Permission name must not be empty")
    .max(255, "Permission name must not exceed 255 characters")
    .optional()
    .describe("Updated unique permission name"),
  module: z
    .string()
    .min(1, "Module name must not be empty")
    .max(255, "Module name must not exceed 255 characters")
    .optional()
    .describe("Updated module or domain name"),
  description: z
    .string()
    .max(1000, "Description must not exceed 1000 characters")
    .optional()
    .nullable()
    .describe("Updated description of the permission"),
});

export class CreatePermissionDto extends createZodDto(CreatePermissionSchema) {}
export class UpdatePermissionDto extends createZodDto(UpdatePermissionSchema) {}
