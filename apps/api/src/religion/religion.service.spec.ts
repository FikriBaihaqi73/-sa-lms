import { ConflictException, NotFoundException } from "@nestjs/common";
import { ReligionRepository } from "@repo/shared/infrastructure/repository/religions.repository";
import type {
  CreateReligionDto,
  UpdateReligionDto,
} from "@repo/shared/schemas/religion.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { ReligionService } from "./religion.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("ReligionService", () => {
  let service: ReligionService;

  beforeEach(() => {
    service = new ReligionService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns all active religions", async () => {
    const religions = [{ id: "islam-id", name: "Islam" }];
    jest
      .spyOn(ReligionRepository.prototype, "findAll")
      .mockResolvedValue(religions as never);

    await expect(service.findAll()).resolves.toEqual(religions);
  });

  it("rejects a missing religion", async () => {
    jest
      .spyOn(ReligionRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects a duplicate name when creating", async () => {
    jest
      .spyOn(ReligionRepository.prototype, "findByName")
      .mockResolvedValue({ id: "islam-id" } as never);

    await expect(
      service.create({ name: "Islam" } as CreateReligionDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("creates a unique religion", async () => {
    const result = { id: "kristen-id", name: "Kristen" };
    jest
      .spyOn(ReligionRepository.prototype, "findByName")
      .mockResolvedValue(null);
    const create = jest
      .spyOn(ReligionRepository.prototype, "create")
      .mockResolvedValue(result as never);

    await expect(
      service.create({ name: "Kristen" } as CreateReligionDto),
    ).resolves.toEqual(result);
    expect(create).toHaveBeenCalledWith({ name: "Kristen" });
  });

  it("allows retaining the same name while updating", async () => {
    jest
      .spyOn(ReligionRepository.prototype, "findById")
      .mockResolvedValue({ id: "islam-id" } as never);
    jest
      .spyOn(ReligionRepository.prototype, "findByName")
      .mockResolvedValue({ id: "islam-id" } as never);
    const update = jest
      .spyOn(ReligionRepository.prototype, "update")
      .mockResolvedValue({ id: "islam-id", name: "Islam" } as never);

    await service.update("islam-id", { name: "Islam" } as UpdateReligionDto);

    expect(update).toHaveBeenCalledWith("islam-id", { name: "Islam" });
  });

  it("rejects using another religion's name while updating", async () => {
    jest
      .spyOn(ReligionRepository.prototype, "findById")
      .mockResolvedValue({ id: "islam-id" } as never);
    jest
      .spyOn(ReligionRepository.prototype, "findByName")
      .mockResolvedValue({ id: "kristen-id" } as never);

    await expect(
      service.update("islam-id", { name: "Kristen" } as UpdateReligionDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("soft-deletes an existing religion", async () => {
    jest
      .spyOn(ReligionRepository.prototype, "findById")
      .mockResolvedValue({ id: "islam-id" } as never);
    const remove = jest
      .spyOn(ReligionRepository.prototype, "delete")
      .mockResolvedValue({ id: "islam-id" } as never);

    await expect(service.remove("islam-id")).resolves.toEqual({
      success: true,
      id: "islam-id",
    });
    expect(remove).toHaveBeenCalledWith("islam-id");
  });
});
