import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { NotificationRepository } from "@repo/shared/infrastructure/repository/notification.repository";
import { NotificationService } from "./notification.service";

describe("NotificationService", () => {
  let service: NotificationService;
  let repository: jest.Mocked<NotificationRepository>;

  const mockRepository = {
    create: jest.fn(),
    findMany: jest.fn(),
    findById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: NotificationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    repository = module.get(NotificationRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return paginated data with meta", async () => {
      const mockData = [{ id: "1", title: "Test" }];
      const mockTotal = 1;
      repository.findMany.mockResolvedValue([mockData as any, mockTotal]);

      const query = { page: 1, limit: 10 };
      const result = await service.findAll(query);

      expect(repository.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        search: undefined,
      });
      expect(result).toEqual({
        data: mockData,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
    });
  });

  describe("findOne", () => {
    it("should throw NotFoundException if not found", async () => {
      repository.findById.mockResolvedValue(null);
      await expect(service.findOne("invalid-id")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should return the notification", async () => {
      const mockData = { id: "1", title: "Test" };
      repository.findById.mockResolvedValue(mockData as any);

      const result = await service.findOne("1");
      expect(result).toEqual(mockData);
    });
  });

  describe("create", () => {
    it("should call repository create", async () => {
      const mockDto = { userId: "uuid", title: "Test Title" };
      const mockResult = { id: "1", ...mockDto };
      repository.create.mockResolvedValue(mockResult as any);

      const result = await service.create(mockDto as any);
      expect(repository.create).toHaveBeenCalled();
      expect(result).toEqual(mockResult);
    });
  });

  describe("update", () => {
    it("should call repository update if found", async () => {
      const mockDto = { title: "Updated Title" };
      const mockData = { id: "1", title: "Test" };
      repository.findById.mockResolvedValue(mockData as any);
      repository.update.mockResolvedValue({ ...mockData, ...mockDto } as any);

      const result = await service.update("1", mockDto as any);
      expect(repository.update).toHaveBeenCalled();
      expect(result.title).toEqual("Updated Title");
    });
  });

  describe("remove", () => {
    it("should call repository delete if found", async () => {
      const mockData = { id: "1", title: "Test" };
      repository.findById.mockResolvedValue(mockData as any);
      repository.delete.mockResolvedValue(mockData as any);

      const result = await service.remove("1");
      expect(repository.delete).toHaveBeenCalledWith("1");
      expect(result).toEqual(mockData);
    });
  });
});
