import { NotFoundException } from "@nestjs/common";
import { GuardianRepository } from "@repo/shared/infrastructure/repository/guardian.repository";
import type { CreateGuardianDto } from "@repo/shared/schemas/guardian.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { GuardianService } from "./guardian.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("GuardianService", () => {
  let service: GuardianService;

  beforeEach(() => {
    service = new GuardianService({} as PrismaService);
  });

  afterEach(() => jest.restoreAllMocks());

  it("forwards the search filter when retrieving guardians", async () => {
    const findAll = jest
      .spyOn(GuardianRepository.prototype, "findAll")
      .mockResolvedValue({
        data: [],
        meta: { totalData: 0, totalPages: 0, currentPage: 1, perPage: 10 },
      });

    await service.findAll(1, 10, { search: "jane" });

    expect(findAll).toHaveBeenCalledWith(1, 10, { search: "jane" });
  });

  it("throws NotFoundException when the guardian does not exist", async () => {
    jest.spyOn(GuardianRepository.prototype, "findById").mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("creates, updates, and soft-deletes a guardian", async () => {
    const create = jest
      .spyOn(GuardianRepository.prototype, "create")
      .mockResolvedValue({ id: "guardian-id" } as never);
    jest.spyOn(GuardianRepository.prototype, "findById").mockResolvedValue({
      id: "guardian-id",
    } as never);
    const update = jest
      .spyOn(GuardianRepository.prototype, "update")
      .mockResolvedValue({ id: "guardian-id" } as never);
    const remove = jest
      .spyOn(GuardianRepository.prototype, "delete")
      .mockResolvedValue({ id: "guardian-id" } as never);

    await service.create({ fullName: "Jane Doe" } as CreateGuardianDto);
    await service.update("guardian-id", { occupation: "Teacher" });
    await expect(service.remove("guardian-id")).resolves.toEqual({
      success: true,
      id: "guardian-id",
    });

    expect(create).toHaveBeenCalledWith({ fullName: "Jane Doe" });
    expect(update).toHaveBeenCalledWith("guardian-id", {
      occupation: "Teacher",
    });
    expect(remove).toHaveBeenCalledWith("guardian-id");
  });
});
