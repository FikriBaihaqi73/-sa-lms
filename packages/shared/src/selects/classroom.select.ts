import type { Prisma } from '#generated/client';

export const classroomSelect = {
  id: true,
  institutionId: true,
  roomCode: true,
  roomName: true,
  building: true,
  floor: true,
  capacity: true,
  description: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
} satisfies Prisma.ClassroomSelect;

export type ClassroomSelectType = typeof classroomSelect;

export type ClassroomEntity = Prisma.ClassroomGetPayload<{
  select: ClassroomSelectType;
}>;