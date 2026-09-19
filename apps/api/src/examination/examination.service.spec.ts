import { Test, TestingModule } from "@nestjs/testing";
import { ExaminationService } from "./examination.service";
import { ExaminationRepository } from "@repo/shared/infrastructure/repository/examination.repository";
import { NotFoundException } from "@nestjs/common";

describe("ExaminationService", () => {
  let service: ExaminationService;
  let repository: jest.Mocked<ExaminationRepository>;

  beforeEach(async () => {
    const mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExaminationService,
        {
          provide: ExaminationRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<ExaminationService>(ExaminationService);
    repository = module.get(
      ExaminationRepository,
    ) as jest.Mocked<ExaminationRepository>;
  });

  describe("create", () => {
    it("should call repository.create with correct data", async () => {
      const dto = {
        title: "Test Exam",
        examinationDate: "2026-09-19T09:23:43.000Z",
      };
      const result: any = { id: "1", ...dto };
      repository.create.mockResolvedValue(result);

      expect(await service.create(dto)).toEqual(result);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Test Exam",
          examinationDate: new Date("2026-09-19T09:23:43.000Z"),
        }),
      );
    });
  });

  describe("findAll", () => {
    it("should return paginated results", async () => {
      const mockResult: any = {
        data: [{ id: "1" }],
        meta: { totalData: 1, totalPages: 1, currentPage: 1, perPage: 10 },
      };
      repository.findAll.mockResolvedValue(mockResult);

      expect(await service.findAll(1, 10, "search")).toEqual(mockResult);
      expect(repository.findAll).toHaveBeenCalledWith(1, 10, {
        search: "search",
      });
    });
  });

  describe("findById", () => {
    it("should return examination if found", async () => {
      const result: any = { id: "1" };
      repository.findById.mockResolvedValue(result);

      expect(await service.findById("1")).toEqual(result);
      expect(repository.findById).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundException if not found", async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.findById("1")).rejects.toThrow(NotFoundException);
    });
  });

  describe("update", () => {
    it("should update and return examination", async () => {
      const dto = { title: "Updated" };
      const existing: any = { id: "1" };
      const updated: any = { id: "1", title: "Updated" };

      repository.findById.mockResolvedValue(existing);
      repository.update.mockResolvedValue(updated);

      expect(await service.update("1", dto)).toEqual(updated);
      expect(repository.findById).toHaveBeenCalledWith("1");
      expect(repository.update).toHaveBeenCalledWith(
        "1",
        expect.objectContaining({ title: "Updated" }),
      );
    });
  });

  describe("softDelete", () => {
    it("should delete and return examination", async () => {
      const existing: any = { id: "1" };
      repository.findById.mockResolvedValue(existing);
      repository.softDelete.mockResolvedValue(existing);

      expect(await service.softDelete("1")).toEqual(existing);
      expect(repository.findById).toHaveBeenCalledWith("1");
      expect(repository.softDelete).toHaveBeenCalledWith("1");
    });
  });
});
