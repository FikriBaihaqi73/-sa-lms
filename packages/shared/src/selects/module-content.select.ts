import type { Prisma } from "#generated/client";

export const moduleContentSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  moduleId: true,
  title: true,
  contentType: true,
  content: true,
  fileId: true,
  sortOrder: true,
} satisfies Prisma.ModuleContentSelect;

export type ModuleContentSelectType = typeof moduleContentSelect;

export type ModuleContentEntity = Prisma.ModuleContentGetPayload<{
  select: ModuleContentSelectType;
}>;
