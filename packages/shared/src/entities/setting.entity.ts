import type { Prisma } from "#generated/client";

import { settingsSelect } from "#selects/settings.select";

export type SettingEntity = Prisma.SettingsGetPayload<{
  select: typeof settingsSelect;
}>;

export type SettingListEntity = SettingEntity[];