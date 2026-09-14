import { NotFoundException } from "@nestjs/common";
import { ClassSubjectsRepository } from "@repo/shared/infrastructure/repository/class-subjects.repository";
import { ModuleRepository } from "@repo/shared/infrastructure/repository/module.repository";
import type { CreateModuleDto } from "@repo/shared/schemas/module.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { LearningModuleService } from "./module.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("LearningModuleService", () => {
  let service: LearningModuleService;

  beforeEach(() => {
    service = new LearningModuleService({} as PrismaService);
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findById")
      .mockResolvedValue({ id: "class-subject-id" } as never);
  });

  afterEach(() => jest.restoreAllMocks());

  it("forwards the search filter when retrieving learning modules", async () => {
    const findAll = jest
      .spyOn(ModuleRepository.prototype, "findAll")
      .mockResolvedValue({
        data: [],
        meta: { totalData: 0, totalPages: 0, currentPage: 1, perPage: 10 },
      });

    await service.findAll(1, 10, { search: "mathematics" });

    expect(findAll).toHaveBeenCalledWith(1, 10, { search: "mathematics" });
  });

  it("rejects a module with a missing class subject", async () => {
    jest
      .spyOn(ClassSubjectsRepository.prototype, "findById")
      .mockResolvedValue(null);
    await expect(service.create({} as CreateModuleDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("creates and soft-deletes a learning module", async () => {
    const create = jest
      .spyOn(ModuleRepository.prototype, "create")
      .mockResolvedValue({ id: "module-id" } as never);
    jest
      .spyOn(ModuleRepository.prototype, "findById")
      .mockResolvedValue({ id: "module-id" } as never);
    const remove = jest
      .spyOn(ModuleRepository.prototype, "delete")
      .mockResolvedValue({ id: "module-id" } as never);

    await service.create({
      class_subject_id: "class-subject-id",
      title: "Mathematics",
    } as CreateModuleDto);
    await expect(service.remove("module-id")).resolves.toEqual({
      success: true,
      id: "module-id",
    });
    expect(create).toHaveBeenCalledWith({
      class_subject_id: "class-subject-id",
      title: "Mathematics",
    });
    expect(remove).toHaveBeenCalledWith("module-id");
  });
});
