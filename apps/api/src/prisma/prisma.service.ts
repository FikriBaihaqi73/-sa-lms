import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { getPrisma } from '@repo/shared/infrastructure/database/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma = getPrisma();

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }

  get client() {
    return this.prisma;
  }
}
