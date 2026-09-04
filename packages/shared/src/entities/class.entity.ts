import type { Prisma } from "#generated/client";
import { classSelect } from "#selects/class.select";

// Tipe balikan untuk satu objek Class
export type ClassEntity = Prisma.ClassesGetPayload<{
  select: typeof classSelect;
}>;

// Tipe balikan jika datanya berupa Array (untuk list)
export type ClassListEntity = ClassEntity[];
