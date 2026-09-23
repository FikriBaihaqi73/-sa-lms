import { Test, type TestingModule } from "@nestjs/testing";
import { ResponseHelper } from "@repo/shared/http/response";
import { SubjectPrerequisiteController } from "./subject-prerequisite.controller";
import { SubjectPrerequisiteService } from "./subject-prerequisite.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {
    client = {};
  },
}));

describe("SubjectPrerequisiteController", () => {
  let controller: SubjectPrerequisiteController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubjectPrerequisiteController],
      providers: [{ provide: SubjectPrerequisiteService, useValue: service }],
    }).compile();
    controller = module.get(SubjectPrerequisiteController);
    jest.clearAllMocks();
  });

  it("wraps the paginated list response", async () => {
    const result = {
      data: [{ id: "relation-id" }],
      meta: { totalData: 1, totalPages: 1, currentPage: 1, perPage: 10 },
    };
    service.findAll.mockResolvedValue(result);

    await expect(controller.findAll({ page: 1, limit: 10 })).resolves.toEqual(
      ResponseHelper.success(
        result.data,
        "Subject prerequisites retrieved successfully",
        200,
        result.meta,
      ),
    );
  });

  it("delegates CRUD operations", async () => {
    const dto = {
      subjectId: "00000000-0000-0000-0000-000000000002",
      prerequisiteSubjectId: "00000000-0000-0000-0000-000000000003",
    };
    const record = { id: "relation-id", ...dto };
    service.create.mockResolvedValue(record);
    service.findOne.mockResolvedValue(record);
    service.update.mockResolvedValue(record);
    service.remove.mockResolvedValue(record);

    await expect(controller.create(dto)).resolves.toEqual(
      ResponseHelper.success(
        record,
        "Subject prerequisite created successfully",
        201,
      ),
    );
    await expect(controller.findOne(record.id)).resolves.toEqual(
      ResponseHelper.success(
        record,
        "Subject prerequisite retrieved successfully",
      ),
    );
    await expect(controller.update(record.id, dto)).resolves.toEqual(
      ResponseHelper.success(
        record,
        "Subject prerequisite updated successfully",
      ),
    );
    await expect(controller.remove(record.id)).resolves.toEqual(
      ResponseHelper.success(
        record,
        "Subject prerequisite deleted successfully",
      ),
    );
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(service.findOne).toHaveBeenCalledWith(record.id);
    expect(service.update).toHaveBeenCalledWith(record.id, dto);
    expect(service.remove).toHaveBeenCalledWith(record.id);
  });
});
