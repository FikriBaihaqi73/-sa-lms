import type { Prisma } from "#generated/client";

export const classAnnouncementSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,

  classId: true,
  title: true,
  content: true,
} satisfies Prisma.ClassAnnouncementSelect;

export type ClassAnnouncementSelectType = typeof classAnnouncementSelect;

export type ClassAnnouncementEntity = Prisma.ClassAnnouncementGetPayload<{
  select: ClassAnnouncementSelectType;
}>;
