import type { Prisma } from "#generated/client";

import { fileSelect } from "#selects/files.select";

export type FileEntity = Prisma.FilesGetPayload<{
  select: typeof fileSelect;
}>;

export type FileListEntity = FileEntity[];