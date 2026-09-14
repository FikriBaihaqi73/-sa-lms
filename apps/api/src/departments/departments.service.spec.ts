import { DepartmentRepository } from "@repo/shared/infrastructure/repository/departments.repository";
import type { PrismaService } from "../prisma/prisma.service";
import { DepartmentsService } from "./departments.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("DepartmentsService", () => {
  let service: DepartmentsService;

  beforeEach(() => {
    service = new DepartmentsService({} as PrismaService);
  });

  afterEach(() => jest.restoreAllMocks());

  it("forwards the search filter when retrieving departments", async () => {
    const findAll = jest
      .spyOn(DepartmentRepository.prototype, "findAll")
      .mockResolvedValue({
        data: [],
        meta: { totalData: 0, totalPages: 0, currentPage: 1, perPage: 10 },
      });

    await service.findAll(1, 10, { search: "science" });

    expect(findAll).toHaveBeenCalledWith(1, 10, { search: "science" });
  });
});
