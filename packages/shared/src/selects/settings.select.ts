import type { Prisma } from "#generated/client";

import { userSelect } from "./user.select.js";

export const settingsSelect = {
  id: true,
  updatedBy: true,
  updatedAt: true,
  createdAt: true,
  deletedAt: true,
  settingKey: true,
  settingValue: true,
  description: true,
  updater: {
    select: userSelect,
  },
} satisfies Prisma.SettingsSelect;

export type SettingsSelectType = typeof settingsSelect;

export type SettingsEntity = Prisma.SettingsGetPayload<{
  select: SettingsSelectType;
}>;
