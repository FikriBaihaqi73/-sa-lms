import type { PrismaClient} from "#generated/client";
import { userSelect, type UserEntity } from "#selects/user.select";

export interface CreateUserInput {
  username: string;
  password_hash: string;
  role_id: string;
}

export interface UpdateUserInput {
  username?: string;
  password_hash?: string;
  role_id?: string;
  is_active?: boolean;
}

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  async create(data: CreateUserInput): Promise<UserEntity> {
    return this.prisma.users.create({
      data: {
        username: data.username,
        password: data.password_hash,
        role_id: data.role_id,
      },
      select: userSelect,
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.prisma.users.findUnique({
      where: { id },
      select: userSelect,
    });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.prisma.users.findUnique({
      where: { username },
      select: userSelect,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.prisma.users.findMany({
      where: { deleted_at: null },
      select: userSelect,
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<UserEntity> {
    const updateData: any = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.password_hash !== undefined) updateData.password = data.password_hash;
    if (data.role_id !== undefined) updateData.role_id = data.role_id;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    return this.prisma.users.update({
      where: { id },
      data: updateData,
      select: userSelect,
    });
  }

  async delete(id: string): Promise<UserEntity> {
    return this.prisma.users.update({
      where: { id },
      data: { deleted_at: new Date() },
      select: userSelect,
    });
  }
}
