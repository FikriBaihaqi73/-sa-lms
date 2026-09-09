import { ConflictException, NotFoundException } from "@nestjs/common";
import { PermissionRepository } from "@repo/shared/infrastructure/repository/permission.repository";
import { RoleRepository } from "@repo/shared/infrastructure/repository/role.repository";
import { RolePermissionRepository } from "@repo/shared/infrastructure/repository/role-permission.repository";
import type {
  CreateRolePermissionDto,
  UpdateRolePermissionDto,
} from "@repo/shared/schemas/role-permission.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { RolePermissionService } from "./role-permission.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("RolePermissionService", () => {
  let service: RolePermissionService;

  beforeEach(() => {
    service = new RolePermissionService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rejects an assignment with a missing role", async () => {
    jest.spyOn(RoleRepository.prototype, "findById").mockResolvedValue(null);

    await expect(
      service.create({
        roleId: "role-id",
        permissionId: "permission-id",
      } as CreateRolePermissionDto),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("rejects duplicate active assignments", async () => {
    jest
      .spyOn(RoleRepository.prototype, "findById")
      .mockResolvedValue({ id: "role-id" } as never);
    jest
      .spyOn(PermissionRepository.prototype, "findById")
      .mockResolvedValue({ id: "permission-id" } as never);
    jest
      .spyOn(RolePermissionRepository.prototype, "findByRoleAndPermission")
      .mockResolvedValue({ id: "existing-id" } as never);

    await expect(
      service.create({
        roleId: "role-id",
        permissionId: "permission-id",
      } as CreateRolePermissionDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("updates and soft-deletes an assignment", async () => {
    jest
      .spyOn(RolePermissionRepository.prototype, "findById")
      .mockResolvedValue({
        id: "assignment-id",
        roleId: "role-id",
        permissionId: "permission-id",
      } as never);
    jest
      .spyOn(RoleRepository.prototype, "findById")
      .mockResolvedValue({ id: "role-id" } as never);
    jest
      .spyOn(PermissionRepository.prototype, "findById")
      .mockResolvedValue({ id: "permission-id" } as never);
    jest
      .spyOn(RolePermissionRepository.prototype, "findByRoleAndPermission")
      .mockResolvedValue(null);
    const update = jest
      .spyOn(RolePermissionRepository.prototype, "update")
      .mockResolvedValue({ id: "assignment-id" } as never);
    const remove = jest
      .spyOn(RolePermissionRepository.prototype, "delete")
      .mockResolvedValue({ id: "assignment-id" } as never);

    await service.update("assignment-id", {
      permissionId: "permission-id",
    } as UpdateRolePermissionDto);
    await expect(service.remove("assignment-id")).resolves.toEqual({
      success: true,
      id: "assignment-id",
    });
    expect(update).toHaveBeenCalledWith("assignment-id", {
      permissionId: "permission-id",
    });
    expect(remove).toHaveBeenCalledWith("assignment-id");
  });
});
