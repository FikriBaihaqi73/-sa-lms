import { NotFoundException } from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import type { CreateUserDto } from "@repo/shared/schemas/user.schema";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "./user.service";

jest.mock("@repo/shared/infrastructure/database/client", () => ({
  getPrisma: jest.fn(),
}));

describe("UserService", () => {
  let service: UserService;

  const mockUser = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    role_id: "223e4567-e89b-12d3-a456-426614174001",
    username: "john_doe",
    is_active: true,
    last_login: null,
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
  };

  const mockPrismaClient = {
    client: {
      users: {
        findMany: jest.fn().mockResolvedValue([mockUser]),
        findFirst: jest.fn().mockResolvedValue(mockUser),
        findUnique: jest.fn().mockResolvedValue(mockUser),
        create: jest.fn().mockResolvedValue(mockUser),
        update: jest
          .fn()
          .mockResolvedValue({ ...mockUser, username: "updated_john" }),
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaClient,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(mockPrismaClient.client.users.findMany).toHaveBeenCalled();
    });
  });

  describe("findOne", () => {
    it("should return a single user by ID", async () => {
      const result = await service.findOne(mockUser.id);
      expect(result).toEqual(mockUser);
      expect(mockPrismaClient.client.users.findFirst).toHaveBeenCalledWith({
        where: { id: mockUser.id, deleted_at: null },
        select: expect.any(Object),
      });
    });

    it("should throw NotFoundException if user not found", async () => {
      jest
        .spyOn(mockPrismaClient.client.users, "findFirst")
        .mockResolvedValueOnce(null);

      await expect(service.findOne("non-existent-id")).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      const dto: CreateUserDto = {
        role_id: "223e4567-e89b-12d3-a456-426614174001",
        username: "john_doe",
        password: "password123",
        is_active: true,
      };

      const result = await service.create(dto);
      expect(result).toEqual(mockUser);
      expect(mockPrismaClient.client.users.create).toHaveBeenCalled();
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      jest
        .spyOn(mockPrismaClient.client.users, "findFirst")
        .mockResolvedValueOnce(mockUser);

      const result = await service.update(mockUser.id, {
        username: "updated_john",
      });

      expect(result).toEqual({ ...mockUser, username: "updated_john" });
    });
  });

  describe("remove", () => {
    it("should delete a user", async () => {
      jest
        .spyOn(mockPrismaClient.client.users, "findFirst")
        .mockResolvedValueOnce(mockUser);

      const result = await service.remove(mockUser.id);

      expect(result).toEqual({ success: true, id: mockUser.id });
    });
  });
});
