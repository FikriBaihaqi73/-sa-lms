import { describe, expect, it, jest } from "@jest/globals";
import type { PrismaClient } from "#generated/client";
import { AuthRepository } from "./auth.repository";

const user = {
  id: "d6b76be2-22e6-42e3-a1bb-50875650ed39",
  role_id: "21db8764-79ad-4c42-a2a4-5f6f219f0f47",
  username: "jane.doe",
  email: "jane.doe@example.com",
  is_active: true,
  last_login: null,
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
};

function createRepository() {
  const prisma = {
    users: {
      findFirst: jest.fn().mockResolvedValue(user),
      create: jest.fn().mockResolvedValue(user),
      update: jest.fn().mockResolvedValue(user),
    },
    role: { findFirst: jest.fn().mockResolvedValue({ id: user.role_id }) },
  } as unknown as PrismaClient;

  return { prisma, repository: new AuthRepository(prisma) };
}

describe("AuthRepository", () => {
  it("finds registration conflicts only among non-deleted users", async () => {
    const { prisma, repository } = createRepository();

    await repository.findUserByUsername("jane.doe");
    await repository.findUserByEmail("jane.doe@example.com");

    expect(prisma.users.findFirst).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: { username: "jane.doe", deleted_at: null },
      }),
    );
    expect(prisma.users.findFirst).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        where: { email: "jane.doe@example.com", deleted_at: null },
      }),
    );
  });

  it("finds an active default role and excludes soft-deleted roles", async () => {
    const { prisma, repository } = createRepository();

    await repository.findDefaultRole("student");

    expect(prisma.role.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: "student", deletedAt: null },
      }),
    );
  });

  it("creates an active account regardless of caller input", async () => {
    const { prisma, repository } = createRepository();

    await repository.createUser({
      role_id: user.role_id,
      username: user.username,
      email: user.email,
      password: "hashed-password",
    });

    expect(prisma.users.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ is_active: true }),
      }),
    );
  });

  it("loads a login user with its password while excluding soft-deleted accounts", async () => {
    const { prisma, repository } = createRepository();

    await repository.findLoginUser(user.username);

    expect(prisma.users.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { username: user.username, deleted_at: null },
        select: expect.objectContaining({ password: true }),
      }),
    );
  });

  it("records the latest login time", async () => {
    const { prisma, repository } = createRepository();

    await repository.updateLastLogin(user.id);

    expect(prisma.users.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: user.id },
        data: expect.objectContaining({ last_login: expect.any(Date) }),
      }),
    );
  });
});
