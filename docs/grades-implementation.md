# Grades CRUD implementation

## Authentication

All grades routes are documented with the `JWT-auth` bearer scheme. Send the
access token in the `Authorization` header:

```text
Authorization: Bearer <access-token>
```

The current repository exposes the Swagger bearer scheme but does not contain a
`JwtAuthGuard`, global `APP_GUARD`, or `Public` decorator. Runtime JWT guard
enforcement therefore requires the auth-guard architecture to be added by the
authentication task that owns it.

## Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/grades` | List active grades |
| GET | `/grades/:id` | Get one active grade |
| POST | `/grades` | Create a grade |
| PATCH | `/grades/:id` | Update a grade |
| DELETE | `/grades/:id` | Soft-delete a grade |

## Request body

`POST /grades` accepts the required `grade` field and optional
`minimumScore`, `maximumScore`, and `description` fields. `PATCH /grades/:id`
accepts the same fields, all optional. Scores are coerced to numbers by the
Zod schema.

## Response behavior

Successful responses use the shared response envelope with `status`, `message`,
`data`, and `code`. Missing IDs return `404`; duplicate active grade names
return `409`; invalid request bodies return `400`.
