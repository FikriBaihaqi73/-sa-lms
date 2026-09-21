import { ConflictException, NotFoundException } from "@nestjs/common";
import { StudyResultRepository } from "@repo/shared/infrastructure/repository/study-result.repository";
import type {
  CreateStudyResultDto,
  UpdateStudyResultDto,
} from "@repo/shared/schemas/study-result.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { StudyResultService } from "./study-result.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {
    client = {
      student: {
        findFirst: jest.fn(),
      },
      academicYears: {
        findFirst: jest.fn(),
      },
      semesters: {
        findFirst: jest.fn(),
      },
      academicStatuses: {
        findFirst: jest.fn(),
      },
    };
  },
}));

describe("StudyResultService", () => {
  let service: StudyResultService;
  let mockPrismaService: any;

  beforeEach(() => {
    mockPrismaService = {
      client: {
        student: {
          findFirst: jest.fn(),
        },
        academicYears: {
          findFirst: jest.fn(),
        },
        semesters: {
          findFirst: jest.fn(),
        },
        academicStatuses: {
          findFirst: jest.fn(),
        },
      },
    };
    service = new StudyResultService(
      mockPrismaService as unknown as PrismaService,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockRecord = {
    id: "sr-1",
    studentId: "student-1",
    academicYearId: "ay-1",
    semesterId: "sem-1",
    totalCredits: 24,
    semesterGpa: 3.85,
    cumulativeGpa: 3.8,
    academicStatusId: "status-active",
  };

  it("returns paginated study results", async () => {
    const paginatedResult = {
      data: [mockRecord],
      meta: { totalData: 1, totalPages: 1, currentPage: 1, perPage: 10 },
    };
    jest
      .spyOn(StudyResultRepository.prototype, "findAll")
      .mockResolvedValue(paginatedResult as never);

    await expect(service.findAll(1, 10, "John")).resolves.toEqual(
      paginatedResult,
    );
  });

  it("returns a single study result by ID", async () => {
    jest
      .spyOn(StudyResultRepository.prototype, "findById")
      .mockResolvedValue(mockRecord as never);

    await expect(service.findOne("sr-1")).resolves.toEqual(mockRecord);
  });

  it("throws NotFoundException when study result is not found", async () => {
    jest
      .spyOn(StudyResultRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("returns study results by student ID if student exists", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue({
      id: "student-1",
    });
    jest
      .spyOn(StudyResultRepository.prototype, "findByStudentId")
      .mockResolvedValue([mockRecord] as never);

    await expect(service.findByStudentId("student-1")).resolves.toEqual([
      mockRecord,
    ]);
  });

  it("throws NotFoundException if student does not exist", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue(null);

    await expect(service.findByStudentId("missing-std")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("returns study results by academic year ID if academic year exists", async () => {
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue({
      id: "ay-1",
    });
    jest
      .spyOn(StudyResultRepository.prototype, "findByAcademicYearId")
      .mockResolvedValue([mockRecord] as never);

    await expect(service.findByAcademicYearId("ay-1")).resolves.toEqual([
      mockRecord,
    ]);
  });

  it("throws NotFoundException if academic year does not exist", async () => {
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue(null);

    await expect(
      service.findByAcademicYearId("missing-ay"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("returns study results by semester ID if semester exists", async () => {
    mockPrismaService.client.semesters.findFirst.mockResolvedValue({
      id: "sem-1",
    });
    jest
      .spyOn(StudyResultRepository.prototype, "findBySemesterId")
      .mockResolvedValue([mockRecord] as never);

    await expect(service.findBySemesterId("sem-1")).resolves.toEqual([
      mockRecord,
    ]);
  });

  it("throws NotFoundException if semester does not exist", async () => {
    mockPrismaService.client.semesters.findFirst.mockResolvedValue(null);

    await expect(
      service.findBySemesterId("missing-sem"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("creates a new study result record successfully", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue({
      id: "student-1",
    });
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue({
      id: "ay-1",
    });
    mockPrismaService.client.semesters.findFirst.mockResolvedValue({
      id: "sem-1",
    });
    mockPrismaService.client.academicStatuses.findFirst.mockResolvedValue({
      id: "status-active",
    });
    jest
      .spyOn(StudyResultRepository.prototype, "findByUniqueCombination")
      .mockResolvedValue(null);
    jest
      .spyOn(StudyResultRepository.prototype, "create")
      .mockResolvedValue(mockRecord as never);

    const dto: CreateStudyResultDto = {
      studentId: "student-1",
      academicYearId: "ay-1",
      semesterId: "sem-1",
      totalCredits: 24,
      semesterGpa: 3.85,
      cumulativeGpa: 3.8,
      academicStatusId: "status-active",
    };

    const result = await service.create(dto);
    expect(result).toEqual(mockRecord);
  });

  it("throws ConflictException when creating duplicate study result combination", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue({
      id: "student-1",
    });
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue({
      id: "ay-1",
    });
    mockPrismaService.client.semesters.findFirst.mockResolvedValue({
      id: "sem-1",
    });
    jest
      .spyOn(StudyResultRepository.prototype, "findByUniqueCombination")
      .mockResolvedValue(mockRecord as never);

    const dto: CreateStudyResultDto = {
      studentId: "student-1",
      academicYearId: "ay-1",
      semesterId: "sem-1",
    };

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
  });

  it("updates an existing study result record", async () => {
    jest
      .spyOn(StudyResultRepository.prototype, "findById")
      .mockResolvedValue(mockRecord as never);
    jest
      .spyOn(StudyResultRepository.prototype, "update")
      .mockResolvedValue({ ...mockRecord, semesterGpa: 3.95 } as never);

    const dto: UpdateStudyResultDto = { semesterGpa: 3.95 };

    const result = await service.update("sr-1", dto);
    expect(result).toEqual({ ...mockRecord, semesterGpa: 3.95 });
  });

  it("soft deletes a study result record", async () => {
    jest
      .spyOn(StudyResultRepository.prototype, "findById")
      .mockResolvedValue(mockRecord as never);
    jest
      .spyOn(StudyResultRepository.prototype, "delete")
      .mockResolvedValue(mockRecord as never);

    const result = await service.remove("sr-1");
    expect(result).toEqual(mockRecord);
  });
});
