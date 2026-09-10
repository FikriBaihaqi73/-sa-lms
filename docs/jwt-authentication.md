# JWT authentication

All API endpoints require a valid JWT access token unless explicitly marked public. The public endpoints are `GET /`, `POST /auth/register`, and `POST /auth/login`.

## Local configuration

Create `apps/api/.env` (it is ignored by Git) with:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:<password>@localhost:5432/boilerplate_db?schema=public"
JWT_SECRET="use-a-long-random-local-secret"
DEFAULT_REGISTRATION_ROLE=student
```

`DATABASE_URL` must use the same local database as `packages/shared/.env`.

## Frontend flow

1. Register with `POST /auth/register`, or authenticate with `POST /auth/login`.
2. Read `data.accessToken` from the successful login response.
3. Send it with every protected request:

```http
Authorization: Bearer <accessToken>
```

4. A missing, malformed, expired, or invalid token returns `401 Unauthorized`. Clear the local session and return the user to login in that case.

The access token expires after 15 minutes. Authenticated requests include the verified JWT payload on the server request as `request.user`.
