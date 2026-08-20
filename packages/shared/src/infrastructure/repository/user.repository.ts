import type { PrismaClient } from "#generated/client";
import {
  type UserEntity,
  type UserWithPasswordEntity,
  userSelect,
  userWithPasswordSelect,
} from "#selects/user.select";

export interface CreateUserInput {
  role_id: string;
  username: string;
  password: string;
  is_active?: boolean | undefined;
}

export interface UpdateUserInput {
  role_id?: string | undefined;
  username?: string | undefined;
  password?: string | undefined;
  is_active?: boolean | undefined;
  last_login?: Date | null | undefined;
}

export class UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateUserInput): Promise<UserEntity> {
    return this.prisma.users.create({
      data: {
        role_id: data.role_id,
        username: data.username,
        password: data.password,
        ...(data.is_active !== undefined && {
          is_active: data.is_active,
        }),
      },
      select: userSelect,
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.prisma.users.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      select: userSelect,
    });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.prisma.users.findFirst({
      where: {
        username,
        deleted_at: null,
      },
      select: userSelect,
    });
  }

  async findByRoleId(role_id: string): Promise<UserEntity[]> {
    return this.prisma.users.findMany({
      where: {
        role_id,
        deleted_at: null,
      },
      select: userSelect,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.prisma.users.findMany({
      where: {
        deleted_at: null,
      },
      select: userSelect,
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<UserEntity> {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        ...(data.role_id !== undefined && {
          role_id: data.role_id,
        }),
        ...(data.username !== undefined && {
          username: data.username,
        }),
        ...(data.password !== undefined && {
          password: data.password,
        }),
        ...(data.is_active !== undefined && {
          is_active: data.is_active,
        }),
        ...(data.last_login !== undefined && {
          last_login: data.last_login,
        }),
      },
      select: userSelect,
    });
  }

  async delete(id: string): Promise<UserEntity> {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        deleted_at: new Date(),
      },
      select: userSelect,
    });
  }

  async findByUsernameWithPassword(
    username: string,
  ): Promise<UserWithPasswordEntity | null> {
    return this.prisma.users.findFirst({
      where: {
        username,
        deleted_at: null,
      },
      select: userWithPasswordSelect,
    });
  }

  async updateLastLogin(id: string): Promise<UserEntity> {
    return this.prisma.users.update({
      where: {
        id,
      },
      data: {
        last_login: new Date(),
      },
      select: userSelect,
    });
  }
}
