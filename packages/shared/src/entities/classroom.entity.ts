import type { Prisma } from "#generated/client";
import { classroomSelect } from "#selects/classroom.select";

// Tipe balikan untuk satu objek Classroom
export type ClassroomEntity = Prisma.ClassroomGetPayload<{
  select: typeof classroomSelect;
}>;

// Tipe balikan jika datanya berupa Array (untuk list)
export type ClassroomListEntity = ClassroomEntity[];
