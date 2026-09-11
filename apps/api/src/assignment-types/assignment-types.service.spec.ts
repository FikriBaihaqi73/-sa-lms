import { ConflictException, NotFoundException } from "@nestjs/common";
import { AssignmentTypeRepository } from "@repo/shared/infrastructure/repository/assignment-type.repository";
import type {
  CreateAssignmentTypeDto,
  UpdateAssignmentTypeDto,
} from "@repo/shared/schemas/assignment-type.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { AssignmentTypesService } from "./assignment-types.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("AssignmentTypesService", () => {
  let service: AssignmentTypesService;

  beforeEach(() => {
    service = new AssignmentTypesService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create an assignment type", async () => {
      const dto = { name: "Exam", description: "Final exam" };
      const expected = {
        id: "1",
        ...dto,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(AssignmentTypeRepository.prototype, "findByName")
        .mockResolvedValue(null);
      const create = jest
        .spyOn(AssignmentTypeRepository.prototype, "create")
        .mockResolvedValue(expected);

      const result = await service.create(dto);
      expect(result).toEqual(expected);
      expect(create).toHaveBeenCalledWith(dto);
    });

    it("should throw ConflictException when name already exists", async () => {
      jest
        .spyOn(AssignmentTypeRepository.prototype, "findByName")
        .mockResolvedValue({ id: "existing-id" } as never);

      await expect(
        service.create({ name: "Exam" } as CreateAssignmentTypeDto),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe("findAll", () => {
    it("should return an array of assignment types", async () => {
      const expected = [
        {
          id: "1",
          name: "Exam",
          description: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      const findAll = jest
        .spyOn(AssignmentTypeRepository.prototype, "findAll")
        .mockResolvedValue(expected);

      const result = await service.findAll();
      expect(result).toEqual(expected);
      expect(findAll).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return an assignment type if found", async () => {
      const expected = {
        id: "1",
        name: "Exam",
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const findById = jest
        .spyOn(AssignmentTypeRepository.prototype, "findById")
        .mockResolvedValue(expected);

      const result = await service.findOne("1");
      expect(result).toEqual(expected);
      expect(findById).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundException if not found", async () => {
      const findById = jest
        .spyOn(AssignmentTypeRepository.prototype, "findById")
        .mockResolvedValue(null);

      await expect(service.findOne("1")).rejects.toThrow(NotFoundException);
      expect(findById).toHaveBeenCalledWith("1");
    });
  });

  describe("update", () => {
    it("should update an assignment type", async () => {
      const existing = {
        id: "1",
        name: "Exam",
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const updateDto = { name: "Quiz" };
      const expected = { ...existing, ...updateDto };

      jest
        .spyOn(AssignmentTypeRepository.prototype, "findById")
        .mockResolvedValue(existing);
      jest
        .spyOn(AssignmentTypeRepository.prototype, "findByName")
        .mockResolvedValue(null);
      const update = jest
        .spyOn(AssignmentTypeRepository.prototype, "update")
        .mockResolvedValue(expected);

      const result = await service.update("1", updateDto);
      expect(result).toEqual(expected);
      expect(update).toHaveBeenCalledWith("1", updateDto);
    });

    it("should omit undefined fields from the repository update payload", async () => {
      const existing = {
        id: "1",
        name: "Exam",
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(AssignmentTypeRepository.prototype, "findById")
        .mockResolvedValue(existing);
      const update = jest
        .spyOn(AssignmentTypeRepository.prototype, "update")
        .mockResolvedValue(existing);

      await service.update("1", { name: undefined });

      expect(update).toHaveBeenCalledWith("1", {});
    });

    it("should throw NotFoundException if assignment type not found on update", async () => {
      jest
        .spyOn(AssignmentTypeRepository.prototype, "findById")
        .mockResolvedValue(null);

      await expect(service.update("1", { name: "Quiz" })).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should throw ConflictException when another assignment type uses the name", async () => {
      jest
        .spyOn(AssignmentTypeRepository.prototype, "findById")
        .mockResolvedValue({ id: "1" } as never);
      jest
        .spyOn(AssignmentTypeRepository.prototype, "findByName")
        .mockResolvedValue({ id: "2" } as never);

      await expect(
        service.update("1", { name: "Quiz" } as UpdateAssignmentTypeDto),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it("should allow keeping the same name on update", async () => {
      const existing = {
        id: "1",
        name: "Exam",
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(AssignmentTypeRepository.prototype, "findById")
        .mockResolvedValue(existing);
      jest
        .spyOn(AssignmentTypeRepository.prototype, "findByName")
        .mockResolvedValue(existing);
      const update = jest
        .spyOn(AssignmentTypeRepository.prototype, "update")
        .mockResolvedValue(existing);

      await expect(service.update("1", { name: "Exam" })).resolves.toEqual(
        existing,
      );
      expect(update).toHaveBeenCalledWith("1", { name: "Exam" });
    });
  });

  describe("remove", () => {
    it("should delete an assignment type", async () => {
      const existing = {
        id: "1",
        name: "Exam",
        description: null,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(AssignmentTypeRepository.prototype, "findById")
        .mockResolvedValue(existing);
      const remove = jest
        .spyOn(AssignmentTypeRepository.prototype, "delete")
        .mockResolvedValue(existing);

      const result = await service.remove("1");
      expect(result).toEqual(existing);
      expect(remove).toHaveBeenCalledWith("1");
    });

    it("should throw NotFoundException if assignment type not found on remove", async () => {
      jest
        .spyOn(AssignmentTypeRepository.prototype, "findById")
        .mockResolvedValue(null);

      await expect(service.remove("1")).rejects.toThrow(NotFoundException);
    });
  });
});
