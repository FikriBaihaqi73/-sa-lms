# Authentication registration

## Endpoint

`POST /auth/register`

This endpoint creates a public user account. It assigns the server-configured default role; clients cannot select a role.

## Request

Header: `Content-Type: application/json`

```json
{
  "username": "jane.doe",
  "email": "jane.doe@example.com",
  "password": "SecurePassword#2026"
}
```

`username` must contain 3–50 letters, digits, dots, underscores, or hyphens. `email` must be a valid email address. `password` must be 8–128 characters; its character combination is unrestricted.

The API normalizes `username` and `email` to lowercase before saving them.

## Success response

Status: `201 Created`

```json
{
  "status": "success",
  "message": "Registration successful",
  "data": {
    "id": "d6b76be2-22e6-42e3-a1bb-50875650ed39",
    "role_id": "21db8764-79ad-4c42-a2a4-5f6f219f0f47",
    "username": "jane.doe",
    "email": "jane.doe@example.com",
    "is_active": true,
    "last_login": null,
    "created_at": "2026-09-08T00:00:00.000Z",
    "updated_at": "2026-09-08T00:00:00.000Z",
    "deleted_at": null
  },
  "code": 201
}
```

The password is never returned.

## Errors and frontend flow

- `400 Bad Request`: show field-level validation messages returned by Zod.
- `409 Conflict`: show a generic “Registration could not be completed” message. Do not infer whether the email or username is registered.
- `503 Service Unavailable`: registration has not been configured with an available default role; ask the user to retry later.

Submit only after local client validation, disable the submit button while the request is pending, and route to login after a `201` response. Configure the backend with `DEFAULT_REGISTRATION_ROLE` (default: `student`) matching an existing active role name.

## Local verification

After configuring `packages/shared/.env`, apply migrations and start the API:

```bash
pnpm prisma:deploy
pnpm --filter @repo/shared build
pnpm --filter @repo/api dev
```

Open `http://localhost:5000/api` for the interactive API reference, or send the request above to `http://localhost:5000/auth/register`. The registration migration creates the default active `student` role.
