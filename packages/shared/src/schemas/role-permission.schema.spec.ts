import {
  AssignRolePermissionsDto,
  AssignRolePermissionsSchema,
  CreateRolePermissionDto,
  CreateRolePermissionSchema,
  UpdateRolePermissionDto,
  UpdateRolePermissionSchema,
} from "./role-permission.schema";

describe("RolePermission Schemas and DTOs", () => {
  const validRoleId = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const validPermissionId = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";
  const anotherValidPermissionId = "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33";

  describe("CreateRolePermissionSchema", () => {
    it("should validate a valid roleId and permissionId pair", () => {
      const input = {
        roleId: validRoleId,
        permissionId: validPermissionId,
      };

      const parsed = CreateRolePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data).toEqual(input);
      }
    });

    it("should fail when roleId is not a valid UUID", () => {
      const input = {
        roleId: "invalid-uuid",
        permissionId: validPermissionId,
      };

      const parsed = CreateRolePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "Invalid UUID format for roleId",
        );
      }
    });

    it("should fail when permissionId is not a valid UUID", () => {
      const input = {
        roleId: validRoleId,
        permissionId: "not-a-uuid",
      };

      const parsed = CreateRolePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "Invalid UUID format for permissionId",
        );
      }
    });

    it("should fail when roleId is missing", () => {
      const input = {
        permissionId: validPermissionId,
      };

      const parsed = CreateRolePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
    });

    it("should fail when permissionId is missing", () => {
      const input = {
        roleId: validRoleId,
      };

      const parsed = CreateRolePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
    });
  });

  describe("UpdateRolePermissionSchema", () => {
    it("should validate empty update", () => {
      const input = {};

      const parsed = UpdateRolePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
    });

    it("should validate updating roleId only", () => {
      const input = {
        roleId: validRoleId,
      };

      const parsed = UpdateRolePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.roleId).toBe(validRoleId);
      }
    });

    it("should validate updating permissionId only", () => {
      const input = {
        permissionId: validPermissionId,
      };

      const parsed = UpdateRolePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.permissionId).toBe(validPermissionId);
      }
    });

    it("should fail when updating with invalid UUID", () => {
      const input = {
        roleId: "bad-uuid",
      };

      const parsed = UpdateRolePermissionSchema.safeParse(input);
      expect(parsed.success).toBe(false);
    });
  });

  describe("AssignRolePermissionsSchema", () => {
    it("should validate array of valid UUIDs", () => {
      const input = {
        permissionIds: [validPermissionId, anotherValidPermissionId],
      };

      const parsed = AssignRolePermissionsSchema.safeParse(input);
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.permissionIds.length).toBe(2);
      }
    });

    it("should fail with empty permissionIds array", () => {
      const input = {
        permissionIds: [],
      };

      const parsed = AssignRolePermissionsSchema.safeParse(input);
      expect(parsed.success).toBe(false);
      if (!parsed.success) {
        expect(parsed.error.issues[0]?.message).toBe(
          "At least one permission ID is required",
        );
      }
    });

    it("should fail if any element is not a UUID", () => {
      const input = {
        permissionIds: [validPermissionId, "invalid"],
      };

      const parsed = AssignRolePermissionsSchema.safeParse(input);
      expect(parsed.success).toBe(false);
    });
  });

  describe("DTO Classes", () => {
    it("should instantiate all DTO classes", () => {
      expect(CreateRolePermissionDto).toBeDefined();
      expect(UpdateRolePermissionDto).toBeDefined();
      expect(AssignRolePermissionsDto).toBeDefined();
    });
  });
});
