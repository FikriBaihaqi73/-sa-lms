import type { Prisma } from "#generated/client";
import { subjectSelect } from "#selects/subject.select";

export const subjectPrerequisitesSelect = {
  id: true,
  subjectId: true,
  prerequisiteSubjectId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  subject: {
    select: subjectSelect,
  },
  prerequisiteSubject: {
    select: subjectSelect,
  },
} satisfies Prisma.SubjectPrerequisitesSelect;

export type SubjectPrerequisitesSelectType = typeof subjectPrerequisitesSelect;

export type SubjectPrerequisitesEntity = Prisma.SubjectPrerequisitesGetPayload<{
  select: SubjectPrerequisitesSelectType;
}>;
