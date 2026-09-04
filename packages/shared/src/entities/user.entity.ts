import type { Prisma } from "#generated/client";
import {
  userSelect,
  userWithPasswordSelect,
} from "#selects/user.select";

export type UserEntity = Prisma.UsersGetPayload<{
  select: typeof userSelect;
}>;

export type UserListEntity = UserEntity[];

export type UserWithPasswordEntity = Prisma.UsersGetPayload<{
  select: typeof userWithPasswordSelect;
}>;

export type UserWithPasswordListEntity = UserWithPasswordEntity[];