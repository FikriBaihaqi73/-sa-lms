import type { Prisma } from "#generated/client";
import { studentGuardianSelect } from "#selects/student-guardian.select";

// Tipe balikan untuk satu objek StudentGuardian
export type StudentGuardianEntity = Prisma.StudentGuardianGetPayload<{
  select: typeof studentGuardianSelect;
}>;

// Tipe balikan jika datanya berupa Array (untuk list)
export type StudentGuardianListEntity = StudentGuardianEntity[];
