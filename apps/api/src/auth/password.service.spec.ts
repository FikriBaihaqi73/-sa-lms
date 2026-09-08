import { describe, expect, it } from "@jest/globals";
import { PasswordService } from "./password.service";

describe("PasswordService", () => {
  it("hashes passwords with a versioned scrypt representation", async () => {
    const service = new PasswordService();

    const hash = await service.hash("VeryStrong#Password1");

    const [algorithm, cost, blockSize, parallelization, salt, derivedKey] =
      hash.split("$");
    expect(algorithm).toBe("scrypt");
    expect(cost).toBe("16384");
    expect(blockSize).toBe("8");
    expect(parallelization).toBe("1");
    expect(salt).toBeTruthy();
    expect(derivedKey).toBeTruthy();
    expect(hash).not.toContain("VeryStrong#Password1");
  });

  it("uses a distinct random salt for each hash", async () => {
    const service = new PasswordService();

    const [firstHash, secondHash] = await Promise.all([
      service.hash("VeryStrong#Password1"),
      service.hash("VeryStrong#Password1"),
    ]);

    expect(firstHash).not.toBe(secondHash);
  });
});
