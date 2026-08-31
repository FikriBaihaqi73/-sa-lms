# Roles & Permissions Zod Schemas & DTO Documentation

## 1. Overview
This document specifies the validation schemas and Data Transfer Objects (DTOs) for the **Roles**, **Permissions**, and **RolePermissions** domains using **Zod** and `nestjs-zod`.

All schemas are located in `packages/shared/src/schemas/` and exported via `@repo/shared/schemas` (or `#schemas/*`).

---

## 2. Role Schema (`role.schema.ts`)

### A. Fields & Validation Rules

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** (Create) / No (Update) | `min(1)`, `max(255)` | Name of the role (e.g., `Admin`, `Teacher`, `Student`) |
| `description`| `string \| null` | No | `max(1000)` | Optional description of the role |

### B. Schemas & DTOs
- `CreateRoleSchema` -> `CreateRoleDto`
- `UpdateRoleSchema` -> `UpdateRoleDto`

### C. Example Payload (Create)
```json
{
  "name": "Teacher",
  "description": "Instructor with class and grade management permissions"
}
```

### D. Example Payload (Update)
```json
{
  "description": "Updated description for Teacher role"
}
```

---

## 3. Permission Schema (`permission.schema.ts`)

### A. Fields & Validation Rules

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `name` | `string` | **Yes** (Create) / No (Update) | `min(1)`, `max(255)` | Unique permission key (e.g., `users.create`, `classes.read`) |
| `module` | `string` | **Yes** (Create) / No (Update) | `min(1)`, `max(255)` | Domain/Module name (e.g., `users`, `classes`, `grades`) |
| `description`| `string \| null` | No | `max(1000)` | Optional description of what this permission allows |

### B. Schemas & DTOs
- `CreatePermissionSchema` -> `CreatePermissionDto`
- `UpdatePermissionSchema` -> `UpdatePermissionDto`

### C. Example Payload (Create)
```json
{
  "name": "classes.manage",
  "module": "classes",
  "description": "Allows full management over class schedules and assignments"
}
```

### D. Example Payload (Update)
```json
{
  "description": "Updated permission description"
}
```

---

## 4. RolePermission Schema (`role-permission.schema.ts`)

### A. Fields & Validation Rules

| Field | Type | Required | Constraints | Description |
| :--- | :--- | :--- | :--- | :--- |
| `roleId` | `string` (UUID) | **Yes** (Create) / No (Update) | UUID v4 | Role ID |
| `permissionId` | `string` (UUID) | **Yes** (Create) / No (Update) | UUID v4 | Permission ID |
| `permissionIds` | `string[]` (UUIDs)| **Yes** (Assign) | `array().min(1)` | Array of UUIDs to bulk assign to a role |

### B. Schemas & DTOs
- `CreateRolePermissionSchema` -> `CreateRolePermissionDto`
- `UpdateRolePermissionSchema` -> `UpdateRolePermissionDto`
- `AssignRolePermissionsSchema` -> `AssignRolePermissionsDto`

### C. Example Payload (Single Assignment)
```json
{
  "roleId": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "permissionId": "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22"
}
```

### D. Example Payload (Bulk Assignment)
```json
{
  "permissionIds": [
    "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33"
  ]
}
```

---

## 5. Error & Validation Response Format
When validation fails, the API responds with a structured 400 Bad Request payload:

```json
{
  "status": "error",
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Role name is required"
    }
  ]
}
```
