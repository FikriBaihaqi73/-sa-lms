import { ConflictException, NotFoundException } from "@nestjs/common";
import { AcademicStatusRepository } from "@repo/shared/infrastructure/repository/academic-status.repository";
import type {
  CreateAcademicStatusDto,
  UpdateAcademicStatusDto,
} from "@repo/shared/schemas/academic-status.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { AcademicStatusService } from "./academic-status.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("AcademicStatusService", () => {
  let service: AcademicStatusService;

  beforeEach(() => {
    service = new AcademicStatusService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rejects a missing academic status", async () => {
    jest
      .spyOn(AcademicStatusRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects duplicate names", async () => {
    jest
      .spyOn(AcademicStatusRepository.prototype, "findByName")
      .mockResolvedValue({ id: "existing-id" } as never);

    await expect(
      service.create({ name: "Graduated" } as CreateAcademicStatusDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("updates and soft-deletes an academic status", async () => {
    jest
      .spyOn(AcademicStatusRepository.prototype, "findById")
      .mockResolvedValue({ id: "status-id" } as never);
    const update = jest
      .spyOn(AcademicStatusRepository.prototype, "update")
      .mockResolvedValue({ id: "status-id" } as never);
    const remove = jest
      .spyOn(AcademicStatusRepository.prototype, "delete")
      .mockResolvedValue({ id: "status-id" } as never);

    await service.update("status-id", {
      description: "Completed study program",
    } as UpdateAcademicStatusDto);
    await expect(service.remove("status-id")).resolves.toEqual({
      success: true,
      id: "status-id",
    });
    expect(update).toHaveBeenCalledWith("status-id", {
      description: "Completed study program",
    });
    expect(remove).toHaveBeenCalledWith("status-id");
  });
});
