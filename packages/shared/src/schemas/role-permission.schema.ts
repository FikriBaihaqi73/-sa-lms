import { createZodDto } from "nestjs-zod/dto";
import { z } from "zod";

export const CreateRolePermissionSchema = z.object({
  roleId: z
    .string()
    .uuid("Invalid UUID format for roleId")
    .describe("Role ID (UUID)"),
  permissionId: z
    .string()
    .uuid("Invalid UUID format for permissionId")
    .describe("Permission ID (UUID)"),
});

export const UpdateRolePermissionSchema = z.object({
  roleId: z
    .string()
    .uuid("Invalid UUID format for roleId")
    .optional()
    .describe("Updated Role ID (UUID)"),
  permissionId: z
    .string()
    .uuid("Invalid UUID format for permissionId")
    .optional()
    .describe("Updated Permission ID (UUID)"),
});

export const AssignRolePermissionsSchema = z.object({
  permissionIds: z
    .array(z.string().uuid("Invalid UUID format for permissionId"))
    .min(1, "At least one permission ID is required")
    .describe("Array of Permission IDs (UUIDs) to assign to a role"),
});

export class CreateRolePermissionDto extends createZodDto(
  CreateRolePermissionSchema,
) {}
export class UpdateRolePermissionDto extends createZodDto(
  UpdateRolePermissionSchema,
) {}
export class AssignRolePermissionsDto extends createZodDto(
  AssignRolePermissionsSchema,
) {}
