# Authentication registration

## Endpoint

`POST /auth/register`

This endpoint creates a public user account, assigns the server-configured default role, and returns a JWT access token. Clients cannot select a role.

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
    "accessToken": "<JWT>",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "d6b76be2-22e6-42e3-a1bb-50875650ed39",
      "role_id": "21db8764-79ad-4c42-a2a4-5f6f219f0f47",
      "username": "jane.doe",
      "email": "jane.doe@example.com",
      "is_active": true,
      "last_login": null,
      "created_at": "2026-09-08T00:00:00.000Z",
      "updated_at": "2026-09-08T00:00:00.000Z",
      "deleted_at": null
    }
  },
  "code": 201
}
```

The password is never returned. Store `accessToken` only through the frontend's approved session strategy.

## Errors and frontend flow

- `400 Bad Request`: show field-level validation messages returned by Zod.
- `409 Conflict`: show a generic “Registration could not be completed” message. Do not infer whether the email or username is registered.
- `500 Internal Server Error`: unexpected database or server failure; show a generic retry message.

Submit only after local client validation, disable the submit button while the request is pending, and create the authenticated session after a `201` response. Configure the backend with `DEFAULT_REGISTRATION_ROLE` (default: `student`); if the role does not exist, the API creates it automatically.

## Local verification

After configuring `packages/shared/.env`, apply migrations and start the API:

```bash
pnpm prisma:deploy
pnpm --filter @repo/shared build
pnpm --filter @repo/api dev
```

Open `http://localhost:5000/api` for the interactive API reference, or send the request above to `http://localhost:5000/auth/register`.

## Login

### Endpoint and request

`POST /auth/login`

Header: `Content-Type: application/json`

```json
{
  "email": "jane.doe@example.com",
  "password": "SecurePassword#2026"
}
```

`email` is required and must be a valid registered email address. `password` is required and may be at most 128 characters. The email is matched case-insensitively.

### Success response

Status: `200 OK`

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "accessToken": "<JWT>",
    "tokenType": "Bearer",
    "expiresIn": 900,
    "user": {
      "id": "d6b76be2-22e6-42e3-a1bb-50875650ed39",
      "role_id": "21db8764-79ad-4c42-a2a4-5f6f219f0f47",
      "username": "jane.doe",
      "email": "jane.doe@example.com",
      "is_active": true,
      "last_login": "2026-09-08T00:00:00.000Z",
      "created_at": "2026-09-08T00:00:00.000Z",
      "updated_at": "2026-09-08T00:00:00.000Z",
      "deleted_at": null
    }
  },
  "code": 200
}
```

Store the token only through the frontend's approved session strategy. When calling protected endpoints, send `Authorization: Bearer <accessToken>`. The token expires after 900 seconds (15 minutes).

### Errors and frontend flow

- `400 Bad Request`: display the returned field-level validation messages.
- `401 Unauthorized`: display a generic invalid-credentials message. The same response intentionally covers an unknown, inactive, deleted, or incorrectly authenticated account.

On submit, disable the form while pending. On `200`, persist the authenticated session and navigate to the application. On `401`, keep the password field ready for correction and do not reveal which credential failed.
