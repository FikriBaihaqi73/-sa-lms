import type { Prisma } from "#generated/client";

export const permissionSelect = {
  id: true,
  name: true,
  module: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  description: true,
} satisfies Prisma.PermissionSelect;

export type PermissionSelectType = typeof permissionSelect;

export type PermissionEntity = Prisma.PermissionGetPayload<{
  select: PermissionSelectType;
}>;
