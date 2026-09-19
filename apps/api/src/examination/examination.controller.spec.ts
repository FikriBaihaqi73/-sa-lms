import { Test, TestingModule } from "@nestjs/testing";
import { ExaminationController } from "./examination.controller";
import { ExaminationService } from "./examination.service";

describe("ExaminationController", () => {
  let controller: ExaminationController;
  let service: jest.Mocked<ExaminationService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      softDelete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExaminationController],
      providers: [
        {
          provide: ExaminationService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ExaminationController>(ExaminationController);
    service = module.get(ExaminationService) as jest.Mocked<ExaminationService>;
  });

  describe("create", () => {
    it("should return a successful response with created examination", async () => {
      const dto = { title: "Test Exam" };
      const req = { user: { id: "user-1" } };
      const result: any = { id: "exam-1", ...dto, createdBy: "user-1" };
      service.create.mockResolvedValue(result);

      const response = await controller.create(req, dto);
      expect(response.status).toBe("success");
      expect(response.code).toBe(201);
      expect(response.data).toEqual(result);
      expect(service.create).toHaveBeenCalledWith({
        ...dto,
        createdBy: "user-1",
      });
    });
  });

  describe("findAll", () => {
    it("should return a successful response with paginated examinations", async () => {
      const result: any = {
        data: [{ id: "exam-1" }],
        meta: { totalData: 1, totalPages: 1, currentPage: 1, perPage: 10 },
      };
      service.findAll.mockResolvedValue(result);

      const response = await controller.findAll("1", "10", "search");
      expect(response.status).toBe("success");
      expect(response.data).toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, "search");
    });
  });

  describe("findById", () => {
    it("should return a successful response with the found examination", async () => {
      const result: any = { id: "exam-1" };
      service.findById.mockResolvedValue(result);

      const response = await controller.findById("exam-1");
      expect(response.status).toBe("success");
      expect(response.data).toEqual(result);
      expect(service.findById).toHaveBeenCalledWith("exam-1");
    });
  });

  describe("update", () => {
    it("should return a successful response with updated examination", async () => {
      const dto = { title: "Updated" };
      const req = { user: { id: "user-1" } };
      const result: any = { id: "exam-1", title: "Updated" };
      service.update.mockResolvedValue(result);

      const response = await controller.update(req, "exam-1", dto);
      expect(response.status).toBe("success");
      expect(response.data).toEqual(result);
      expect(service.update).toHaveBeenCalledWith("exam-1", {
        ...dto,
        updatedBy: "user-1",
      });
    });
  });

  describe("delete", () => {
    it("should return a successful response after deleting", async () => {
      const result: any = { id: "exam-1" };
      service.softDelete.mockResolvedValue(result);

      const response = await controller.delete("exam-1");
      expect(response.status).toBe("success");
      expect(response.data).toEqual(result);
      expect(service.softDelete).toHaveBeenCalledWith("exam-1");
    });
  });
});
