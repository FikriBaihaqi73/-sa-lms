import type { Prisma } from "#generated/client";
import { teacherSelect } from "#selects/teacher.select";

// Tipe balikan untuk satu objek Teacher
export type TeacherEntity = Prisma.TeachersGetPayload<{
  select: typeof teacherSelect;
}>;

// Tipe balikan jika datanya berupa Array (untuk list)
export type TeacherListEntity = TeacherEntity[];
