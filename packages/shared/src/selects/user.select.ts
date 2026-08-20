import type { Prisma } from "#generated/client";

export const userSelect = {
  id: true,
  role_id: true,
  username: true,
  is_active: true,
  last_login: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
} satisfies Prisma.UsersSelect;

export type UserSelectType = typeof userSelect;

export type UserEntity = Prisma.UsersGetPayload<{
  select: UserSelectType;
}>;

export const userWithPasswordSelect = {
  ...userSelect,
  password: true,
} satisfies Prisma.UsersSelect;

export type UserWithPasswordSelectType = typeof userWithPasswordSelect;

export type UserWithPasswordEntity = Prisma.UsersGetPayload<{
  select: UserWithPasswordSelectType;
}>;
