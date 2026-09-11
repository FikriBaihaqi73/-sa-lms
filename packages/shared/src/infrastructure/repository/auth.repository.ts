import type { PrismaClient } from "#generated/client";
import { type RoleEntity, roleSelect } from "#selects/role.select";
import {
  type UserEntity,
  type UserWithPasswordEntity,
  userSelect,
  userWithPasswordSelect,
} from "#selects/user.select";

export interface CreateAuthenticatedUserInput {
  role_id: string;
  username: string;
  email: string;
  password: string;
}

export class AuthRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findUserByUsername(username: string): Promise<UserEntity | null> {
    return this.prisma.users.findFirst({
      where: { username, deleted_at: null },
      select: userSelect,
    });
  }

  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return this.prisma.users.findFirst({
      where: { email, deleted_at: null },
      select: userSelect,
    });
  }

  async findDefaultRole(name: string): Promise<RoleEntity | null> {
    return this.prisma.role.findFirst({
      where: { name, deletedAt: null },
      select: roleSelect,
    });
  }

  async upsertDefaultRole(name: string): Promise<RoleEntity> {
    return this.prisma.role.upsert({
      where: { name },
      update: { deletedAt: null },
      create: {
        name,
        description: "Default role for self-service registration",
      },
      select: roleSelect,
    });
  }

  async createUser(data: CreateAuthenticatedUserInput): Promise<UserEntity> {
    return this.prisma.users.create({
      data: { ...data, is_active: true },
      select: userSelect,
    });
  }

  async findLoginUser(email: string): Promise<UserWithPasswordEntity | null> {
    return this.prisma.users.findFirst({
      where: { email, deleted_at: null },
      select: userWithPasswordSelect,
    });
  }

  async updateLastLogin(id: string): Promise<UserEntity> {
    return this.prisma.users.update({
      where: { id },
      data: { last_login: new Date() },
      select: userSelect,
    });
  }

  async updateAccessToken(
    id: string,
    accessToken: string,
  ): Promise<UserEntity> {
    return this.prisma.users.update({
      where: { id },
      data: { access_token: accessToken },
      select: userSelect,
    });
  }

  async clearAccessToken(id: string): Promise<UserEntity> {
    return this.prisma.users.update({
      where: { id },
      data: { access_token: null },
      select: userSelect,
    });
  }
}
