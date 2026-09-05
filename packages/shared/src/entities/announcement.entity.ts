import type { Prisma } from "#generated/client";

import { announcementSelect } from "#selects/announcements.select";

export type AnnouncementEntity = Prisma.AnnouncementsGetPayload<{
  select: typeof announcementSelect;
}>;

export type AnnouncementListEntity = AnnouncementEntity[];