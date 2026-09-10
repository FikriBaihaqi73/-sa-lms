import { NotFoundException } from "@nestjs/common";
import { ModuleRepository } from "@repo/shared/infrastructure/repository/module.repository";
import { ModuleContentRepository } from "@repo/shared/infrastructure/repository/module-content.repository";
import type { CreateModuleContentDto } from "@repo/shared/schemas/module-content.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { ModuleContentService } from "./module-content.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("ModuleContentService", () => {
  let service: ModuleContentService;

  beforeEach(() => {
    service = new ModuleContentService({} as PrismaService);
    jest
      .spyOn(ModuleRepository.prototype, "findById")
      .mockResolvedValue({ id: "module-id" } as never);
  });

  afterEach(() => jest.restoreAllMocks());

  it("rejects module content for a missing module", async () => {
    jest.spyOn(ModuleRepository.prototype, "findById").mockResolvedValue(null);
    await expect(
      service.create({} as CreateModuleContentDto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("creates and soft-deletes module content", async () => {
    const create = jest
      .spyOn(ModuleContentRepository.prototype, "create")
      .mockResolvedValue({ id: "content-id" } as never);
    jest
      .spyOn(ModuleContentRepository.prototype, "findById")
      .mockResolvedValue({ id: "content-id" } as never);
    const remove = jest
      .spyOn(ModuleContentRepository.prototype, "delete")
      .mockResolvedValue({ id: "content-id" } as never);

    await service.create({
      moduleId: "module-id",
      title: "Lesson 1",
      contentType: "text",
    } as CreateModuleContentDto);
    await expect(service.remove("content-id")).resolves.toEqual({
      success: true,
      id: "content-id",
    });
    expect(create).toHaveBeenCalledWith({
      moduleId: "module-id",
      title: "Lesson 1",
      contentType: "text",
    });
    expect(remove).toHaveBeenCalledWith("content-id");
  });
});
