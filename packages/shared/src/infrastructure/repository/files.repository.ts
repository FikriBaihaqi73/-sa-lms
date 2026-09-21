import type { Prisma, PrismaClient } from "#generated/client";
import { type FilesEntity, filesSelect } from "#selects/files.select";

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

export interface FileSearchInput {
  search?: string | undefined;
}

export interface FilePaginationResult {
  data: FilesEntity[];
  meta: {
    totalData: number;
    totalPages: number;
    currentPage: number;
    perPage: number;
  };
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

  async findAll(
    page = 1,
    limit = 10,
    filters?: FileSearchInput,
  ): Promise<FilePaginationResult> {
    const currentPage = Math.max(Math.floor(page || 1), 1);
    const perPage = Math.min(Math.max(Math.floor(limit || 10), 1), 100);
    const search = filters?.search?.trim();
    const where: Prisma.FilesWhereInput = {
      deletedAt: null,
      ...(search
        ? {
            OR: [
              { originalName: { contains: search, mode: "insensitive" } },
              { fileName: { contains: search, mode: "insensitive" } },
              { fileExtension: { contains: search, mode: "insensitive" } },
              { mimeType: { contains: search, mode: "insensitive" } },
              {
                uploader: {
                  email: { contains: search, mode: "insensitive" },
                },
              },
            ],
          }
        : {}),
    };

    const [data, totalData] = await Promise.all([
      this.prisma.files.findMany({
        where,
        skip: (currentPage - 1) * perPage,
        take: perPage,
        select: filesSelect,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.files.count({ where }),
    ]);

    return {
      data,
      meta: {
        totalData,
        totalPages: Math.ceil(totalData / perPage),
        currentPage,
        perPage,
      },
    };
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
