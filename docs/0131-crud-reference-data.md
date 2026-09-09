# CRUD Reference Data — Task 0131

The API exposes CRUD endpoints for permissions, role-permission assignments, institution levels, academic years, and academic statuses.

## Endpoints

Each resource supports:

| Resource | Base path |
| --- | --- |
| Permissions | `/permissions` |
| Role permissions | `/role-permissions` |
| Institution levels | `/institution-levels` |
| Academic years | `/academic-years` |
| Academic statuses | `/academic-statuses` |

For every base path, the available operations are `GET /`, `GET /:id`, `POST /`, `PATCH /:id`, and `DELETE /:id`.

## Request bodies

```json
// POST /permissions
{ "name": "users.read", "module": "users", "description": "Read users" }

// POST /role-permissions
{ "roleId": "role-uuid", "permissionId": "permission-uuid" }

// POST /institution-levels
{ "name": "SMA", "description": "Senior high school" }

// POST /academic-years
{ "academic_year": "2026/2027", "is_active": true }

// POST /academic-statuses
{ "name": "Graduated", "description": "Completed study program" }
```

PATCH bodies contain any subset of the corresponding fields. `roleId` and `permissionId` must be valid UUIDs. All request bodies are validated with the shared Zod schemas.

## Responses and deletion

Successful responses use the standard structure:

```json
{
  "status": "success",
  "message": "Resource retrieved successfully",
  "data": {},
  "code": 200
}
```

Create responses use code `201`. Missing IDs return `404`, duplicate names or assignments return `409`, and validation failures return `400`. `DELETE` performs a soft delete; deleted records are excluded from list and detail lookups.
