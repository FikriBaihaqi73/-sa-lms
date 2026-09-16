import { Test, type TestingModule } from "@nestjs/testing";
import { ResponseHelper } from "@repo/shared/http/response";
import type {
  CreateClassSubjectDto,
  UpdateClassSubjectDto,
} from "@repo/shared/schemas/class-subject.schema";
import { ClassSubjectController } from "./class-subject.controller";
import { ClassSubjectService } from "./class-subject.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {
    client = {};
  },
}));

describe("ClassSubjectController", () => {
  let controller: ClassSubjectController;
  let service: ClassSubjectService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByClass: jest.fn(),
    findBySubject: jest.fn(),
    findByTeacher: jest.fn(),
    findByAcademicYear: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassSubjectController],
      providers: [
        {
          provide: ClassSubjectService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ClassSubjectController>(ClassSubjectController);
    service = module.get<ClassSubjectService>(ClassSubjectService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  const mockRecord = {
    id: "cs-1",
    class_id: "class-1",
    subject_id: "subject-1",
    teacher_id: "teacher-1",
    academic_year_id: "ay-1",
  };

  it("findAll returns paginated list wrapped in ResponseHelper.success", async () => {
    const mockResult = {
      data: [mockRecord],
      meta: { totalData: 1, totalPages: 1, currentPage: 1, perPage: 10 },
    };
    mockService.findAll.mockResolvedValue(mockResult);

    const result = await controller.findAll("1", "10", "Math");

    expect(result).toEqual(
      ResponseHelper.success(
        [mockRecord],
        "Class subjects retrieved successfully",
        200,
        mockResult.meta,
      ),
    );
    expect(service.findAll).toHaveBeenCalledWith(1, 10, "Math");
  });

  it("findOne returns detail wrapped in ResponseHelper.success", async () => {
    mockService.findOne.mockResolvedValue(mockRecord);

    const result = await controller.findOne("cs-1");

    expect(result).toEqual(
      ResponseHelper.success(
        mockRecord,
        "Class subject detail retrieved successfully",
      ),
    );
    expect(service.findOne).toHaveBeenCalledWith("cs-1");
  });

  it("findByClass returns list wrapped in ResponseHelper.success", async () => {
    mockService.findByClass.mockResolvedValue([mockRecord]);

    const result = await controller.findByClass("class-1");

    expect(result).toEqual(
      ResponseHelper.success(
        [mockRecord],
        "Class subjects by class retrieved successfully",
      ),
    );
    expect(service.findByClass).toHaveBeenCalledWith("class-1");
  });

  it("findBySubject returns list wrapped in ResponseHelper.success", async () => {
    mockService.findBySubject.mockResolvedValue([mockRecord]);

    const result = await controller.findBySubject("subject-1");

    expect(result).toEqual(
      ResponseHelper.success(
        [mockRecord],
        "Class subjects by subject retrieved successfully",
      ),
    );
    expect(service.findBySubject).toHaveBeenCalledWith("subject-1");
  });

  it("findByTeacher returns list wrapped in ResponseHelper.success", async () => {
    mockService.findByTeacher.mockResolvedValue([mockRecord]);

    const result = await controller.findByTeacher("teacher-1");

    expect(result).toEqual(
      ResponseHelper.success(
        [mockRecord],
        "Class subjects by teacher retrieved successfully",
      ),
    );
    expect(service.findByTeacher).toHaveBeenCalledWith("teacher-1");
  });

  it("findByAcademicYear returns list wrapped in ResponseHelper.success", async () => {
    mockService.findByAcademicYear.mockResolvedValue([mockRecord]);

    const result = await controller.findByAcademicYear("ay-1");

    expect(result).toEqual(
      ResponseHelper.success(
        [mockRecord],
        "Class subjects by academic year retrieved successfully",
      ),
    );
    expect(service.findByAcademicYear).toHaveBeenCalledWith("ay-1");
  });

  it("create returns created entity wrapped in ResponseHelper.success with 201 status", async () => {
    mockService.create.mockResolvedValue(mockRecord);

    const dto: CreateClassSubjectDto = {
      class_id: "class-1",
      subject_id: "subject-1",
      teacher_id: "teacher-1",
      academic_year_id: "ay-1",
    };

    const result = await controller.create(dto);

    expect(result).toEqual(
      ResponseHelper.success(
        mockRecord,
        "Class subject created successfully",
        201,
      ),
    );
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("update returns updated entity wrapped in ResponseHelper.success", async () => {
    const updated = { ...mockRecord, teacher_id: "teacher-2" };
    mockService.update.mockResolvedValue(updated);

    const dto: UpdateClassSubjectDto = { teacher_id: "teacher-2" };

    const result = await controller.update("cs-1", dto);

    expect(result).toEqual(
      ResponseHelper.success(updated, "Class subject updated successfully"),
    );
    expect(service.update).toHaveBeenCalledWith("cs-1", dto);
  });

  it("remove returns deleted result wrapped in ResponseHelper.success", async () => {
    mockService.remove.mockResolvedValue(mockRecord);

    const result = await controller.remove("cs-1");

    expect(result).toEqual(
      ResponseHelper.success(mockRecord, "Class subject deleted successfully"),
    );
    expect(service.remove).toHaveBeenCalledWith("cs-1");
  });
});
