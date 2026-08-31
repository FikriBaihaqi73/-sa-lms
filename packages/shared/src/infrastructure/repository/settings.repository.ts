import { PrismaClient } from "#generated/client";
import { type SettingsEntity, settingsSelect } from "#selects/settings.select";

export class SettingsRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany(): Promise<SettingsEntity[]> {
    return this.prisma.settings.findMany({
      select: settingsSelect,
    });
  }
}
