import { Injectable, NotFoundException } from "@nestjs/common";
import { SettingsRepository } from "@repo/shared/infrastructure/repository/settings.repository";
import type {
  CreateSettingDto,
  UpdateSettingDto,
} from "@repo/shared/schemas/setting.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class SettingsService {
  private repository: SettingsRepository;

  constructor(private readonly prisma: PrismaService) {
    this.repository = new SettingsRepository(this.prisma.client);
  }

  async create(dto: CreateSettingDto) {
    return this.repository.create({
      settingKey: dto.settingKey,
      ...(dto.settingValue !== undefined
        ? { settingValue: dto.settingValue }
        : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
      ...(dto.updatedBy !== undefined ? { updatedBy: dto.updatedBy } : {}),
    });
  }

  async findAll(page: number, limit: number, filters?: { search?: string }) {
    return this.repository.findAll(page, limit, filters);
  }

  async findOne(id: string) {
    const result = await this.repository.findById(id);
    if (!result) {
      throw new NotFoundException(`Setting with ID ${id} not found`);
    }
    return result;
  }

  async update(id: string, dto: UpdateSettingDto) {
    await this.findOne(id); // Ensure exists
    return this.repository.update(id, {
      ...(dto.settingKey !== undefined ? { settingKey: dto.settingKey } : {}),
      ...(dto.settingValue !== undefined
        ? { settingValue: dto.settingValue }
        : {}),
      ...(dto.description !== undefined
        ? { description: dto.description }
        : {}),
      ...(dto.updatedBy !== undefined ? { updatedBy: dto.updatedBy } : {}),
    });
  }

  async remove(id: string) {
    await this.findOne(id); // Ensure exists
    await this.repository.delete(id);
    return { success: true, id };
  }
}
