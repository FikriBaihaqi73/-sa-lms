import { ConflictException, NotFoundException } from "@nestjs/common";
import { GradeRepository } from "@repo/shared/infrastructure/repository/grades.repository";
import type {
  CreateGradeDto,
  UpdateGradeDto,
} from "@repo/shared/schemas/grade.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { GradeService } from "./grades.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("GradeService", () => {
  let service: GradeService;

  beforeEach(() => {
    service = new GradeService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns all grades", async () => {
    const grades = [{ id: "grade-id" }];
    jest
      .spyOn(GradeRepository.prototype, "findAll")
      .mockResolvedValue(grades as never);

    await expect(service.findAll()).resolves.toBe(grades);
  });

  it("rejects a missing grade", async () => {
    jest.spyOn(GradeRepository.prototype, "findById").mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects duplicate grades on create and update", async () => {
    jest
      .spyOn(GradeRepository.prototype, "findByGrade")
      .mockResolvedValue({ id: "existing-id" } as never);

    await expect(
      service.create({ grade: "A" } as CreateGradeDto),
    ).rejects.toBeInstanceOf(ConflictException);

    jest
      .spyOn(GradeRepository.prototype, "findById")
      .mockResolvedValue({ id: "grade-id" } as never);
    await expect(
      service.update("grade-id", { grade: "A" } as UpdateGradeDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("updates and soft-deletes a grade", async () => {
    jest
      .spyOn(GradeRepository.prototype, "findById")
      .mockResolvedValue({ id: "grade-id" } as never);
    const update = jest
      .spyOn(GradeRepository.prototype, "update")
      .mockResolvedValue({ id: "grade-id" } as never);
    const remove = jest
      .spyOn(GradeRepository.prototype, "delete")
      .mockResolvedValue({ id: "grade-id" } as never);

    await service.update("grade-id", {
      minimumScore: 75,
    } as UpdateGradeDto);
    await expect(service.remove("grade-id")).resolves.toEqual({
      success: true,
      id: "grade-id",
    });

    expect(update).toHaveBeenCalledWith("grade-id", { minimumScore: 75 });
    expect(remove).toHaveBeenCalledWith("grade-id");
  });
});
