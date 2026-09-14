import { ConflictException, NotFoundException } from "@nestjs/common";
import { UserRepository } from "@repo/shared/infrastructure/repository/user.repository";
import type {
  CreateUserDto,
  UpdateUserDto,
} from "@repo/shared/schemas/user.schema";
import type { PrismaService } from "../prisma/prisma.service";
import { UserService } from "./user.service";

jest.mock("../prisma/prisma.service", () => ({
  PrismaService: class PrismaService {},
}));

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    service = new UserService({} as PrismaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("rejects a missing user", async () => {
    jest
      .spyOn(UserRepository.prototype, "findById")
      .mockResolvedValue(null);

    await expect(service.findOne("missing-id")).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects duplicate emails", async () => {
    jest
      .spyOn(UserRepository.prototype, "findByEmail")
      .mockResolvedValue({ id: "existing-id" } as never);

    await expect(
      service.create({
        email: "used@example.com",
        password: "password123",
      } as CreateUserDto),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it("hashes the password before creating a user", async () => {
    jest
      .spyOn(UserRepository.prototype, "findByEmail")
      .mockResolvedValue(null);
    const create = jest
      .spyOn(UserRepository.prototype, "create")
      .mockResolvedValue({ id: "user-id" } as never);

    await service.create({
      email: "USER@EXAMPLE.COM",
      password: "password123",
    } as CreateUserDto);

    expect(create).toHaveBeenCalledWith({
      email: "user@example.com",
      password: expect.not.stringMatching(/^password123$/),
    });
  });

  it("updates a user and soft-deletes it", async () => {
    jest
      .spyOn(UserRepository.prototype, "findById")
      .mockResolvedValue({ id: "user-id" } as never);
    const update = jest
      .spyOn(UserRepository.prototype, "update")
      .mockResolvedValue({ id: "user-id" } as never);
    const remove = jest
      .spyOn(UserRepository.prototype, "delete")
      .mockResolvedValue({ id: "user-id" } as never);

    await service.update("user-id", {
      is_active: false,
    } as UpdateUserDto);
    await expect(service.remove("user-id")).resolves.toEqual({
      success: true,
      id: "user-id",
    });
    expect(update).toHaveBeenCalledWith("user-id", { is_active: false });
    expect(remove).toHaveBeenCalledWith("user-id");
  });
});
