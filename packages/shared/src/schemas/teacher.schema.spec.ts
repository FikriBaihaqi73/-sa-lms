import {
  CreateTeacherDto,
  CreateTeacherSchema,
  UpdateTeacherDto,
  UpdateTeacherSchema,
} from "./teacher.schema";

describe("Teacher Schemas", () => {
  const validUUID = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11";
  const validUUID2 = "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22";
  const validUUID3 = "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33";
  const validUUID4 = "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44";

  describe("CreateTeacherSchema", () => {
    it("should successfully validate a full teacher payload", () => {
      const validPayload = {
        profile_id: validUUID,
        department_id: validUUID2,
        specialization_id: validUUID3,
        employment_status_id: validUUID4,
        teacher_number: "TCH-2026-001",
        join_date: "2026-09-01T00:00:00.000Z",
      };

      const result = CreateTeacherSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(validPayload);
      }
    });

    it("should successfully validate a payload with minimal required fields", () => {
      const minimalPayload = {
        profile_id: validUUID,
        teacher_number: "TCH-2026-002",
      };

      const result = CreateTeacherSchema.safeParse(minimalPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.profile_id).toBe(validUUID);
        expect(result.data.teacher_number).toBe("TCH-2026-002");
      }
    });

    it("should allow null for optional relational IDs and join_date", () => {
      const payloadWithNulls = {
        profile_id: validUUID,
        department_id: null,
        specialization_id: null,
        employment_status_id: null,
        teacher_number: "TCH-2026-003",
        join_date: null,
      };

      const result = CreateTeacherSchema.safeParse(payloadWithNulls);
      expect(result.success).toBe(true);
    });

    it("should fail validation when profile_id is not a valid UUID", () => {
      const invalidPayload = {
        profile_id: "invalid-uuid",
        teacher_number: "TCH-2026-004",
      };

      const result = CreateTeacherSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain("profile_id");
      }
    });

    it("should fail validation when department_id is not a valid UUID", () => {
      const invalidPayload = {
        profile_id: validUUID,
        department_id: "not-a-uuid",
        teacher_number: "TCH-2026-005",
      };

      const result = CreateTeacherSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain("department_id");
      }
    });

    it("should fail validation when teacher_number is missing or empty", () => {
      const invalidPayload = {
        profile_id: validUUID,
        teacher_number: "",
      };

      const result = CreateTeacherSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain("teacher_number");
      }
    });

    it("should fail validation when join_date is not an ISO 8601 datetime string", () => {
      const invalidPayload = {
        profile_id: validUUID,
        teacher_number: "TCH-2026-006",
        join_date: "invalid-date",
      };

      const result = CreateTeacherSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0]?.path).toContain("join_date");
      }
    });
  });

  describe("UpdateTeacherSchema", () => {
    it("should validate partial updates with teacher_number", () => {
      const payload = {
        teacher_number: "TCH-UPDATED-001",
      };

      const result = UpdateTeacherSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should validate partial updates with department_id", () => {
      const payload = {
        department_id: validUUID2,
      };

      const result = UpdateTeacherSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    it("should validate an empty update object", () => {
      const result = UpdateTeacherSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("DTO Classes", () => {
    it("should instantiate CreateTeacherDto correctly", () => {
      const dto = new CreateTeacherDto();
      expect(dto).toBeDefined();
    });

    it("should instantiate UpdateTeacherDto correctly", () => {
      const dto = new UpdateTeacherDto();
      expect(dto).toBeDefined();
    });
  });
});
