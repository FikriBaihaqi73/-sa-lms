import { Test, type TestingModule } from "@nestjs/testing";
import { ResponseHelper } from "@repo/shared/http/response";
import type {
  CreateStudentGradeDto,
  UpdateStudentGradeDto,
} from "@repo/shared/schemas/student-grade.schema";
import { StudentGradeController } from "./student-grade.controller";
import { StudentGradeService } from "./student-grade.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {
    client = {};
  },
}));

describe("StudentGradeController", () => {
  let controller: StudentGradeController;
  let service: StudentGradeService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByStudentId: jest.fn(),
    findByClassSubjectId: jest.fn(),
    findByAcademicYearId: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StudentGradeController],
      providers: [
        {
          provide: StudentGradeService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<StudentGradeController>(StudentGradeController);
    service = module.get<StudentGradeService>(StudentGradeService);
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  const mockRecord = {
    id: "sg-1",
    studentId: "student-1",
    classSubjectId: "cs-1",
    academicYearId: "ay-1",
    assignmentScore: 85,
    finalScore: 88,
  };

  it("findAll returns paginated list wrapped in ResponseHelper.success", async () => {
    const mockResult = {
      data: [mockRecord],
      meta: { totalData: 1, totalPages: 1, currentPage: 1, perPage: 10 },
    };
    mockService.findAll.mockResolvedValue(mockResult);

    const result = await controller.findAll("1", "10", "STD001");

    expect(result).toEqual(
      ResponseHelper.success(
        [mockRecord],
        "Student grades retrieved successfully",
        200,
        mockResult.meta,
      ),
    );
    expect(service.findAll).toHaveBeenCalledWith(1, 10, "STD001");
  });

  it("findOne returns detail wrapped in ResponseHelper.success", async () => {
    mockService.findOne.mockResolvedValue(mockRecord);

    const result = await controller.findOne("sg-1");

    expect(result).toEqual(
      ResponseHelper.success(
        mockRecord,
        "Student grade detail retrieved successfully",
      ),
    );
    expect(service.findOne).toHaveBeenCalledWith("sg-1");
  });

  it("findByStudentId returns list wrapped in ResponseHelper.success", async () => {
    mockService.findByStudentId.mockResolvedValue([mockRecord]);

    const result = await controller.findByStudentId("student-1");

    expect(result).toEqual(
      ResponseHelper.success(
        [mockRecord],
        "Student grades by student retrieved successfully",
      ),
    );
    expect(service.findByStudentId).toHaveBeenCalledWith("student-1");
  });

  it("findByClassSubjectId returns list wrapped in ResponseHelper.success", async () => {
    mockService.findByClassSubjectId.mockResolvedValue([mockRecord]);

    const result = await controller.findByClassSubjectId("cs-1");

    expect(result).toEqual(
      ResponseHelper.success(
        [mockRecord],
        "Student grades by class subject retrieved successfully",
      ),
    );
    expect(service.findByClassSubjectId).toHaveBeenCalledWith("cs-1");
  });

  it("findByAcademicYearId returns list wrapped in ResponseHelper.success", async () => {
    mockService.findByAcademicYearId.mockResolvedValue([mockRecord]);

    const result = await controller.findByAcademicYearId("ay-1");

    expect(result).toEqual(
      ResponseHelper.success(
        [mockRecord],
        "Student grades by academic year retrieved successfully",
      ),
    );
    expect(service.findByAcademicYearId).toHaveBeenCalledWith("ay-1");
  });

  it("create returns created record wrapped in ResponseHelper.success with 201 status", async () => {
    mockService.create.mockResolvedValue(mockRecord);

    const dto: CreateStudentGradeDto = {
      studentId: "student-1",
      classSubjectId: "cs-1",
      academicYearId: "ay-1",
    };

    const result = await controller.create(dto);

    expect(result).toEqual(
      ResponseHelper.success(
        mockRecord,
        "Student grade created successfully",
        201,
      ),
    );
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it("update returns updated record wrapped in ResponseHelper.success", async () => {
    const updated = { ...mockRecord, finalScore: 95 };
    mockService.update.mockResolvedValue(updated);

    const dto: UpdateStudentGradeDto = { finalScore: 95 };

    const result = await controller.update("sg-1", dto);

    expect(result).toEqual(
      ResponseHelper.success(updated, "Student grade updated successfully"),
    );
    expect(service.update).toHaveBeenCalledWith("sg-1", dto);
  });

  it("remove returns deleted result wrapped in ResponseHelper.success", async () => {
    mockService.remove.mockResolvedValue(mockRecord);

    const result = await controller.remove("sg-1");

    expect(result).toEqual(
      ResponseHelper.success(mockRecord, "Student grade deleted successfully"),
    );
    expect(service.remove).toHaveBeenCalledWith("sg-1");
  });
});
