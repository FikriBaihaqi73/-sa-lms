import { Test, TestingModule } from "@nestjs/testing";
import { ResponseHelper } from "@repo/shared/http/response";
import { AssignmentTypesController } from "./assignment-types.controller";
import { AssignmentTypesService } from "./assignment-types.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("AssignmentTypesController", () => {
  let controller: AssignmentTypesController;
  let service: jest.Mocked<AssignmentTypesService>;

  beforeEach(async () => {
    const mockService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignmentTypesController],
      providers: [
        {
          provide: AssignmentTypesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<AssignmentTypesController>(
      AssignmentTypesController,
    );
    service = module.get(
      AssignmentTypesService,
    ) as jest.Mocked<AssignmentTypesService>;
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("should return successful response on create", async () => {
      const dto = { name: "Exam", description: "Final" };
      const serviceResult = {
        id: "1",
        ...dto,
        created_at: new Date(),
        updated_at: new Date(),
      };
      service.create.mockResolvedValue(serviceResult);

      const result = await controller.create(dto);
      expect(result).toEqual(
        ResponseHelper.success(
          serviceResult,
          "Assignment type created successfully",
          201,
        ),
      );
    });
  });

  describe("findAll", () => {
    it("should return successful response on findAll", async () => {
      const serviceResult = [
        {
          id: "1",
          name: "Exam",
          description: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      service.findAll.mockResolvedValue(serviceResult);

      const result = await controller.findAll();
      expect(result).toEqual(
        ResponseHelper.success(
          serviceResult,
          "Assignment types retrieved successfully",
        ),
      );
    });
  });

  describe("findOne", () => {
    it("should return successful response on findOne", async () => {
      const serviceResult = {
        id: "1",
        name: "Exam",
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      service.findOne.mockResolvedValue(serviceResult);

      const result = await controller.findOne("1");
      expect(result).toEqual(
        ResponseHelper.success(
          serviceResult,
          "Assignment type retrieved successfully",
        ),
      );
    });
  });

  describe("update", () => {
    it("should return successful response on update", async () => {
      const updateDto = { name: "Quiz" };
      const serviceResult = {
        id: "1",
        name: "Quiz",
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      service.update.mockResolvedValue(serviceResult);

      const result = await controller.update("1", updateDto);
      expect(result).toEqual(
        ResponseHelper.success(
          serviceResult,
          "Assignment type updated successfully",
        ),
      );
    });
  });

  describe("remove", () => {
    it("should return successful response on remove", async () => {
      const serviceResult = {
        id: "1",
        name: "Exam",
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      service.remove.mockResolvedValue(serviceResult);

      const result = await controller.remove("1");
      expect(result).toEqual(
        ResponseHelper.success(
          serviceResult,
          "Assignment type deleted successfully",
        ),
      );
    });
  });
});
