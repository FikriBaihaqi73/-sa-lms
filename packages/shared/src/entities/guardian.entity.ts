import type { Prisma } from "#generated/client";
import { guardianSelect } from "#selects/guardian.select";

// Tipe balikan untuk satu objek Guardian
export type GuardianEntity = Prisma.GuardianGetPayload<{
  select: typeof guardianSelect;
}>;

// Tipe balikan jika datanya berupa Array (untuk list)
export type GuardianListEntity = GuardianEntity[];
