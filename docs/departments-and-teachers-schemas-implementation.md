# Departments & Teachers Zod Schemas & DTO Documentation

## 1. Overview
This document specifies the validation schemas and Data Transfer Objects (DTOs) for the **Departments** and **Teachers** domains using **Zod** and `nestjs-zod`.

All schemas are located in `packages/shared/src/schemas/` and exported via `@repo/shared/schemas` (or `#schemas/*`).

---

## 2. Department Schema (`department.schema.ts`)

### A. Fields & Validation Rules

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** (Create) / No (Update) | `min(1)`, `max(255)` | Name of the department (e.g., Computer Science, Mathematics) |
| `code` | `string` | **Yes** (Create) / No (Update) | `min(1)`, `max(50)` | Unique code of the department (e.g., `CS`, `MATH`) |

### B. Schemas & DTOs
- `CreateDepartmentSchema` -> `CreateDepartmentDto`
- `UpdateDepartmentSchema` -> `UpdateDepartmentDto`

### C. Example Payload (Create)
```json
{
  "name": "Computer Science",
  "code": "CS"
}
```

### D. Example Payload (Update)
```json
{
  "name": "Department of Computer Science & Engineering"
}
```

---

## 3. Teacher Schema (`teacher.schema.ts`)

### A. Fields & Validation Rules

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `profile_id` | `string` (UUID) | **Yes** (Create) / No (Update) | UUID v4 | Profile ID associated with the teacher |
| `department_id` | `string` (UUID) \| `null` | No | UUID v4 (optional/nullable) | Department ID the teacher belongs to |
| `specialization_id` | `string` (UUID) \| `null` | No | UUID v4 (optional/nullable) | Specialization ID of the teacher |
| `employment_status_id` | `string` (UUID) \| `null` | No | UUID v4 (optional/nullable) | Employment Status ID of the teacher |
| `teacher_number` | `string` | **Yes** (Create) / No (Update) | `min(1)`, `max(100)` | Unique identification/registration number for teacher (e.g., NIP/NUPTK) |
| `join_date` | `string` (ISO 8601) \| `null` | No | ISO 8601 datetime string (optional/nullable) | Date when the teacher joined |

### B. Schemas & DTOs
- `CreateTeacherSchema` -> `CreateTeacherDto`
- `UpdateTeacherSchema` -> `UpdateTeacherDto`

### C. Example Payload (Create - Full)
```json
{
  "profile_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "department_id": "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
  "specialization_id": "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33",
  "employment_status_id": "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44",
  "teacher_number": "TCH-2026-001",
  "join_date": "2026-09-01T00:00:00.000Z"
}
```

### D. Example Payload (Create - Minimal)
```json
{
  "profile_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "teacher_number": "TCH-2026-001"
}
```

### E. Example Payload (Update)
```json
{
  "department_id": "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
  "employment_status_id": "d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44"
}
```

---

## 4. Error & Validation Response Format
When validation fails, the API responds with a structured 400 Bad Request payload:

```json
{
  "status": "error",
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "teacher_number",
      "message": "Teacher number is required"
    }
  ]
}
```
