import type { Prisma } from "#generated/client";
import { classAnnouncementSelect } from "#selects/class-announcement.select";

export type ClassAnnouncementEntity = Prisma.ClassAnnouncementGetPayload<{
	select: typeof classAnnouncementSelect;
}>;

export type ClassAnnouncementListEntity = ClassAnnouncementEntity[];
