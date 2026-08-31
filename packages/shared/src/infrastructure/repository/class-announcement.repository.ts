import type { PrismaClient } from "#generated/client";
import {
  classAnnouncementSelect,
  type ClassAnnouncementEntity,
} from "#selects/class-announcement.select";

export interface CreateClassAnnouncementInput {
  classId: string;
  title: string;
  content?: string;
}

export interface UpdateClassAnnouncementInput {
  title?: string;
  content?: string;
}

export class ClassAnnouncementRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(
    data: CreateClassAnnouncementInput,
  ): Promise<ClassAnnouncementEntity> {
    return this.prisma.classAnnouncement.create({
      data: {
        classId: data.classId,
        title: data.title,

        ...(data.content !== undefined && {
          content: data.content,
        }),
      },
      select: classAnnouncementSelect,
    });
  }

  async findById(
    id: string,
  ): Promise<ClassAnnouncementEntity | null> {
    return this.prisma.classAnnouncement.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: classAnnouncementSelect,
    });
  }

  async findAll(): Promise<ClassAnnouncementEntity[]> {
    return this.prisma.classAnnouncement.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: classAnnouncementSelect,
    });
  }

  async findByClassId(
    classId: string,
  ): Promise<ClassAnnouncementEntity[]> {
    return this.prisma.classAnnouncement.findMany({
      where: {
        classId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: classAnnouncementSelect,
    });
  }

  async update(
    id: string,
    data: UpdateClassAnnouncementInput,
  ): Promise<ClassAnnouncementEntity> {
    return this.prisma.classAnnouncement.update({
      where: {
        id,
      },
      data: {
        ...(data.title !== undefined && {
          title: data.title,
        }),

        ...(data.content !== undefined && {
          content: data.content,
        }),
      },
      select: classAnnouncementSelect,
    });
  }

  async delete(id: string): Promise<ClassAnnouncementEntity> {
    return this.prisma.classAnnouncement.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: classAnnouncementSelect,
    });
  }
}
