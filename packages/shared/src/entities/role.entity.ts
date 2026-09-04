import type { Prisma } from "#generated/client";
import { roleSelect } from "#selects/role.select";

// Tipe balikan untuk satu objek Role
export type RoleEntity = Prisma.RoleGetPayload<{
  select: typeof roleSelect;
}>;

// Tipe balikan jika datanya berupa Array (untuk list)
export type RoleListEntity = RoleEntity[];
