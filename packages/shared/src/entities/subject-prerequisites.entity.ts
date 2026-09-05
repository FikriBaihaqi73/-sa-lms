import type { Prisma } from "#generated/client";
import { subjectPrerequisitesSelect } from "#selects/subject-prerequisites.select";

// Tipe balikan untuk satu objek SubjectPrerequisites
export type SubjectPrerequisitesEntity = Prisma.SubjectPrerequisitesGetPayload<{
  select: typeof subjectPrerequisitesSelect;
}>;

// Tipe balikan jika datanya berupa Array (untuk list)
export type SubjectPrerequisitesListEntity = SubjectPrerequisitesEntity[];
