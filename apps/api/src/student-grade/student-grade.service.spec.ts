import { ConflictException, NotFoundException } from "@nestjs/common";
import { StudentGradeRepository } from "@repo/shared/infrastructure/repository/student-grade.repository";
import type {
  CreateStudentGradeDto,
  UpdateStudentGradeDto,
} from "@repo/shared/schemas/student-grade.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { StudentGradeService } from "./student-grade.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {
    client = {
      student: {
        findFirst: jest.fn(),
      },
      classSubjects: {
        findFirst: jest.fn(),
      },
      academicYears: {
        findFirst: jest.fn(),
      },
      grades: {
        findFirst: jest.fn(),
      },
    };
  },
}));

describe("StudentGradeService", () => {
  let service: StudentGradeService;
  let mockPrismaService: any;

  beforeEach(() => {
    mockPrismaService = {
      client: {
        student: {
          findFirst: jest.fn(),
        },
        classSubjects: {
          findFirst: jest.fn(),
        },
        academicYears: {
          findFirst: jest.fn(),
        },
        grades: {
          findFirst: jest.fn(),
        },
      },
    };
    service = new StudentGradeService(
      mockPrismaService as unknown as PrismaService,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockRecord = {
    id: "sg-1",
    studentId: "student-1",
    classSubjectId: "cs-1",
    academicYearId: "ay-1",
    assignmentScore: 85,
    quizScore: 90,
    midExamScore: 80,
    finalExamScore: 88,
    finalScore: 85.5,
    gradeId: "grade-a",
    remarks: "Good",
  };

  it("returns paginated student grades", async () => {
    const paginatedResult = {
      data: [mockRecord],
      meta: { totalData: 1, totalPages: 1, currentPage: 1, perPage: 10 },
    };
    jest
      .spyOn(StudentGradeRepository.prototype, "findAll")
      .mockResolvedValue(paginatedResult as never);

    await expect(service.findAll(1, 10, "STD001")).resolves.toEqual(
      paginatedResult,
    );
  });

  it("returns a single student grade by ID", async () => {
    jest
      .spyOn(StudentGradeRepository.prototype, "findById")
      .mockResolvedValue(mockRecord as never);

    await expect(service.findOne("sg-1")).resolves.toEqual(mockRecord);
  });

  it("throws NotFoundException when student grade is not found", async () => {
    jest
      .spyOn(StudentGradeRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("returns student grades by student ID if student exists", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue({
      id: "student-1",
    });
    jest
      .spyOn(StudentGradeRepository.prototype, "findByStudentId")
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

  it("returns student grades by class subject ID if class subject exists", async () => {
    mockPrismaService.client.classSubjects.findFirst.mockResolvedValue({
      id: "cs-1",
    });
    jest
      .spyOn(StudentGradeRepository.prototype, "findByClassSubjectId")
      .mockResolvedValue([mockRecord] as never);

    await expect(service.findByClassSubjectId("cs-1")).resolves.toEqual([
      mockRecord,
    ]);
  });

  it("throws NotFoundException if class subject does not exist", async () => {
    mockPrismaService.client.classSubjects.findFirst.mockResolvedValue(null);

    await expect(
      service.findByClassSubjectId("missing-cs"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("returns student grades by academic year ID if academic year exists", async () => {
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue({
      id: "ay-1",
    });
    jest
      .spyOn(StudentGradeRepository.prototype, "findByAcademicYearId")
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

  it("creates a new student grade successfully", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue({
      id: "student-1",
    });
    mockPrismaService.client.classSubjects.findFirst.mockResolvedValue({
      id: "cs-1",
    });
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue({
      id: "ay-1",
    });
    mockPrismaService.client.grades.findFirst.mockResolvedValue({
      id: "grade-a",
    });
    jest
      .spyOn(StudentGradeRepository.prototype, "findByUniqueCombination")
      .mockResolvedValue(null);
    jest
      .spyOn(StudentGradeRepository.prototype, "create")
      .mockResolvedValue(mockRecord as never);

    const dto: CreateStudentGradeDto = {
      studentId: "student-1",
      classSubjectId: "cs-1",
      academicYearId: "ay-1",
      gradeId: "grade-a",
      assignmentScore: 85,
    };

    const result = await service.create(dto);
    expect(result).toEqual(mockRecord);
  });

  it("throws ConflictException when creating duplicate student grade combination", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue({
      id: "student-1",
    });
    mockPrismaService.client.classSubjects.findFirst.mockResolvedValue({
      id: "cs-1",
    });
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue({
      id: "ay-1",
    });
    jest
      .spyOn(StudentGradeRepository.prototype, "findByUniqueCombination")
      .mockResolvedValue(mockRecord as never);

    const dto: CreateStudentGradeDto = {
      studentId: "student-1",
      classSubjectId: "cs-1",
      academicYearId: "ay-1",
    };

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
  });

  it("updates an existing student grade record", async () => {
    jest
      .spyOn(StudentGradeRepository.prototype, "findById")
      .mockResolvedValue(mockRecord as never);
    jest
      .spyOn(StudentGradeRepository.prototype, "update")
      .mockResolvedValue({ ...mockRecord, finalScore: 92 } as never);

    const dto: UpdateStudentGradeDto = { finalScore: 92 };

    const result = await service.update("sg-1", dto);
    expect(result).toEqual({ ...mockRecord, finalScore: 92 });
  });

  it("soft deletes a student grade record", async () => {
    jest
      .spyOn(StudentGradeRepository.prototype, "findById")
      .mockResolvedValue(mockRecord as never);
    jest
      .spyOn(StudentGradeRepository.prototype, "delete")
      .mockResolvedValue(mockRecord as never);

    const result = await service.remove("sg-1");
    expect(result).toEqual(mockRecord);
  });
});
