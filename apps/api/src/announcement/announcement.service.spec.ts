import { NotFoundException } from "@nestjs/common";
import { AnnouncementsRepository } from "@repo/shared/infrastructure/repository/announcements.repository";
import { InstitutionRepository } from "@repo/shared/infrastructure/repository/institution.repository";
import type { PrismaService } from "../prisma/prisma.service";
import { AnnouncementService } from "./announcement.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("AnnouncementService", () => {
  let service: AnnouncementService;

  beforeEach(() => {
    service = new AnnouncementService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("forwards pagination and search to the repository", async () => {
    const result = {
      data: [],
      meta: { totalData: 0, totalPages: 0, currentPage: 2, perPage: 10 },
    };
    const findAll = jest
      .spyOn(AnnouncementsRepository.prototype, "findAll")
      .mockResolvedValue(result);

    await expect(service.findAll(2, 10, "exam")).resolves.toEqual(result);
    expect(findAll).toHaveBeenCalledWith(2, 10, { search: "exam" });
  });

  it("rejects a missing announcement", async () => {
    jest
      .spyOn(AnnouncementsRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects creation when the institution does not exist", async () => {
    jest
      .spyOn(InstitutionRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(
      service.create({
        institutionId: "00000000-0000-0000-0000-000000000001",
        title: "Exam announcement",
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
