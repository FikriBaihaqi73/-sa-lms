import type { PrismaClient } from "#generated/client";
import { assignmentTypeSelect } from "#selects/assignment-type.select";
import { AssignmentTypeRepository } from "./assignment-type.repository";

describe("AssignmentTypeRepository", () => {
  const assignmentTypes = {
    create: jest.fn(),
    findFirst: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  };

  const prisma = {
    assignmentTypes,
  } as unknown as PrismaClient;

  let repository: AssignmentTypeRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new AssignmentTypeRepository(prisma);
  });

  it("creates an assignment type with null description when omitted", async () => {
    const expected = {
      id: "assignment-type-id",
      name: "Exam",
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    assignmentTypes.create.mockResolvedValue(expected);

    await expect(repository.create({ name: "Exam" })).resolves.toEqual(
      expected,
    );
    expect(assignmentTypes.create).toHaveBeenCalledWith({
      data: {
        name: "Exam",
        description: null,
      },
      select: assignmentTypeSelect,
    });
  });

  it("finds one active assignment type by id", async () => {
    assignmentTypes.findFirst.mockResolvedValue(null);

    await expect(repository.findById("assignment-type-id")).resolves.toBeNull();
    expect(assignmentTypes.findFirst).toHaveBeenCalledWith({
      where: {
        id: "assignment-type-id",
        deleted_at: null,
      },
      select: assignmentTypeSelect,
    });
  });

  it("finds one active assignment type by name", async () => {
    assignmentTypes.findFirst.mockResolvedValue(null);

    await expect(repository.findByName("Exam")).resolves.toBeNull();
    expect(assignmentTypes.findFirst).toHaveBeenCalledWith({
      where: {
        name: "Exam",
        deleted_at: null,
      },
      select: assignmentTypeSelect,
    });
  });

  it("lists only active assignment types", async () => {
    assignmentTypes.findMany.mockResolvedValue([]);

    await expect(repository.findAll()).resolves.toEqual([]);
    expect(assignmentTypes.findMany).toHaveBeenCalledWith({
      where: {
        deleted_at: null,
      },
      select: assignmentTypeSelect,
    });
  });

  it("updates only provided fields", async () => {
    const expected = {
      id: "assignment-type-id",
      name: "Quiz",
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    assignmentTypes.update.mockResolvedValue(expected);

    await expect(
      repository.update("assignment-type-id", { name: "Quiz" }),
    ).resolves.toEqual(expected);
    expect(assignmentTypes.update).toHaveBeenCalledWith({
      where: {
        id: "assignment-type-id",
      },
      data: {
        name: "Quiz",
      },
      select: assignmentTypeSelect,
    });
  });

  it("soft deletes an assignment type", async () => {
    const expected = {
      id: "assignment-type-id",
      name: "Exam",
      description: null,
      created_at: new Date(),
      updated_at: new Date(),
    };
    assignmentTypes.update.mockResolvedValue(expected);

    await expect(repository.delete("assignment-type-id")).resolves.toEqual(
      expected,
    );
    expect(assignmentTypes.update).toHaveBeenCalledWith({
      where: {
        id: "assignment-type-id",
      },
      data: {
        deleted_at: expect.any(Date) as Date,
      },
      select: assignmentTypeSelect,
    });
  });
});
