import type { PrismaClient } from "#generated/client";
import {
  type FilesEntity,
  filesSelect,
} from "#selects/files.select";

export interface CreateFileInput {
  originalName: string;
  fileName: string;
  filePath: string;
  fileExtension?: string | null;
  mimeType?: string | null;
  fileSize?: bigint | number | null;
  uploadedBy?: string | null;
}

export interface UpdateFileInput {
  originalName?: string;
  fileName?: string;
  filePath?: string;
  fileExtension?: string | null;
  mimeType?: string | null;
  fileSize?: bigint | number | null;
  uploadedBy?: string | null;
}

export class FilesRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: CreateFileInput): Promise<FilesEntity> {
    return this.prisma.files.create({
      data: {
        originalName: data.originalName,
        fileName: data.fileName,
        filePath: data.filePath,
        fileExtension: data.fileExtension ?? null,
        mimeType: data.mimeType ?? null,
        fileSize:
          data.fileSize !== undefined && data.fileSize !== null
            ? typeof data.fileSize === "number"
              ? BigInt(data.fileSize)
              : data.fileSize
            : null,
        uploadedBy: data.uploadedBy ?? null,
      },
      select: filesSelect,
    });
  }

  async findById(id: string): Promise<FilesEntity | null> {
    return this.prisma.files.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      select: filesSelect,
    });
  }

  async findByFileName(fileName: string): Promise<FilesEntity | null> {
    return this.prisma.files.findFirst({
      where: {
        fileName,
        deletedAt: null,
      },
      select: filesSelect,
    });
  }

  async findByUploadedBy(uploadedBy: string): Promise<FilesEntity[]> {
    return this.prisma.files.findMany({
      where: {
        uploadedBy,
        deletedAt: null,
      },
      select: filesSelect,
    });
  }

  async findAll(): Promise<FilesEntity[]> {
    return this.prisma.files.findMany({
      where: {
        deletedAt: null,
      },
      select: filesSelect,
    });
  }

  async update(id: string, data: UpdateFileInput): Promise<FilesEntity> {
    return this.prisma.files.update({
      where: {
        id,
      },
      data: {
        ...(data.originalName !== undefined && {
          originalName: data.originalName,
        }),
        ...(data.fileName !== undefined && {
          fileName: data.fileName,
        }),
        ...(data.filePath !== undefined && {
          filePath: data.filePath,
        }),
        ...(data.fileExtension !== undefined && {
          fileExtension: data.fileExtension,
        }),
        ...(data.mimeType !== undefined && {
          mimeType: data.mimeType,
        }),
        ...(data.fileSize !== undefined && {
          fileSize:
            data.fileSize !== null
              ? typeof data.fileSize === "number"
                ? BigInt(data.fileSize)
                : data.fileSize
              : null,
        }),
        ...(data.uploadedBy !== undefined && {
          uploadedBy: data.uploadedBy,
        }),
      },
      select: filesSelect,
    });
  }

  async delete(id: string): Promise<FilesEntity> {
    return this.prisma.files.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
      select: filesSelect,
    });
  }
}

export const FileRepository = FilesRepository;
