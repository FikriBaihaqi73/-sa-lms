# Guardian API

## Endpoints

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `/guardians?page=1&limit=10&search=jane` | Get paginated guardians; `search` optionally matches `fullName` case-insensitively. |
| `GET` | `/guardians/:id` | Get one guardian. |
| `POST` | `/guardians` | Create a guardian. |
| `PATCH` | `/guardians/:id` | Update a guardian. |
| `DELETE` | `/guardians/:id` | Soft-delete a guardian. |

All endpoints require `Authorization: Bearer <access-token>`.

## Request body

```json
{
  "fullName": "Jane Doe",
  "relationship": "Mother",
  "phoneNumber": "+628123456789",
  "email": "jane@example.com",
  "address": "Jakarta",
  "occupation": "Teacher"
}
```

`fullName` is required. All other fields are optional. If an email is supplied, it must have a valid email format.

## Response examples

Successful create:

```json
{
  "status": "success",
  "message": "Guardian created successfully",
  "data": {
    "id": "9d7a5dd3-86c0-49a3-9a7f-9ea501c91350",
    "fullName": "Jane Doe",
    "relationship": "Mother"
  },
  "code": 201
}
```

For a missing or deleted guardian, the API returns HTTP `404` with the message `Guardian not found`. For invalid input, display the field validation errors returned by the API.

## Frontend flow

1. Load the guardian list using the pagination query parameters and optional `search` text.
2. Submit the create or edit form with the JSON payload above.
3. Refresh the list after a successful mutation.
4. Confirm deletion before calling `DELETE /guardians/:id`.
