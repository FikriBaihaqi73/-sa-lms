import type { Prisma } from "#generated/client";

export const rolePermissionSelect = {
  id: true,
  roleId: true,
  permissionId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.RolePermissionSelect;

export type RolePermissionSelectType = typeof rolePermissionSelect;

export type RolePermissionEntity = Prisma.RolePermissionGetPayload<{
  select: RolePermissionSelectType;
}>;
