import {
  CreateRoleDto,
  CreateRoleSchema,
  UpdateRoleDto,
  UpdateRoleSchema,
} from "./role.schema";

describe("Role Schemas and DTOs", () => {
  describe("CreateRoleSchema", () => {
    it("should validate a valid role input with name and description", () => {
      const input = {
        name: "Admin",
        description: "Administrator with full system access",
      };

      const parsed = CreateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data).toEqual(input);
      }
    });

    it("should validate a valid role input with only name", () => {
      const input = {
        name: "Teacher",
      };

      const parsed = CreateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.name).toBe("Teacher");
        expect(parsed.data.description).toBeUndefined();
      }
    });

    it("should allow null for optional description", () => {
      const input = {
        name: "Student",
        description: null,
      };

      const parsed = CreateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.description).toBeNull();
      }
    });

    it("should fail when name is missing", () => {
      const input = {
        description: "Missing name",
      };

      const parsed = CreateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.path).toContain("name");
      }
    });

    it("should fail when name is an empty string", () => {
      const input = {
        name: "",
      };

      const parsed = CreateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe("Role name is required");
      }
    });

    it("should fail when name exceeds 255 characters", () => {
      const input = {
        name: "a".repeat(256),
      };

      const parsed = CreateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "Role name must not exceed 255 characters",
        );
      }
    });

    it("should fail when description exceeds 1000 characters", () => {
      const input = {
        name: "Valid Role",
        description: "a".repeat(1001),
      };

      const parsed = CreateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "Description must not exceed 1000 characters",
        );
      }
    });
  });

  describe("UpdateRoleSchema", () => {
    it("should validate an empty update object", () => {
      const input = {};

      const parsed = UpdateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(true);
    });

    it("should validate partial update with name only", () => {
      const input = {
        name: "SuperAdmin",
      };

      const parsed = UpdateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.name).toBe("SuperAdmin");
      }
    });

    it("should validate partial update with description only", () => {
      const input = {
        description: "Updated description",
      };

      const parsed = UpdateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.description).toBe("Updated description");
      }
    });

    it("should fail when name is empty string in update", () => {
      const input = {
        name: "",
      };

      const parsed = UpdateRoleSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "Role name must not be empty",
        );
      }
    });
  });

  describe("DTO Classes", () => {
    it("should instantiate CreateRoleDto and UpdateRoleDto", () => {
      expect(CreateRoleDto).toBeDefined();
      expect(UpdateRoleDto).toBeDefined();
    });
  });
});
