import type { Prisma } from "#generated/client";

export const subjectPrerequisitesSelect = {
  id: true,
  subjectId: true,
  prerequisiteSubjectId: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.SubjectPrerequisitesSelect;

export type SubjectPrerequisitesSelectType = typeof subjectPrerequisitesSelect;

export type SubjectPrerequisitesEntity = Prisma.SubjectPrerequisitesGetPayload<{
  select: SubjectPrerequisitesSelectType;
}>;
