import type { Prisma } from "#generated/client";

export const userSelect = {
  id: true,
  username: true,
  is_active: true,
  created_at: true,
  updated_at: true,
} satisfies Prisma.UsersSelect;

export type UserSelectType = typeof userSelect;

export type UserEntity = Prisma.UsersGetPayload<{
  select: UserSelectType;
}>;
