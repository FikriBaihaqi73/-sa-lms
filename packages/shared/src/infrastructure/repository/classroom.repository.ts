import type { PrismaClient } from '#generated/client';
import {
  classroomSelect,
  type ClassroomEntity,
} from '#selects/classroom.select';

export class ClassroomRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<ClassroomEntity[]> {
    return this.prisma.classroom.findMany({
      where: {
        deletedAt: null,
      },
      select: classroomSelect,
      orderBy: {
        roomName: 'asc',
      },
    });
  }

  async findById(id: string): Promise<ClassroomEntity | null> {
    return this.prisma.classroom.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: classroomSelect,
    });
  }
}