import { createZodDto } from "nestjs-zod/dto";

import { z } from "zod";

export const CreateClassroomSchema = z.object({
  institutionId: z.string().uuid().describe("Institution ID"),

  roomCode: z.string().min(1).max(255).describe("Classroom room code"),

  roomName: z.string().min(1).max(255).describe("Classroom room name"),

  building: z.string().max(255).optional().describe("Classroom building"),

  floor: z.number().int().optional().describe("Classroom floor"),

  capacity: z.number().int().optional().describe("Classroom capacity"),

  description: z.string().optional().describe("Classroom description"),
});

export const UpdateClassroomSchema = CreateClassroomSchema.partial();

export class CreateClassroomDto extends createZodDto(CreateClassroomSchema) {}

export class UpdateClassroomDto extends createZodDto(UpdateClassroomSchema) {}
