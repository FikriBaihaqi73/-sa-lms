import { NotFoundException } from "@nestjs/common";
import { AssignmentRepository } from "@repo/shared/infrastructure/repository/assignment.repository";
import { AssignmentTypeRepository } from "@repo/shared/infrastructure/repository/assignment-type.repository";
import { ModuleRepository } from "@repo/shared/infrastructure/repository/module.repository";
import type { CreateAssignmentDto } from "@repo/shared/schemas/assignment.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { AssignmentService } from "./assignment.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("AssignmentService", () => {
  let service: AssignmentService;

  beforeEach(() => {
    service = new AssignmentService({} as PrismaService);
  });

  afterEach(() => jest.restoreAllMocks());

  it("forwards pagination and search to the repository", async () => {
    const findAll = jest
      .spyOn(AssignmentRepository.prototype, "findAll")
      .mockResolvedValue({
        data: [],
        meta: { totalData: 0, totalPages: 0, currentPage: 1, perPage: 10 },
      });

    await service.findAll(1, 10, "algebra");

    expect(findAll).toHaveBeenCalledWith(1, 10, { search: "algebra" });
  });

  it("rejects an assignment with a missing module", async () => {
    jest.spyOn(ModuleRepository.prototype, "findById").mockResolvedValue(null);

    await expect(
      service.create({
        module_id: "module-1",
        assignment_type_id: "type-1",
        title: "Algebra quiz",
      } as CreateAssignmentDto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("validates relations before creating an assignment", async () => {
    jest
      .spyOn(ModuleRepository.prototype, "findById")
      .mockResolvedValue({ id: "module-1" } as never);
    jest
      .spyOn(AssignmentTypeRepository.prototype, "findById")
      .mockResolvedValue({ id: "type-1" } as never);
    const create = jest
      .spyOn(AssignmentRepository.prototype, "create")
      .mockResolvedValue({ id: "assignment-1" } as never);

    await service.create({
      module_id: "module-1",
      assignment_type_id: "type-1",
      title: "Algebra quiz",
    } as CreateAssignmentDto);

    expect(create).toHaveBeenCalledWith({
      module_id: "module-1",
      assignment_type_id: "type-1",
      title: "Algebra quiz",
    });
  });
});
