import { ConflictException, NotFoundException } from "@nestjs/common";
import { ExaminationScoreRepository } from "@repo/shared/infrastructure/repository/examination-score.repository";
import type {
  CreateExaminationScoreDto,
  UpdateExaminationScoreDto,
} from "@repo/shared/schemas/examination-score.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { ExaminationScoreService } from "./examination-score.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("ExaminationScoreService", () => {
  let service: ExaminationScoreService;

  beforeEach(() => {
    service = new ExaminationScoreService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns paginated search results", async () => {
    const result = {
      data: [{ id: "score-id" }],
      meta: {
        totalData: 1,
        totalPages: 1,
        currentPage: 1,
        perPage: 10,
      },
    };

    jest
      .spyOn(ExaminationScoreRepository.prototype, "findAll")
      .mockResolvedValue(result as never);

    await expect(service.findAll(1, 10, "math")).resolves.toEqual(result);
  });

  it("rejects a missing examination score", async () => {
    jest
      .spyOn(ExaminationScoreRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects duplicate examination scores for the same exam and student", async () => {
    jest
      .spyOn(ExaminationScoreRepository.prototype, "findByExaminationAndStudent")
      .mockResolvedValue({ id: "existing-score-id" } as never);

    await expect(
      service.create({
        examinationId: "11111111-1111-4111-8111-111111111111",
        studentId: "22222222-2222-4222-8222-222222222222",
        score: 90,
      } as CreateExaminationScoreDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("updates an existing examination score", async () => {
    jest
      .spyOn(ExaminationScoreRepository.prototype, "findById")
      .mockResolvedValue({ id: "score-id" } as never);
    const updateSpy = jest
      .spyOn(ExaminationScoreRepository.prototype, "update")
      .mockResolvedValue({ id: "score-id", score: 95 } as never);

    await expect(
      service.update("score-id", { score: 95 } as UpdateExaminationScoreDto),
    ).resolves.toEqual({ id: "score-id", score: 95 });

    expect(updateSpy).toHaveBeenCalledWith("score-id", { score: 95 });
  });
});
