import type { PrismaClient } from "#generated/client";
import { filesSelect } from "#selects/files.select";
import {
  type CreateFileInput,
  FilesRepository,
  type UpdateFileInput,
} from "./files.repository";

describe("FilesRepository", () => {
  let repository: FilesRepository;
  let mockPrisma: {
    files: {
      create: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
  };

  const mockFileEntity = {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    originalName: "document.pdf",
    fileName: "document_1234567890.pdf",
    filePath: "/uploads/documents/document_1234567890.pdf",
    fileExtension: ".pdf",
    mimeType: "application/pdf",
    fileSize: BigInt(1048576),
    uploadedBy: "b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e",
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    deletedAt: null,
  };

  beforeEach(() => {
    mockPrisma = {
      files: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };
    repository = new FilesRepository(
      mockPrisma as unknown as PrismaClient,
    );
  });

  describe("create", () => {
    it("should create a file record successfully with all fields", async () => {
      mockPrisma.files.create.mockResolvedValue(mockFileEntity);

      const input: CreateFileInput = {
        originalName: "document.pdf",
        fileName: "document_1234567890.pdf",
        filePath: "/uploads/documents/document_1234567890.pdf",
        fileExtension: ".pdf",
        mimeType: "application/pdf",
        fileSize: 1048576,
        uploadedBy: "b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e",
      };

      const result = await repository.create(input);

      expect(mockPrisma.files.create).toHaveBeenCalledWith({
        data: {
          originalName: input.originalName,
          fileName: input.fileName,
          filePath: input.filePath,
          fileExtension: input.fileExtension,
          mimeType: input.mimeType,
          fileSize: BigInt(1048576),
          uploadedBy: input.uploadedBy,
        },
        select: filesSelect,
      });
      expect(result).toEqual(mockFileEntity);
    });

    it("should create a file record with BigInt fileSize directly", async () => {
      mockPrisma.files.create.mockResolvedValue(mockFileEntity);

      const input: CreateFileInput = {
        originalName: "document.pdf",
        fileName: "document_1234567890.pdf",
        filePath: "/uploads/documents/document_1234567890.pdf",
        fileSize: BigInt(1048576),
      };

      const result = await repository.create(input);

      expect(mockPrisma.files.create).toHaveBeenCalledWith({
        data: {
          originalName: input.originalName,
          fileName: input.fileName,
          filePath: input.filePath,
          fileExtension: null,
          mimeType: null,
          fileSize: BigInt(1048576),
          uploadedBy: null,
        },
        select: filesSelect,
      });
      expect(result).toEqual(mockFileEntity);
    });

    it("should create a file record with optional fields as null/undefined", async () => {
      const minimalFileEntity = {
        ...mockFileEntity,
        fileExtension: null,
        mimeType: null,
        fileSize: null,
        uploadedBy: null,
      };
      mockPrisma.files.create.mockResolvedValue(minimalFileEntity);

      const input: CreateFileInput = {
        originalName: "image.png",
        fileName: "image_123.png",
        filePath: "/uploads/image_123.png",
      };

      const result = await repository.create(input);

      expect(mockPrisma.files.create).toHaveBeenCalledWith({
        data: {
          originalName: "image.png",
          fileName: "image_123.png",
          filePath: "/uploads/image_123.png",
          fileExtension: null,
          mimeType: null,
          fileSize: null,
          uploadedBy: null,
        },
        select: filesSelect,
      });
      expect(result).toEqual(minimalFileEntity);
    });
  });

  describe("findById", () => {
    it("should find an active file by id", async () => {
      mockPrisma.files.findFirst.mockResolvedValue(mockFileEntity);

      const result = await repository.findById(mockFileEntity.id);

      expect(mockPrisma.files.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockFileEntity.id,
          deletedAt: null,
        },
        select: filesSelect,
      });
      expect(result).toEqual(mockFileEntity);
    });

    it("should return null if file is not found or soft-deleted", async () => {
      mockPrisma.files.findFirst.mockResolvedValue(null);

      const result = await repository.findById("non-existent-id");

      expect(mockPrisma.files.findFirst).toHaveBeenCalledWith({
        where: {
          id: "non-existent-id",
          deletedAt: null,
        },
        select: filesSelect,
      });
      expect(result).toBeNull();
    });
  });

  describe("findByFileName", () => {
    it("should find an active file by fileName", async () => {
      mockPrisma.files.findFirst.mockResolvedValue(mockFileEntity);

      const result = await repository.findByFileName(mockFileEntity.fileName);

      expect(mockPrisma.files.findFirst).toHaveBeenCalledWith({
        where: {
          fileName: mockFileEntity.fileName,
          deletedAt: null,
        },
        select: filesSelect,
      });
      expect(result).toEqual(mockFileEntity);
    });

    it("should return null if file by fileName is not found", async () => {
      mockPrisma.files.findFirst.mockResolvedValue(null);

      const result = await repository.findByFileName("unknown_file.pdf");

      expect(mockPrisma.files.findFirst).toHaveBeenCalledWith({
        where: {
          fileName: "unknown_file.pdf",
          deletedAt: null,
        },
        select: filesSelect,
      });
      expect(result).toBeNull();
    });
  });

  describe("findByUploadedBy", () => {
    it("should return files uploaded by a specific user", async () => {
      mockPrisma.files.findMany.mockResolvedValue([mockFileEntity]);

      const result = await repository.findByUploadedBy(
        mockFileEntity.uploadedBy as string,
      );

      expect(mockPrisma.files.findMany).toHaveBeenCalledWith({
        where: {
          uploadedBy: mockFileEntity.uploadedBy,
          deletedAt: null,
        },
        select: filesSelect,
      });
      expect(result).toEqual([mockFileEntity]);
    });

    it("should return empty array if no files found for the user", async () => {
      mockPrisma.files.findMany.mockResolvedValue([]);

      const result = await repository.findByUploadedBy("other-user-id");

      expect(mockPrisma.files.findMany).toHaveBeenCalledWith({
        where: {
          uploadedBy: "other-user-id",
          deletedAt: null,
        },
        select: filesSelect,
      });
      expect(result).toEqual([]);
    });
  });

  describe("findAll", () => {
    it("should return all active files", async () => {
      mockPrisma.files.findMany.mockResolvedValue([mockFileEntity]);

      const result = await repository.findAll();

      expect(mockPrisma.files.findMany).toHaveBeenCalledWith({
        where: {
          deletedAt: null,
        },
        select: filesSelect,
      });
      expect(result).toEqual([mockFileEntity]);
    });

    it("should return empty array if no files exist", async () => {
      mockPrisma.files.findMany.mockResolvedValue([]);

      const result = await repository.findAll();

      expect(result).toEqual([]);
    });
  });

  describe("update", () => {
    it("should update file properties selectively", async () => {
      const updatedEntity = {
        ...mockFileEntity,
        originalName: "renamed_document.pdf",
      };
      mockPrisma.files.update.mockResolvedValue(updatedEntity);

      const updateData: UpdateFileInput = {
        originalName: "renamed_document.pdf",
      };

      const result = await repository.update(mockFileEntity.id, updateData);

      expect(mockPrisma.files.update).toHaveBeenCalledWith({
        where: {
          id: mockFileEntity.id,
        },
        data: {
          originalName: "renamed_document.pdf",
        },
        select: filesSelect,
      });
      expect(result).toEqual(updatedEntity);
    });

    it("should update all fields when provided with number fileSize", async () => {
      const input: UpdateFileInput = {
        originalName: "new_name.pdf",
        fileName: "new_file_name.pdf",
        filePath: "/new/path.pdf",
        fileExtension: ".pdf",
        mimeType: "application/pdf",
        fileSize: 2048,
        uploadedBy: "new-user-id",
      };

      mockPrisma.files.update.mockResolvedValue(mockFileEntity);

      await repository.update(mockFileEntity.id, input);

      expect(mockPrisma.files.update).toHaveBeenCalledWith({
        where: {
          id: mockFileEntity.id,
        },
        data: {
          originalName: "new_name.pdf",
          fileName: "new_file_name.pdf",
          filePath: "/new/path.pdf",
          fileExtension: ".pdf",
          mimeType: "application/pdf",
          fileSize: BigInt(2048),
          uploadedBy: "new-user-id",
        },
        select: filesSelect,
      });
    });

    it("should handle null fileSize in update", async () => {
      const input: UpdateFileInput = {
        fileSize: null,
      };

      mockPrisma.files.update.mockResolvedValue(mockFileEntity);

      await repository.update(mockFileEntity.id, input);

      expect(mockPrisma.files.update).toHaveBeenCalledWith({
        where: {
          id: mockFileEntity.id,
        },
        data: {
          fileSize: null,
        },
        select: filesSelect,
      });
    });
  });

  describe("delete", () => {
    it("should soft delete a file by setting deletedAt", async () => {
      const deletedEntity = {
        ...mockFileEntity,
        deletedAt: new Date("2026-08-27T00:00:00.000Z"),
      };
      mockPrisma.files.update.mockResolvedValue(deletedEntity);

      const result = await repository.delete(mockFileEntity.id);

      expect(mockPrisma.files.update).toHaveBeenCalledWith({
        where: {
          id: mockFileEntity.id,
        },
        data: {
          deletedAt: expect.any(Date),
        },
        select: filesSelect,
      });
      expect(result.deletedAt).toBeDefined();
    });
  });
});
