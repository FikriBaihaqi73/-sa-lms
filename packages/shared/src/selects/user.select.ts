import type { Prisma } from "#generated/client";
import { profileSelect } from "./profile.select.js";

export const userSelect = {
  id: true,
  email: true,
  access_token: true,
  is_active: true,
  last_login: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  profile: {
    select: profileSelect,
  },
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
