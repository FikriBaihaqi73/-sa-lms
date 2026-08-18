import type { PrismaClient, Users } from "#generated/client";

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

  async create(data: CreateUserInput): Promise<Users> {
    return this.prisma.users.create({
      data: {
        username: data.username,
        password: data.password_hash,
        role_id: data.role_id,
      },
    });
  }

  async findById(id: string): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { id },
    });
  }

  async findByUsername(username: string): Promise<Users | null> {
    return this.prisma.users.findUnique({
      where: { username },
    });
  }

  async findAll(): Promise<Users[]> {
    return this.prisma.users.findMany({
      where: { deleted_at: null },
    });
  }

  async update(id: string, data: UpdateUserInput): Promise<Users> {
    const updateData: any = {};
    if (data.username !== undefined) updateData.username = data.username;
    if (data.password_hash !== undefined) updateData.password = data.password_hash;
    if (data.role_id !== undefined) updateData.role_id = data.role_id;
    if (data.is_active !== undefined) updateData.is_active = data.is_active;

    return this.prisma.users.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Users> {
    return this.prisma.users.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
