import {
  CreateDepartmentDto,
  CreateDepartmentSchema,
  UpdateDepartmentDto,
  UpdateDepartmentSchema,
} from "./department.schema";

describe("Department Schemas", () => {
  describe("CreateDepartmentSchema", () => {
    it("should successfully validate a valid department payload", () => {
      const validPayload = {
        name: "Computer Science",
        code: "CS-01",
      };

      const result = CreateDepartmentSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validPayload);
      }
    });

    it("should fail validation when name is missing or empty", () => {
      const invalidPayload = {
        name: "",
        code: "CS-01",
      };

      const result = CreateDepartmentSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain("name");
      }
    });

    it("should fail validation when code is missing or empty", () => {
      const invalidPayload = {
        name: "Computer Science",
        code: "",
      };

      const result = CreateDepartmentSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain("code");
      }
    });

    it("should fail validation when name exceeds maximum length", () => {
      const invalidPayload = {
        name: "a".repeat(256),
        code: "CS-01",
      };

      const result = CreateDepartmentSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain("name");
      }
    });

    it("should fail validation when code exceeds maximum length", () => {
      const invalidPayload = {
        name: "Computer Science",
        code: "a".repeat(51),
      };

      const result = CreateDepartmentSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain("code");
      }
    });
  });

  describe("UpdateDepartmentSchema", () => {
    it("should validate partial updates with only name", () => {
      const payload = {
        name: "Software Engineering",
      };

      const result = UpdateDepartmentSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should validate partial updates with only code", () => {
      const payload = {
        code: "SE-02",
      };

      const result = UpdateDepartmentSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should validate an empty update object", () => {
      const result = UpdateDepartmentSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("DTO Classes", () => {
    it("should instantiate CreateDepartmentDto correctly", () => {
      const dto = new CreateDepartmentDto();
      expect(dto).toBeDefined();
    });

    it("should instantiate UpdateDepartmentDto correctly", () => {
      const dto = new UpdateDepartmentDto();
      expect(dto).toBeDefined();
    });
  });
});
