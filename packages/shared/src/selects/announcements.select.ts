import type { Prisma } from "#generated/client";

export const announcementSelect = {
  id: true,
  created_by: true,
  updated_by: true,
  deleted_by: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
  institution_id: true,
  title: true,
  content: true,
  is_published: true,
  published_at: true,
  expired_at: true,
} satisfies Prisma.AnnouncementsSelect;

export type AnnouncementSelectType = typeof announcementSelect;

export type AnnouncementEntity = Prisma.AnnouncementsGetPayload<{
  select: AnnouncementSelectType;
}>;

export const announcementsSelect = announcementSelect;
export type AnnouncementsSelectType = AnnouncementSelectType;
export type AnnouncementsEntity = AnnouncementEntity;
