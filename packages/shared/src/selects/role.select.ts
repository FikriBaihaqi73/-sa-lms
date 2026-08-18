import type { Prisma } from "#generated/client";

export const roleSelect = {
  id: true,
  name: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.RoleSelect;

export type RoleSelectType = typeof roleSelect;

export type RoleEntity = Prisma.RoleGetPayload<{
  select: RoleSelectType;
}>;
