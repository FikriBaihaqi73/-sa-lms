import type { Prisma } from "#generated/client";

export const filesSelect = {
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
  originalName: true,
  fileName: true,
  filePath: true,
  fileExtension: true,
  mimeType: true,
  fileSize: true,
  uploadedBy: true,
} satisfies Prisma.FilesSelect;

export type FilesSelectType = typeof filesSelect;

export type FilesEntity = Prisma.FilesGetPayload<{
  select: FilesSelectType;
}>;

export const fileSelect = filesSelect;
export type FileSelectType = FilesSelectType;
export type FileEntity = FilesEntity;
