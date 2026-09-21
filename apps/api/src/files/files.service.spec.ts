import { NotFoundException } from "@nestjs/common";
import { FilesRepository } from "@repo/shared/infrastructure/repository/files.repository";
import type { PrismaService } from "../prisma/prisma.service";
import { FilesService } from "./files.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("FilesService", () => {
  let service: FilesService;

  beforeEach(() => {
    service = new FilesService({} as PrismaService);
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
      .spyOn(FilesRepository.prototype, "findAll")
      .mockResolvedValue(result);

    await expect(service.findAll(2, 10, "report")).resolves.toEqual(result);
    expect(findAll).toHaveBeenCalledWith(2, 10, { search: "report" });
  });

  it("rejects a missing file", async () => {
    jest
      .spyOn(FilesRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});