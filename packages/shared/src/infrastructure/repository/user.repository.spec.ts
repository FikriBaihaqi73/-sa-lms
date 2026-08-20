import type { PrismaClient } from "#generated/client";
import { userSelect, userWithPasswordSelect } from "#selects/user.select";
import { UserRepository } from "./user.repository";

describe("UserRepository", () => {
  let repository: UserRepository;
  let mockPrisma: {
    users: {
      create: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
  };

  const mockUserEntity = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    role_id: "223e4567-e89b-12d3-a456-426614174001",
    username: "john_doe",
    is_active: true,
    last_login: null,
    created_at: new Date("2026-01-01T00:00:00.000Z"),
    updated_at: new Date("2026-01-01T00:00:00.000Z"),
    deleted_at: null,
  };

  beforeEach(() => {
    mockPrisma = {
      users: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
    };
    repository = new UserRepository(mockPrisma as unknown as PrismaClient);
  });

  describe("create", () => {
    it("should create a user successfully with default is_active", async () => {
      mockPrisma.users.create.mockResolvedValue(mockUserEntity);

      const input = {
        role_id: "223e4567-e89b-12d3-a456-426614174001",
        username: "john_doe",
        password: "hashedpassword123",
      };

      const result = await repository.create(input);

      expect(mockPrisma.users.create).toHaveBeenCalledWith({
        data: {
          role_id: input.role_id,
          username: input.username,
          password: input.password,
        },
        select: userSelect,
      });
      expect(result).toEqual(mockUserEntity);
    });

    it("should create a user with specified is_active", async () => {
      mockPrisma.users.create.mockResolvedValue({
        ...mockUserEntity,
        is_active: false,
      });

      const input = {
        role_id: "223e4567-e89b-12d3-a456-426614174001",
        username: "jane_doe",
        password: "hashedpassword123",
        is_active: false,
      };

      const result = await repository.create(input);

      expect(mockPrisma.users.create).toHaveBeenCalledWith({
        data: {
          role_id: input.role_id,
          username: input.username,
          password: input.password,
          is_active: false,
        },
        select: userSelect,
      });
      expect(result.is_active).toBe(false);
    });
  });

  describe("findById", () => {
    it("should find an active user by id", async () => {
      mockPrisma.users.findFirst.mockResolvedValue(mockUserEntity);

      const result = await repository.findById(mockUserEntity.id);

      expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({
        where: {
          id: mockUserEntity.id,
          deleted_at: null,
        },
        select: userSelect,
      });
      expect(result).toEqual(mockUserEntity);
    });

    it("should return null if user is not found or soft-deleted", async () => {
      mockPrisma.users.findFirst.mockResolvedValue(null);

      const result = await repository.findById("non-existent-id");

      expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({
        where: {
          id: "non-existent-id",
          deleted_at: null,
        },
        select: userSelect,
      });
      expect(result).toBeNull();
    });
  });

  describe("findByUsername", () => {
    it("should find an active user by username", async () => {
      mockPrisma.users.findFirst.mockResolvedValue(mockUserEntity);

      const result = await repository.findByUsername("john_doe");

      expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({
        where: {
          username: "john_doe",
          deleted_at: null,
        },
        select: userSelect,
      });
      expect(result).toEqual(mockUserEntity);
    });

    it("should return null if username not found", async () => {
      mockPrisma.users.findFirst.mockResolvedValue(null);

      const result = await repository.findByUsername("unknown_user");

      expect(result).toBeNull();
    });
  });

  describe("findByRoleId", () => {
    it("should return users for a specific role", async () => {
      mockPrisma.users.findMany.mockResolvedValue([mockUserEntity]);

      const result = await repository.findByRoleId(mockUserEntity.role_id);

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: {
          role_id: mockUserEntity.role_id,
          deleted_at: null,
        },
        select: userSelect,
      });
      expect(result).toEqual([mockUserEntity]);
    });

    it("should return empty array if no users found with given role", async () => {
      mockPrisma.users.findMany.mockResolvedValue([]);

      const result = await repository.findByRoleId("empty-role-id");

      expect(result).toEqual([]);
    });
  });

  describe("findAll", () => {
    it("should return all active users", async () => {
      mockPrisma.users.findMany.mockResolvedValue([mockUserEntity]);

      const result = await repository.findAll();

      expect(mockPrisma.users.findMany).toHaveBeenCalledWith({
        where: {
          deleted_at: null,
        },
        select: userSelect,
      });
      expect(result).toEqual([mockUserEntity]);
    });
  });

  describe("update", () => {
    it("should update user properties selectively", async () => {
      const updatedEntity = {
        ...mockUserEntity,
        username: "john_updated",
        is_active: false,
      };
      mockPrisma.users.update.mockResolvedValue(updatedEntity);

      const result = await repository.update(mockUserEntity.id, {
        username: "john_updated",
        is_active: false,
      });

      expect(mockPrisma.users.update).toHaveBeenCalledWith({
        where: {
          id: mockUserEntity.id,
        },
        data: {
          username: "john_updated",
          is_active: false,
        },
        select: userSelect,
      });
      expect(result).toEqual(updatedEntity);
    });

    it("should update all fields when provided", async () => {
      const now = new Date();
      const input = {
        role_id: "new-role-id",
        username: "new_username",
        password: "newpassword",
        is_active: true,
        last_login: now,
      };
      mockPrisma.users.update.mockResolvedValue(mockUserEntity);

      await repository.update(mockUserEntity.id, input);

      expect(mockPrisma.users.update).toHaveBeenCalledWith({
        where: {
          id: mockUserEntity.id,
        },
        data: {
          role_id: input.role_id,
          username: input.username,
          password: input.password,
          is_active: input.is_active,
          last_login: input.last_login,
        },
        select: userSelect,
      });
    });
  });

  describe("delete", () => {
    it("should soft delete a user by setting deleted_at", async () => {
      mockPrisma.users.update.mockResolvedValue({
        ...mockUserEntity,
        deleted_at: expect.any(Date),
      });

      const result = await repository.delete(mockUserEntity.id);

      expect(mockPrisma.users.update).toHaveBeenCalledWith({
        where: {
          id: mockUserEntity.id,
        },
        data: {
          deleted_at: expect.any(Date),
        },
        select: userSelect,
      });
      expect(result).toBeDefined();
    });
  });

  describe("findByUsernameWithPassword", () => {
    it("should return user with password for authentication", async () => {
      const mockUserWithPassword = {
        ...mockUserEntity,
        password: "hashed_secret_password",
      };
      mockPrisma.users.findFirst.mockResolvedValue(mockUserWithPassword);

      const result = await repository.findByUsernameWithPassword("john_doe");

      expect(mockPrisma.users.findFirst).toHaveBeenCalledWith({
        where: {
          username: "john_doe",
          deleted_at: null,
        },
        select: userWithPasswordSelect,
      });
      expect(result).toEqual(mockUserWithPassword);
    });

    it("should return null if user does not exist", async () => {
      mockPrisma.users.findFirst.mockResolvedValue(null);

      const result =
        await repository.findByUsernameWithPassword("non_existent");

      expect(result).toBeNull();
    });
  });

  describe("updateLastLogin", () => {
    it("should update last_login timestamp", async () => {
      const updatedEntity = {
        ...mockUserEntity,
        last_login: new Date(),
      };
      mockPrisma.users.update.mockResolvedValue(updatedEntity);

      const result = await repository.updateLastLogin(mockUserEntity.id);

      expect(mockPrisma.users.update).toHaveBeenCalledWith({
        where: {
          id: mockUserEntity.id,
        },
        data: {
          last_login: expect.any(Date),
        },
        select: userSelect,
      });
      expect(result).toEqual(updatedEntity);
    });
  });
});
