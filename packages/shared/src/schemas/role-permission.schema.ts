import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createRolePermissionSchema = z.object({
  roleId: z.string().uuid().describe("ID dari role (UUID)"),
  permissionId: z.string().uuid().describe("ID dari permission (UUID)"),
});

export const updateRolePermissionSchema = createRolePermissionSchema.partial();

export class CreateRolePermissionDto extends createZodDto(
  createRolePermissionSchema,
) {}
export class UpdateRolePermissionDto extends createZodDto(
  updateRolePermissionSchema,
) {}
