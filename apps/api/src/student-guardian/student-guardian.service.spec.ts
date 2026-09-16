import { ConflictException, NotFoundException } from "@nestjs/common";
import { StudentGuardianRepository } from "@repo/shared/infrastructure/repository/student-guardian.repository";
import type {
  CreateStudentGuardianDto,
  UpdateStudentGuardianDto,
} from "@repo/shared/schemas/student-guardian.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { StudentGuardianService } from "./student-guardian.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {
    client = {
      student: {
        findFirst: jest.fn(),
      },
      guardian: {
        findFirst: jest.fn(),
      },
    };
  },
}));

describe("StudentGuardianService", () => {
  let service: StudentGuardianService;
  let mockPrismaService: any;

  beforeEach(() => {
    mockPrismaService = {
      client: {
        student: {
          findFirst: jest.fn(),
        },
        guardian: {
          findFirst: jest.fn(),
        },
      },
    };
    service = new StudentGuardianService(
      mockPrismaService as unknown as PrismaService,
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns paginated student guardian relations", async () => {
    const paginatedResult = {
      data: [
        {
          id: "relation-1",
          studentId: "student-1",
          guardianId: "guardian-1",
          isPrimary: true,
        },
      ],
      meta: { totalData: 1, totalPages: 1, currentPage: 1, perPage: 10 },
    };
    jest
      .spyOn(StudentGuardianRepository.prototype, "findAll")
      .mockResolvedValue(paginatedResult as never);

    await expect(service.findAll(1, 10, "John")).resolves.toEqual(
      paginatedResult,
    );
  });

  it("returns a single student guardian relation by ID", async () => {
    const record = {
      id: "relation-1",
      studentId: "student-1",
      guardianId: "guardian-1",
      isPrimary: true,
    };
    jest
      .spyOn(StudentGuardianRepository.prototype, "findById")
      .mockResolvedValue(record as never);

    await expect(service.findOne("relation-1")).resolves.toEqual(record);
  });

  it("throws NotFoundException when student guardian relation is missing", async () => {
    jest
      .spyOn(StudentGuardianRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("returns guardians by student ID if student exists", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue({
      id: "student-1",
    });
    const guardians = [
      { id: "relation-1", studentId: "student-1", guardianId: "guardian-1" },
    ];
    jest
      .spyOn(StudentGuardianRepository.prototype, "findByStudentId")
      .mockResolvedValue(guardians as never);

    await expect(service.findByStudentId("student-1")).resolves.toEqual(
      guardians,
    );
  });

  it("throws NotFoundException if student does not exist when getting guardians", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue(null);

    await expect(
      service.findByStudentId("missing-student"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("returns students by guardian ID if guardian exists", async () => {
    mockPrismaService.client.guardian.findFirst.mockResolvedValue({
      id: "guardian-1",
    });
    const students = [
      { id: "relation-1", studentId: "student-1", guardianId: "guardian-1" },
    ];
    jest
      .spyOn(StudentGuardianRepository.prototype, "findByGuardianId")
      .mockResolvedValue(students as never);

    await expect(service.findByGuardianId("guardian-1")).resolves.toEqual(
      students,
    );
  });

  it("throws NotFoundException if guardian does not exist when getting students", async () => {
    mockPrismaService.client.guardian.findFirst.mockResolvedValue(null);

    await expect(
      service.findByGuardianId("missing-guardian"),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("throws NotFoundException when creating relation with non-existent student", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue(null);

    await expect(
      service.create({
        studentId: "missing-student",
        guardianId: "guardian-1",
      } as CreateStudentGuardianDto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("throws NotFoundException when creating relation with non-existent guardian", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue({
      id: "student-1",
    });
    mockPrismaService.client.guardian.findFirst.mockResolvedValue(null);

    await expect(
      service.create({
        studentId: "student-1",
        guardianId: "missing-guardian",
      } as CreateStudentGuardianDto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("throws ConflictException when creating duplicate student guardian relation", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue({
      id: "student-1",
    });
    mockPrismaService.client.guardian.findFirst.mockResolvedValue({
      id: "guardian-1",
    });
    jest
      .spyOn(StudentGuardianRepository.prototype, "findByStudentAndGuardian")
      .mockResolvedValue({ id: "relation-existing" } as never);

    await expect(
      service.create({
        studentId: "student-1",
        guardianId: "guardian-1",
      } as CreateStudentGuardianDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("creates a new student guardian relation successfully", async () => {
    mockPrismaService.client.student.findFirst.mockResolvedValue({
      id: "student-1",
    });
    mockPrismaService.client.guardian.findFirst.mockResolvedValue({
      id: "guardian-1",
    });
    jest
      .spyOn(StudentGuardianRepository.prototype, "findByStudentAndGuardian")
      .mockResolvedValue(null);
    const createdRecord = {
      id: "relation-new",
      studentId: "student-1",
      guardianId: "guardian-1",
      isPrimary: true,
    };
    const createSpy = jest
      .spyOn(StudentGuardianRepository.prototype, "create")
      .mockResolvedValue(createdRecord as never);

    const result = await service.create({
      studentId: "student-1",
      guardianId: "guardian-1",
      isPrimary: true,
    } as CreateStudentGuardianDto);

    expect(result).toEqual(createdRecord);
    expect(createSpy).toHaveBeenCalledWith({
      studentId: "student-1",
      guardianId: "guardian-1",
      isPrimary: true,
    });
  });

  it("updates a student guardian relation successfully", async () => {
    const current = {
      id: "relation-1",
      studentId: "student-1",
      guardianId: "guardian-1",
      isPrimary: false,
    };
    jest
      .spyOn(StudentGuardianRepository.prototype, "findById")
      .mockResolvedValue(current as never);

    const updatedRecord = { ...current, isPrimary: true };
    const updateSpy = jest
      .spyOn(StudentGuardianRepository.prototype, "update")
      .mockResolvedValue(updatedRecord as never);

    const result = await service.update("relation-1", {
      isPrimary: true,
    } as UpdateStudentGuardianDto);

    expect(result).toEqual(updatedRecord);
    expect(updateSpy).toHaveBeenCalledWith("relation-1", { isPrimary: true });
  });

  it("soft-deletes a student guardian relation", async () => {
    const current = {
      id: "relation-1",
      studentId: "student-1",
      guardianId: "guardian-1",
    };
    jest
      .spyOn(StudentGuardianRepository.prototype, "findById")
      .mockResolvedValue(current as never);
    const deleteSpy = jest
      .spyOn(StudentGuardianRepository.prototype, "delete")
      .mockResolvedValue(current as never);

    const result = await service.remove("relation-1");

    expect(result).toEqual({ success: true, id: "relation-1" });
    expect(deleteSpy).toHaveBeenCalledWith("relation-1");
  });
});
