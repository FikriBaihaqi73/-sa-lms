import type { Prisma } from "#generated/client";
import { rolePermissionSelect } from "#selects/role-permission.select";

export type RolePermissionEntity = Prisma.RolePermissionGetPayload<{
  select: typeof rolePermissionSelect;
}>;

export type RolePermissionListEntity = RolePermissionEntity[];