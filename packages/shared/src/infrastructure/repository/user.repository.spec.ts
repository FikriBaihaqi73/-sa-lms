import { describe, expect, it, jest } from "@jest/globals";
import type { PrismaClient } from "#generated/client";
import { UserRepository } from "./user.repository";

describe("UserRepository", () => {
  it("persists the email address when creating a user", async () => {
    const create = jest.fn().mockResolvedValue({ id: "user-id" });
    const repository = new UserRepository({
      users: { create },
    } as unknown as PrismaClient);

    await repository.create({
      role_id: "role-id",
      username: "new.user",
      email: "new.user@example.com",
      password: "hashed-password",
    });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: "new.user@example.com" }),
      }),
    );
  });

  it("only returns active records when finding by email", async () => {
    const findFirst = jest.fn().mockResolvedValue(null);
    const repository = new UserRepository({
      users: { findFirst },
    } as unknown as PrismaClient);

    await repository.findByEmail("new.user@example.com");

    expect(findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: "new.user@example.com", deleted_at: null },
      }),
    );
  });
});
