import { ConflictException, NotFoundException } from "@nestjs/common";
import { AcademicYearRepository } from "@repo/shared/infrastructure/repository/academic-year.repository";
import type {
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
} from "@repo/shared/schemas/academic-year.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { AcademicYearService } from "./academic-year.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("AcademicYearService", () => {
  let service: AcademicYearService;

  beforeEach(() => {
    service = new AcademicYearService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rejects a missing academic year", async () => {
    jest
      .spyOn(AcademicYearRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects duplicate years", async () => {
    jest
      .spyOn(AcademicYearRepository.prototype, "findByAcademicYear")
      .mockResolvedValue({ id: "existing-id" } as never);

    await expect(
      service.create({ academic_year: "2026/2027" } as CreateAcademicYearDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("updates and soft-deletes an academic year", async () => {
    jest
      .spyOn(AcademicYearRepository.prototype, "findById")
      .mockResolvedValue({ id: "year-id" } as never);
    const update = jest
      .spyOn(AcademicYearRepository.prototype, "update")
      .mockResolvedValue({ id: "year-id" } as never);
    const remove = jest
      .spyOn(AcademicYearRepository.prototype, "delete")
      .mockResolvedValue({ id: "year-id" } as never);

    await service.update("year-id", {
      is_active: true,
    } as UpdateAcademicYearDto);
    await expect(service.remove("year-id")).resolves.toEqual({
      success: true,
      id: "year-id",
    });
    expect(update).toHaveBeenCalledWith("year-id", { is_active: true });
    expect(remove).toHaveBeenCalledWith("year-id");
  });
});
