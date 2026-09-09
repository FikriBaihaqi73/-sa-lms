import { ConflictException, NotFoundException } from "@nestjs/common";
import { InstitutionLevelRepository } from "@repo/shared/infrastructure/repository/institution-level.repository";
import type {
  CreateInstitutionLevelDto,
  UpdateInstitutionLevelDto,
} from "@repo/shared/schemas/institution-level.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { InstitutionLevelService } from "./institution-level.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("InstitutionLevelService", () => {
  let service: InstitutionLevelService;

  beforeEach(() => {
    service = new InstitutionLevelService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns all active institution levels", async () => {
    const levels = [{ id: "level-id" }];
    jest
      .spyOn(InstitutionLevelRepository.prototype, "findAll")
      .mockResolvedValue(levels as never);

    await expect(service.findAll()).resolves.toBe(levels);
  });

  it("rejects a missing institution level", async () => {
    jest
      .spyOn(InstitutionLevelRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects duplicate names and supports update/delete", async () => {
    jest
      .spyOn(InstitutionLevelRepository.prototype, "findByName")
      .mockResolvedValue({ id: "existing-id" } as never);
    await expect(
      service.create({ name: "SMA" } as CreateInstitutionLevelDto),
    ).rejects.toBeInstanceOf(ConflictException);

    jest
      .spyOn(InstitutionLevelRepository.prototype, "findById")
      .mockResolvedValue({ id: "level-id" } as never);
    const update = jest
      .spyOn(InstitutionLevelRepository.prototype, "update")
      .mockResolvedValue({ id: "level-id" } as never);
    const remove = jest
      .spyOn(InstitutionLevelRepository.prototype, "delete")
      .mockResolvedValue({ id: "level-id" } as never);

    await service.update("level-id", {
      description: "Secondary school",
    } as UpdateInstitutionLevelDto);
    await service.remove("level-id");
    expect(update).toHaveBeenCalledWith("level-id", {
      description: "Secondary school",
    });
    expect(remove).toHaveBeenCalledWith("level-id");
  });
});
