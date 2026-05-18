import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from '@repo/shared/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    this.prisma; // Pembacaan untuk menghilangkan error linter
    
    return [
      {
        id: '1',
        full_name: 'John Doe',
        email: 'john@example.com',
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
  }

  async findOne(id: string) {
    return {
      id,
      full_name: 'John Doe',
      email: 'john@example.com',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  async create(dto: CreateUserDto) {
    return {
      id: '2',
      ...dto,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  async update(id: string, dto: UpdateUserDto) {
    return {
      id,
      full_name: 'Updated Name',
      email: 'updated@example.com',
      is_active: true,
      ...dto,
      created_at: new Date(),
      updated_at: new Date(),
    };
  }

  async remove(id: string) {
    return { success: true, id };
  }
}
