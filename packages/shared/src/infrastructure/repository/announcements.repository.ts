import type { PrismaClient } from "#generated/client";
import {
  type AnnouncementEntity,
  announcementSelect,
} from "#selects/announcements.select";

export interface CreateAnnouncementInput {
  institution_id: string;
  title: string;
  content?: string | null;
  is_published?: boolean;
  published_at?: Date | null;
  expired_at?: Date | null;
  created_by?: string | null;
}

export interface UpdateAnnouncementInput {
  institution_id?: string;
  title?: string;
  content?: string | null;
  is_published?: boolean;
  published_at?: Date | null;
  expired_at?: Date | null;
  updated_by?: string | null;
}

export class AnnouncementsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateAnnouncementInput): Promise<AnnouncementEntity> {
    return this.prisma.announcements.create({
      data: {
        institution_id: data.institution_id,
        title: data.title,
        content: data.content ?? null,
        is_published: data.is_published ?? false,
        published_at: data.published_at ?? null,
        expired_at: data.expired_at ?? null,
        created_by: data.created_by ?? null,
      },
      select: announcementSelect,
    });
  }

  async findById(id: string): Promise<AnnouncementEntity | null> {
    return this.prisma.announcements.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: announcementSelect,
    });
  }

  async findByInstitutionId(
    institution_id: string,
  ): Promise<AnnouncementEntity[]> {
    return this.prisma.announcements.findMany({
      where: {
        institution_id,
        deleted_at: null,
      },
      select: announcementSelect,
    });
  }

  async findPublished(
    institution_id?: string,
  ): Promise<AnnouncementEntity[]> {
    return this.prisma.announcements.findMany({
      where: {
        is_published: true,
        ...(institution_id !== undefined && { institution_id }),
        deleted_at: null,
      },
      select: announcementSelect,
    });
  }

  async findAll(): Promise<AnnouncementEntity[]> {
    return this.prisma.announcements.findMany({
      where: {
        deleted_at: null,
      },
      select: announcementSelect,
    });
  }

  async update(
    id: string,
    data: UpdateAnnouncementInput,
  ): Promise<AnnouncementEntity> {
    return this.prisma.announcements.update({
      where: {
        id,
      },
      data: {
        ...(data.institution_id !== undefined && {
          institution_id: data.institution_id,
        }),
        ...(data.title !== undefined && {
          title: data.title,
        }),
        ...(data.content !== undefined && {
          content: data.content,
        }),
        ...(data.is_published !== undefined && {
          is_published: data.is_published,
        }),
        ...(data.published_at !== undefined && {
          published_at: data.published_at,
        }),
        ...(data.expired_at !== undefined && {
          expired_at: data.expired_at,
        }),
        ...(data.updated_by !== undefined && {
          updated_by: data.updated_by,
        }),
      },
      select: announcementSelect,
    });
  }

  async delete(
    id: string,
    deleted_by?: string,
  ): Promise<AnnouncementEntity> {
    return this.prisma.announcements.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
        ...(deleted_by !== undefined && {
          deleted_by,
        }),
      },
      select: announcementSelect,
    });
  }
}

export const AnnouncementRepository = AnnouncementsRepository;
