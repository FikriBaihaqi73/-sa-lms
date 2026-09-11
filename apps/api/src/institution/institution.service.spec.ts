import { NotFoundException } from "@nestjs/common";
import { InstitutionLevelRepository } from "@repo/shared/infrastructure/repository/institution-level.repository";
import { InstitutionRepository } from "@repo/shared/infrastructure/repository/institution.repository";
import type { CreateInstitutionDto } from "@repo/shared/schemas/institution.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { InstitutionService } from "./institution.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("InstitutionService", () => {
  let service: InstitutionService;
  const dto = {
    institutionLevelId: "institution-level-id",
    name: "Test Institution",
  } as CreateInstitutionDto;

  beforeEach(() => {
    service = new InstitutionService({} as PrismaService);
    jest
      .spyOn(InstitutionLevelRepository.prototype, "findById")
      .mockResolvedValue({ id: dto.institutionLevelId } as never);
  });

  afterEach(() => jest.restoreAllMocks());

  it("rejects an institution that references a missing institution level", async () => {
    jest.spyOn(InstitutionLevelRepository.prototype, "findById").mockResolvedValue(null);
    await expect(service.create(dto)).rejects.toBeInstanceOf(NotFoundException);
  });

  it("creates and soft-deletes an institution", async () => {
    const create = jest
      .spyOn(InstitutionRepository.prototype, "create")
      .mockResolvedValue({ id: "institution-id" } as never);
    jest
      .spyOn(InstitutionRepository.prototype, "findById")
      .mockResolvedValue({ id: "institution-id" } as never);
    const remove = jest
      .spyOn(InstitutionRepository.prototype, "delete")
      .mockResolvedValue({ id: "institution-id" } as never);

    await service.create(dto);
    await expect(service.remove("institution-id")).resolves.toEqual({
      success: true,
      id: "institution-id",
    });
    expect(create).toHaveBeenCalledWith(dto);
    expect(remove).toHaveBeenCalledWith("institution-id");
  });
});
