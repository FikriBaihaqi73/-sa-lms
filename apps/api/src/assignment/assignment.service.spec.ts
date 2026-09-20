import { NotFoundException } from "@nestjs/common";
import { AssignmentRepository } from "@repo/shared/infrastructure/repository/assignment.repository";
import { AssignmentTypeRepository } from "@repo/shared/infrastructure/repository/assignment-type.repository";
import { ModuleRepository } from "@repo/shared/infrastructure/repository/module.repository";
import type {
  CreateAssignmentDto,
  UpdateAssignmentDto,
} from "@repo/shared/schemas/assignment.schema";
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

  it("throws when an assignment cannot be found", async () => {
    jest
      .spyOn(AssignmentRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-assignment")).rejects.toEqual(
      expect.objectContaining({ message: "Assignment not found" }),
    );
  });

  it("validates changed relations before updating an assignment", async () => {
    jest
      .spyOn(AssignmentRepository.prototype, "findById")
      .mockResolvedValue({ id: "assignment-1" } as never);
    jest
      .spyOn(ModuleRepository.prototype, "findById")
      .mockResolvedValue({ id: "module-2" } as never);
    jest
      .spyOn(AssignmentTypeRepository.prototype, "findById")
      .mockResolvedValue({ id: "type-2" } as never);
    const update = jest
      .spyOn(AssignmentRepository.prototype, "update")
      .mockResolvedValue({ id: "assignment-1" } as never);

    await service.update("assignment-1", {
      module_id: "module-2",
      assignment_type_id: "type-2",
      due_date: null,
      max_score: 90,
    } as UpdateAssignmentDto);

    expect(update).toHaveBeenCalledWith("assignment-1", {
      module_id: "module-2",
      assignment_type_id: "type-2",
      due_date: null,
      max_score: 90,
    });
  });

  it("does not delete an assignment that is already missing", async () => {
    jest
      .spyOn(AssignmentRepository.prototype, "findById")
      .mockResolvedValue(null);
    const remove = jest.spyOn(AssignmentRepository.prototype, "delete");

    await expect(service.remove("missing-assignment")).rejects.toEqual(
      expect.objectContaining({ message: "Assignment not found" }),
    );
    expect(remove).not.toHaveBeenCalled();
  });
});
