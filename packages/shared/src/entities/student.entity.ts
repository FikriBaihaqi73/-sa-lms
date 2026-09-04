import type { Prisma } from "#generated/client";
import { studentSelect } from "#selects/students.select";

// Tipe balikan untuk satu objek Student
export type StudentEntity = Prisma.StudentGetPayload<{
  select: typeof studentSelect;
}>;

// Tipe balikan jika datanya berupa Array (untuk list)
export type StudentListEntity = StudentEntity[];
