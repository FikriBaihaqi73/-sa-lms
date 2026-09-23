import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { SubjectRepository } from "@repo/shared/infrastructure/repository/subject.repository";
import { SubjectPrerequisitesRepository } from "@repo/shared/infrastructure/repository/subject-prerequisites.repository";
import type { PrismaService } from "../prisma/prisma.service";
import { SubjectPrerequisiteService } from "./subject-prerequisite.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {
    client = {};
  },
}));

describe("SubjectPrerequisiteService", () => {
  let service: SubjectPrerequisiteService;
  const prisma = { client: {} } as PrismaService;

  const record = {
    id: "00000000-0000-0000-0000-000000000001",
    subjectId: "00000000-0000-0000-0000-000000000002",
    prerequisiteSubjectId: "00000000-0000-0000-0000-000000000003",
  };

  beforeEach(() => {
    service = new SubjectPrerequisiteService(prisma);
    jest.restoreAllMocks();
  });

  it("creates a relation after validating both subjects", async () => {
    jest
      .spyOn(SubjectRepository.prototype, "findById")
      .mockResolvedValue({ id: "subject" } as never);
    jest
      .spyOn(
        SubjectPrerequisitesRepository.prototype,
        "findByUniqueCombination",
      )
      .mockResolvedValue(null);
    jest
      .spyOn(SubjectPrerequisitesRepository.prototype, "create")
      .mockResolvedValue(record as never);

    await expect(
      service.create({
        subjectId: record.subjectId,
        prerequisiteSubjectId: record.prerequisiteSubjectId,
      }),
    ).resolves.toEqual(record);
  });

  it("rejects a self-prerequisite", async () => {
    await expect(
      service.create({
        subjectId: record.subjectId,
        prerequisiteSubjectId: record.subjectId,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it("rejects a missing related subject", async () => {
    jest.spyOn(SubjectRepository.prototype, "findById").mockResolvedValue(null);

    await expect(
      service.create({
        subjectId: record.subjectId,
        prerequisiteSubjectId: record.prerequisiteSubjectId,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("rejects duplicate relations", async () => {
    jest
      .spyOn(SubjectRepository.prototype, "findById")
      .mockResolvedValue({ id: "subject" } as never);
    jest
      .spyOn(
        SubjectPrerequisitesRepository.prototype,
        "findByUniqueCombination",
      )
      .mockResolvedValue(record as never);

    await expect(
      service.create({
        subjectId: record.subjectId,
        prerequisiteSubjectId: record.prerequisiteSubjectId,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("returns paginated relations", async () => {
    const result = {
      data: [record],
      meta: { totalData: 1, totalPages: 1, currentPage: 1, perPage: 10 },
    };
    jest
      .spyOn(SubjectPrerequisitesRepository.prototype, "findAll")
      .mockResolvedValue(result as never);

    await expect(service.findAll({ page: 1, limit: 10 })).resolves.toEqual(
      result,
    );
  });

  it("throws when finding a missing relation", async () => {
    jest
      .spyOn(SubjectPrerequisitesRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne(record.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("soft-deletes an existing relation", async () => {
    jest
      .spyOn(SubjectPrerequisitesRepository.prototype, "findById")
      .mockResolvedValue(record as never);
    jest
      .spyOn(SubjectPrerequisitesRepository.prototype, "delete")
      .mockResolvedValue(record as never);

    await expect(service.remove(record.id)).resolves.toEqual(record);
  });
});
