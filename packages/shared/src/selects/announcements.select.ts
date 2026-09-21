import type { Prisma } from "#generated/client";

const announcementInstitutionSelect = {
  id: true,
  name: true,
  shortName: true,
  city: true,
  province: true,
} satisfies Prisma.InstitutionSelect;

const announcementUserSelect = {
  id: true,
  email: true,
  is_active: true,
  last_login: true,
  profile: {
    select: {
      id: true,
      fullName: true,
      institutionId: true,
      roleId: true,
    },
  },
} satisfies Prisma.UsersSelect;

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
  institution: {
    select: announcementInstitutionSelect,
  },
  creator: {
    select: announcementUserSelect,
  },
  updater: {
    select: announcementUserSelect,
  },
  deleter: {
    select: announcementUserSelect,
  },
} satisfies Prisma.AnnouncementsSelect;

export type AnnouncementSelectType = typeof announcementSelect;

export type AnnouncementEntity = Prisma.AnnouncementsGetPayload<{
  select: AnnouncementSelectType;
}>;

export const announcementsSelect = announcementSelect;
export type AnnouncementsSelectType = AnnouncementSelectType;
export type AnnouncementsEntity = AnnouncementEntity;
