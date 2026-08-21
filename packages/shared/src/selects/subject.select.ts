import type { Prisma } from "#generated/client";

export const subjectSelect = {
  id: true,
  code: true,
  name: true,
  credits: true,
  description: true,
  institutionId: true,
  departmentId: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.SubjectSelect;

export type SubjectSelectType = typeof subjectSelect;

export type SubjectEntity = Prisma.SubjectGetPayload<{
  select: SubjectSelectType;
}>;