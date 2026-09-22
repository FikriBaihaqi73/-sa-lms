import { Injectable, NotFoundException } from "@nestjs/common";
import { FilesRepository } from "@repo/shared/infrastructure/repository/files.repository";
import type {
  CreateFileDto,
  UpdateFileDto,
} from "@repo/shared/schemas/file.schema";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class FilesService {
  private readonly filesRepository: FilesRepository;

  constructor(private readonly prisma: PrismaService) {
    this.filesRepository = new FilesRepository(this.prisma.client);
  }

  async findAll(page = 1, limit = 10, search?: string) {
    return this.filesRepository.findAll(page, limit, { search });
  }

  async findOne(id: string) {
    const file = await this.filesRepository.findById(id);
    if (!file) {
      throw new NotFoundException("File not found");
    }
    return file;
  }

  async create(dto: CreateFileDto) {
    return this.filesRepository.create({
      originalName: dto.original_name,
      fileName: dto.file_name,
      filePath: dto.file_path,
      ...(dto.file_extension !== undefined && {
        fileExtension: dto.file_extension,
      }),
      ...(dto.mime_type !== undefined && { mimeType: dto.mime_type }),
      ...(dto.file_size !== undefined && { fileSize: dto.file_size }),
      ...(dto.uploaded_by !== undefined && { uploadedBy: dto.uploaded_by }),
    });
  }

  async update(id: string, dto: UpdateFileDto) {
    await this.findOne(id);

    return this.filesRepository.update(id, {
      ...(dto.original_name !== undefined && {
        originalName: dto.original_name,
      }),
      ...(dto.file_name !== undefined && { fileName: dto.file_name }),
      ...(dto.file_path !== undefined && { filePath: dto.file_path }),
      ...(dto.file_extension !== undefined && {
        fileExtension: dto.file_extension,
      }),
      ...(dto.mime_type !== undefined && { mimeType: dto.mime_type }),
      ...(dto.file_size !== undefined && { fileSize: dto.file_size }),
      ...(dto.uploaded_by !== undefined && { uploadedBy: dto.uploaded_by }),
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.filesRepository.delete(id);
    return { success: true, id };
  }
}
