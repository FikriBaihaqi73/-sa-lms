import { describe, expect, it } from "@jest/globals";
import { RegisterSchema } from "./auth.schema";

const registration = {
  username: "new.user",
  email: "new.user@example.com",
};

describe("RegisterSchema", () => {
  it("accepts any password with at least eight characters", () => {
    const result = RegisterSchema.safeParse({
      ...registration,
      password: "password",
    });

    expect(result.success).toBe(true);
  });

  it("rejects passwords shorter than eight characters", () => {
    const result = RegisterSchema.safeParse({
      ...registration,
      password: "Abcde1!",
    });

    expect(result.success).toBe(false);
  });
});
