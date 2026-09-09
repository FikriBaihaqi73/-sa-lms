import { ConflictException, NotFoundException } from "@nestjs/common";
import { PermissionRepository } from "@repo/shared/infrastructure/repository/permission.repository";
import type {
  CreatePermissionDto,
  UpdatePermissionDto,
} from "@repo/shared/schemas/permission.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { PermissionService } from "./permission.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("PermissionService", () => {
  let service: PermissionService;

  beforeEach(() => {
    service = new PermissionService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns all active permissions", async () => {
    const permissions = [{ id: "permission-id" }];
    jest
      .spyOn(PermissionRepository.prototype, "findAll")
      .mockResolvedValue(permissions as never);

    await expect(service.findAll()).resolves.toBe(permissions);
  });

  it("rejects a missing permission", async () => {
    jest
      .spyOn(PermissionRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects duplicate permission names", async () => {
    jest
      .spyOn(PermissionRepository.prototype, "findByName")
      .mockResolvedValue({ id: "existing-id" } as never);

    await expect(
      service.create({
        name: "users.read",
        module: "users",
      } as CreatePermissionDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("updates and soft-deletes an existing permission", async () => {
    jest
      .spyOn(PermissionRepository.prototype, "findById")
      .mockResolvedValue({ id: "permission-id" } as never);
    const update = jest
      .spyOn(PermissionRepository.prototype, "update")
      .mockResolvedValue({ id: "permission-id" } as never);
    const remove = jest
      .spyOn(PermissionRepository.prototype, "delete")
      .mockResolvedValue({ id: "permission-id" } as never);

    await service.update("permission-id", {
      module: "accounts",
    } as UpdatePermissionDto);
    await expect(service.remove("permission-id")).resolves.toEqual({
      success: true,
      id: "permission-id",
    });
    expect(update).toHaveBeenCalledWith("permission-id", {
      module: "accounts",
    });
    expect(remove).toHaveBeenCalledWith("permission-id");
  });
});
