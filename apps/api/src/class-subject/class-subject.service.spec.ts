import { ConflictException, NotFoundException } from "@nestjs/common";
import { ClassSubjectsRepository } from "@repo/shared/infrastructure/repository/class-subjects.repository";
import type {
  CreateClassSubjectDto,
  UpdateClassSubjectDto,
} from "@repo/shared/schemas/class-subject.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { ClassSubjectService } from "./class-subject.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {
    client = {
      classes: {
        findFirst: jest.fn(),
      },
      subject: {
        findFirst: jest.fn(),
      },
      teachers: {
        findFirst: jest.fn(),
      },
      academicYears: {
        findFirst: jest.fn(),
      },
    };
  },
}));

describe("ClassSubjectService", () => {
  let service: ClassSubjectService;
  let mockPrismaService: any;

  beforeEach(() => {
    mockPrismaService = {
      client: {
        classes: {
          findFirst: jest.fn(),
        },
        subject: {
          findFirst: jest.fn(),
        },
        teachers: {
          findFirst: jest.fn(),
        },
        academicYears: {
          findFirst: jest.fn(),
        },
      },
    };
    service = new ClassSubjectService(
      mockPrismaService as unknown as PrismaService,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockRecord = {
    id: "cs-1",
    class_id: "class-1",
    subject_id: "subject-1",
    teacher_id: "teacher-1",
    academic_year_id: "ay-1",
  };

  it("returns paginated class subjects", async () => {
    const paginatedResult = {
      data: [mockRecord],
      meta: { totalData: 1, totalPages: 1, currentPage: 1, perPage: 10 },
    };
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findAll")
      .mockResolvedValue(paginatedResult as never);

    await expect(service.findAll(1, 10, "Math")).resolves.toEqual(
      paginatedResult,
    );
  });

  it("returns a single class subject by ID", async () => {
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findById")
      .mockResolvedValue(mockRecord as never);

    await expect(service.findOne("cs-1")).resolves.toEqual(mockRecord);
  });

  it("throws NotFoundException when class subject is not found", async () => {
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("returns class subjects by class ID if class exists", async () => {
    mockPrismaService.client.classes.findFirst.mockResolvedValue({
      id: "class-1",
    });
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findByClass")
      .mockResolvedValue([mockRecord] as never);

    await expect(service.findByClass("class-1")).resolves.toEqual([mockRecord]);
  });

  it("throws NotFoundException if class does not exist", async () => {
    mockPrismaService.client.classes.findFirst.mockResolvedValue(null);

    await expect(service.findByClass("missing-class")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("returns class subjects by subject ID if subject exists", async () => {
    mockPrismaService.client.subject.findFirst.mockResolvedValue({
      id: "subject-1",
    });
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findBySubject")
      .mockResolvedValue([mockRecord] as never);

    await expect(service.findBySubject("subject-1")).resolves.toEqual([
      mockRecord,
    ]);
  });

  it("throws NotFoundException if subject does not exist", async () => {
    mockPrismaService.client.subject.findFirst.mockResolvedValue(null);

    await expect(
      service.findBySubject("missing-subject"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("returns class subjects by teacher ID if teacher exists", async () => {
    mockPrismaService.client.teachers.findFirst.mockResolvedValue({
      id: "teacher-1",
    });
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findByTeacher")
      .mockResolvedValue([mockRecord] as never);

    await expect(service.findByTeacher("teacher-1")).resolves.toEqual([
      mockRecord,
    ]);
  });

  it("throws NotFoundException if teacher does not exist", async () => {
    mockPrismaService.client.teachers.findFirst.mockResolvedValue(null);

    await expect(
      service.findByTeacher("missing-teacher"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("returns class subjects by academic year ID if academic year exists", async () => {
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue({
      id: "ay-1",
    });
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findByAcademicYear")
      .mockResolvedValue([mockRecord] as never);

    await expect(service.findByAcademicYear("ay-1")).resolves.toEqual([
      mockRecord,
    ]);
  });

  it("throws NotFoundException if academic year does not exist", async () => {
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue(null);

    await expect(
      service.findByAcademicYear("missing-ay"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("creates a new class subject successfully", async () => {
    mockPrismaService.client.classes.findFirst.mockResolvedValue({
      id: "class-1",
    });
    mockPrismaService.client.subject.findFirst.mockResolvedValue({
      id: "subject-1",
    });
    mockPrismaService.client.teachers.findFirst.mockResolvedValue({
      id: "teacher-1",
    });
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue({
      id: "ay-1",
    });
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findByUniqueCombination")
      .mockResolvedValue(null);
    jest
      .spyOn(ClassSubjectsRepository.prototype, "create")
      .mockResolvedValue(mockRecord as never);

    const dto: CreateClassSubjectDto = {
      class_id: "class-1",
      subject_id: "subject-1",
      teacher_id: "teacher-1",
      academic_year_id: "ay-1",
    };

    const result = await service.create(dto);
    expect(result).toEqual(mockRecord);
  });

  it("throws ConflictException when creating a duplicate combination", async () => {
    mockPrismaService.client.classes.findFirst.mockResolvedValue({
      id: "class-1",
    });
    mockPrismaService.client.subject.findFirst.mockResolvedValue({
      id: "subject-1",
    });
    mockPrismaService.client.teachers.findFirst.mockResolvedValue({
      id: "teacher-1",
    });
    mockPrismaService.client.academicYears.findFirst.mockResolvedValue({
      id: "ay-1",
    });
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findByUniqueCombination")
      .mockResolvedValue(mockRecord as never);

    const dto: CreateClassSubjectDto = {
      class_id: "class-1",
      subject_id: "subject-1",
      teacher_id: "teacher-1",
      academic_year_id: "ay-1",
    };

    await expect(service.create(dto)).rejects.toBeInstanceOf(ConflictException);
  });

  it("updates an existing class subject", async () => {
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findById")
      .mockResolvedValue(mockRecord as never);
    jest
      .spyOn(ClassSubjectsRepository.prototype, "update")
      .mockResolvedValue({ ...mockRecord, teacher_id: "teacher-2" } as never);
    mockPrismaService.client.teachers.findFirst.mockResolvedValue({
      id: "teacher-2",
    });
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findByUniqueCombination")
      .mockResolvedValue(null);

    const dto: UpdateClassSubjectDto = {
      teacher_id: "teacher-2",
    };

    const result = await service.update("cs-1", dto);
    expect(result).toEqual({ ...mockRecord, teacher_id: "teacher-2" });
  });

  it("soft deletes a class subject", async () => {
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findById")
      .mockResolvedValue(mockRecord as never);
    jest
      .spyOn(ClassSubjectsRepository.prototype, "delete")
      .mockResolvedValue(mockRecord as never);

    const result = await service.remove("cs-1");
    expect(result).toEqual(mockRecord);
  });
});
