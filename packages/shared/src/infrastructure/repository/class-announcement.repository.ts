import type { Prisma, PrismaClient } from "#generated/client";
import {
  type ClassAnnouncementEntity,
  classAnnouncementSelect,
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

  async findById(id: string): Promise<ClassAnnouncementEntity | null> {
    return this.prisma.classAnnouncement.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: classAnnouncementSelect,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    search?: string;
  }): Promise<{ data: ClassAnnouncementEntity[]; meta: { total: number } }> {
    const { skip, take, search } = params;

    const whereInput: Prisma.ClassAnnouncementWhereInput = {
      deletedAt: null,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.classAnnouncement.findMany({
        where: whereInput,
        ...(skip !== undefined && { skip }),
        ...(take !== undefined && { take }),
        orderBy: {
          createdAt: "desc",
        },
        select: classAnnouncementSelect,
      }),
      this.prisma.classAnnouncement.count({
        where: whereInput,
      }),
    ]);

    return {
      data,
      meta: {
        total,
      },
    };
  }

  async findByClassId(classId: string): Promise<ClassAnnouncementEntity[]> {
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
