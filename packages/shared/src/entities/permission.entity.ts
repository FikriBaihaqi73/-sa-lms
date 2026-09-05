import type { Prisma } from "#generated/client";
import { permissionSelect } from "#selects/permission.select";

export type PermissionEntity = Prisma.PermissionGetPayload<{
  select: typeof permissionSelect;
}>;

export type PermissionListEntity = PermissionEntity[];