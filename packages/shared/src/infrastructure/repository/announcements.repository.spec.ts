import type { PrismaClient } from "#generated/client";
import { announcementSelect } from "#selects/announcements.select";
import {
  AnnouncementsRepository,
  type CreateAnnouncementInput,
  type UpdateAnnouncementInput,
} from "./announcements.repository";

describe("AnnouncementsRepository", () => {
  let repository: AnnouncementsRepository;
  let mockPrisma: {
    announcements: {
      create: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
  };

  const mockAnnouncementEntity = {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    created_by: "b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e",
    updated_by: null,
    deleted_by: null,
    created_at: new Date("2026-01-01T00:00:00.000Z"),
    updated_at: new Date("2026-01-01T00:00:00.000Z"),
    deleted_at: null,
    institution_id: "c1d2e3f4-a5b6-7c8d-9e0f-1a2b3c4d5e6f",
    title: "School Holiday Announcement",
    content: "Classes will be dismissed next Monday.",
    is_published: true,
    published_at: new Date("2026-01-01T00:00:00.000Z"),
    expired_at: new Date("2026-01-10T00:00:00.000Z"),
  };

  beforeEach(() => {
    mockPrisma = {
      announcements: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };
    repository = new AnnouncementsRepository(
      mockPrisma as unknown as PrismaClient,
    );
  });

  describe("create", () => {
    it("should create an announcement successfully with all fields", async () => {
      mockPrisma.announcements.create.mockResolvedValue(mockAnnouncementEntity);

      const input: CreateAnnouncementInput = {
        institution_id: mockAnnouncementEntity.institution_id,
        title: mockAnnouncementEntity.title,
        content: mockAnnouncementEntity.content,
        is_published: true,
        published_at: mockAnnouncementEntity.published_at,
        expired_at: mockAnnouncementEntity.expired_at,
        created_by: mockAnnouncementEntity.created_by,
      };

      const result = await repository.create(input);

      expect(mockPrisma.announcements.create).toHaveBeenCalledWith({
        data: {
          institution_id: input.institution_id,
          title: input.title,
          content: input.content,
          is_published: input.is_published,
          published_at: input.published_at,
          expired_at: input.expired_at,
          created_by: input.created_by,
        },
        select: announcementSelect,
      });
      expect(result).toEqual(mockAnnouncementEntity);
    });

    it("should create an announcement with default/optional fields as null or false", async () => {
      const minimalEntity = {
        ...mockAnnouncementEntity,
        content: null,
        is_published: false,
        published_at: null,
        expired_at: null,
        created_by: null,
      };
      mockPrisma.announcements.create.mockResolvedValue(minimalEntity);

      const input: CreateAnnouncementInput = {
        institution_id: mockAnnouncementEntity.institution_id,
        title: "Simple Title",
      };

      const result = await repository.create(input);

      expect(mockPrisma.announcements.create).toHaveBeenCalledWith({
        data: {
          institution_id: input.institution_id,
          title: input.title,
          content: null,
          is_published: false,
          published_at: null,
          expired_at: null,
          created_by: null,
        },
        select: announcementSelect,
      });
      expect(result).toEqual(minimalEntity);
    });
  });

  describe("findById", () => {
    it("should find an active announcement by id", async () => {
      mockPrisma.announcements.findFirst.mockResolvedValue(
        mockAnnouncementEntity,
      );

      const result = await repository.findById(mockAnnouncementEntity.id);

      expect(mockPrisma.announcements.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockAnnouncementEntity.id,
          deleted_at: null,
        },
        select: announcementSelect,
      });
      expect(result).toEqual(mockAnnouncementEntity);
    });

    it("should return null if announcement not found or soft deleted", async () => {
      mockPrisma.announcements.findFirst.mockResolvedValue(null);

      const result = await repository.findById("non-existent-id");

      expect(mockPrisma.announcements.findFirst).toHaveBeenCalledWith({
        where: {
          id: "non-existent-id",
          deleted_at: null,
        },
        select: announcementSelect,
      });
      expect(result).toBeNull();
    });
  });

  describe("findByInstitutionId", () => {
    it("should find announcements for a specific institution", async () => {
      mockPrisma.announcements.findMany.mockResolvedValue([
        mockAnnouncementEntity,
      ]);

      const result = await repository.findByInstitutionId(
        mockAnnouncementEntity.institution_id,
      );

      expect(mockPrisma.announcements.findMany).toHaveBeenCalledWith({
        where: {
          institution_id: mockAnnouncementEntity.institution_id,
          deleted_at: null,
        },
        select: announcementSelect,
      });
      expect(result).toEqual([mockAnnouncementEntity]);
    });

    it("should return empty array if no announcements found", async () => {
      mockPrisma.announcements.findMany.mockResolvedValue([]);

      const result = await repository.findByInstitutionId("other-id");

      expect(result).toEqual([]);
    });
  });

  describe("findPublished", () => {
    it("should find published announcements without institutionId filter", async () => {
      mockPrisma.announcements.findMany.mockResolvedValue([
        mockAnnouncementEntity,
      ]);

      const result = await repository.findPublished();

      expect(mockPrisma.announcements.findMany).toHaveBeenCalledWith({
        where: {
          is_published: true,
          deleted_at: null,
        },
        select: announcementSelect,
      });
      expect(result).toEqual([mockAnnouncementEntity]);
    });

    it("should find published announcements with institutionId filter", async () => {
      mockPrisma.announcements.findMany.mockResolvedValue([
        mockAnnouncementEntity,
      ]);

      const result = await repository.findPublished(
        mockAnnouncementEntity.institution_id,
      );

      expect(mockPrisma.announcements.findMany).toHaveBeenCalledWith({
        where: {
          is_published: true,
          institution_id: mockAnnouncementEntity.institution_id,
          deleted_at: null,
        },
        select: announcementSelect,
      });
      expect(result).toEqual([mockAnnouncementEntity]);
    });
  });

  describe("findAll", () => {
    it("should find all active announcements", async () => {
      mockPrisma.announcements.findMany.mockResolvedValue([
        mockAnnouncementEntity,
      ]);

      const result = await repository.findAll();

      expect(mockPrisma.announcements.findMany).toHaveBeenCalledWith({
        where: {
          deleted_at: null,
        },
        select: announcementSelect,
      });
      expect(result).toEqual([mockAnnouncementEntity]);
    });
  });

  describe("update", () => {
    it("should update announcement fields selectively", async () => {
      const updatedEntity = {
        ...mockAnnouncementEntity,
        title: "Updated Title",
        is_published: false,
      };
      mockPrisma.announcements.update.mockResolvedValue(updatedEntity);

      const updateData: UpdateAnnouncementInput = {
        title: "Updated Title",
        is_published: false,
      };

      const result = await repository.update(
        mockAnnouncementEntity.id,
        updateData,
      );

      expect(mockPrisma.announcements.update).toHaveBeenCalledWith({
        where: {
          id: mockAnnouncementEntity.id,
        },
        data: {
          title: "Updated Title",
          is_published: false,
        },
        select: announcementSelect,
      });
      expect(result).toEqual(updatedEntity);
    });

    it("should update all fields when provided", async () => {
      const input: UpdateAnnouncementInput = {
        institution_id: "new-inst-id",
        title: "New Title",
        content: "New Content",
        is_published: true,
        published_at: new Date("2026-02-01T00:00:00.000Z"),
        expired_at: new Date("2026-02-10T00:00:00.000Z"),
        updated_by: "new-user-id",
      };

      mockPrisma.announcements.update.mockResolvedValue(mockAnnouncementEntity);

      await repository.update(mockAnnouncementEntity.id, input);

      expect(mockPrisma.announcements.update).toHaveBeenCalledWith({
        where: {
          id: mockAnnouncementEntity.id,
        },
        data: {
          institution_id: input.institution_id,
          title: input.title,
          content: input.content,
          is_published: input.is_published,
          published_at: input.published_at,
          expired_at: input.expired_at,
          updated_by: input.updated_by,
        },
        select: announcementSelect,
      });
    });
  });

  describe("delete", () => {
    it("should soft delete an announcement by setting deleted_at", async () => {
      const deletedEntity = {
        ...mockAnnouncementEntity,
        deleted_at: new Date(),
      };
      mockPrisma.announcements.update.mockResolvedValue(deletedEntity);

      const result = await repository.delete(mockAnnouncementEntity.id);

      expect(mockPrisma.announcements.update).toHaveBeenCalledWith({
        where: {
          id: mockAnnouncementEntity.id,
        },
        data: {
          deleted_at: expect.any(Date),
        },
        select: announcementSelect,
      });
      expect(result.deleted_at).toBeDefined();
    });

    it("should soft delete with deleted_by when specified", async () => {
      const deleted_by = "admin-user-id";
      const deletedEntity = {
        ...mockAnnouncementEntity,
        deleted_at: new Date(),
        deleted_by,
      };
      mockPrisma.announcements.update.mockResolvedValue(deletedEntity);

      const result = await repository.delete(
        mockAnnouncementEntity.id,
        deleted_by,
      );

      expect(mockPrisma.announcements.update).toHaveBeenCalledWith({
        where: {
          id: mockAnnouncementEntity.id,
        },
        data: {
          deleted_at: expect.any(Date),
          deleted_by,
        },
        select: announcementSelect,
      });
      expect(result.deleted_by).toEqual(deleted_by);
    });
  });
});
