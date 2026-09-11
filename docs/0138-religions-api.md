# 0138 — Religions API

All religions endpoints require a logged-in user. First call `POST /auth/login`, then send its access token with every religions request:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

## Endpoints

| Method | URL | Purpose |
| --- | --- | --- |
| `GET` | `/religions` | List active religions |
| `GET` | `/religions/:id` | Get one active religion |
| `POST` | `/religions` | Create a religion |
| `PATCH` | `/religions/:id` | Update a religion |
| `DELETE` | `/religions/:id` | Soft-delete a religion |

## Request payloads

Create or update with:

```json
{ "name": "Islam" }
```

`name` is required when creating, is trimmed, must contain 1–100 characters, and must be unique among active religions. On update, all fields are optional.

## Response and frontend flow

Successful responses use the shared envelope:

```json
{
  "status": "success",
  "message": "Religion created successfully",
  "data": {
    "id": "uuid",
    "name": "Islam",
    "created_at": "2026-09-11T00:00:00.000Z",
    "updated_at": "2026-09-11T00:00:00.000Z",
    "deleted_at": null
  },
  "code": 201
}
```

Load the list after authentication to populate religion selectors. Merge returned `data` after creates or updates, and remove the ID locally after a successful delete. Missing or deleted records return `404`; duplicate names return `409`; an absent, malformed, expired, or revoked access token returns `401`.
