import {
  CreatePermissionDto,
  CreatePermissionSchema,
  UpdatePermissionDto,
  UpdatePermissionSchema,
} from "./permission.schema";

describe("Permission Schemas and DTOs", () => {
  describe("CreatePermissionSchema", () => {
    it("should validate a valid permission with all fields", () => {
      const input = {
        name: "users.create",
        module: "users",
        description: "Allows creating new users",
      };

      const parsed = CreatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data).toEqual(input);
      }
    });

    it("should validate without optional description", () => {
      const input = {
        name: "classes.read",
        module: "classes",
      };

      const parsed = CreatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.name).toBe("classes.read");
        expect(parsed.data.module).toBe("classes");
        expect(parsed.data.description).toBeUndefined();
      }
    });

    it("should allow null for description", () => {
      const input = {
        name: "grades.update",
        module: "grades",
        description: null,
      };

      const parsed = CreatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.description).toBeNull();
      }
    });

    it("should fail when name is missing", () => {
      const input = {
        module: "users",
      };

      const parsed = CreatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.path).toContain("name");
      }
    });

    it("should fail when module is missing", () => {
      const input = {
        name: "users.create",
      };

      const parsed = CreatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.path).toContain("module");
      }
    });

    it("should fail when name is empty", () => {
      const input = {
        name: "",
        module: "users",
      };

      const parsed = CreatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "Permission name is required",
        );
      }
    });

    it("should fail when module is empty", () => {
      const input = {
        name: "users.create",
        module: "",
      };

      const parsed = CreatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe("Module name is required");
      }
    });

    it("should fail when name exceeds 255 chars", () => {
      const input = {
        name: "a".repeat(256),
        module: "users",
      };

      const parsed = CreatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "Permission name must not exceed 255 characters",
        );
      }
    });

    it("should fail when description exceeds 1000 chars", () => {
      const input = {
        name: "users.create",
        module: "users",
        description: "a".repeat(1001),
      };

      const parsed = CreatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "Description must not exceed 1000 characters",
        );
      }
    });
  });

  describe("UpdatePermissionSchema", () => {
    it("should validate an empty update object", () => {
      const input = {};

      const parsed = UpdatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
    });

    it("should validate partial update with name only", () => {
      const input = {
        name: "users.manage",
      };

      const parsed = UpdatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.name).toBe("users.manage");
      }
    });

    it("should validate partial update with module only", () => {
      const input = {
        module: "auth",
      };

      const parsed = UpdatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.module).toBe("auth");
      }
    });

    it("should fail when empty name is passed in update", () => {
      const input = {
        name: "",
      };

      const parsed = UpdatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "Permission name must not be empty",
        );
      }
    });

    it("should fail when empty module is passed in update", () => {
      const input = {
        module: "",
      };

      const parsed = UpdatePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "Module name must not be empty",
        );
      }
    });
  });

  describe("DTO Classes", () => {
    it("should instantiate CreatePermissionDto and UpdatePermissionDto", () => {
      expect(CreatePermissionDto).toBeDefined();
      expect(UpdatePermissionDto).toBeDefined();
    });
  });
});
