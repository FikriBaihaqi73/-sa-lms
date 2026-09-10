# Attendance statuses API

The API exposes CRUD operations for the attendance status reference data used by attendance records. All JSON requests require `Content-Type: application/json`; every response uses `{ "status", "message", "data", "code" }`.

| Method | URL | Purpose |
| --- | --- | --- |
| `GET` | `/attendance-statuses` | List active attendance statuses |
| `GET` | `/attendance-statuses/:id` | Get one active status |
| `POST` | `/attendance-statuses` | Create a status |
| `PATCH` | `/attendance-statuses/:id` | Update supplied fields |
| `DELETE` | `/attendance-statuses/:id` | Soft-delete a status |

## Requests

Create a status:

```json
{ "name": "Present", "description": "Student attended the lesson" }
```

Update requests use the same fields, but all are optional:

```json
{ "description": "Student was present for the scheduled lesson" }
```

`name` must be a non-empty string and must be unique among active statuses. `description` is optional.

## Responses and frontend flow

Successful creation returns HTTP `201`:

```json
{
  "status": "success",
  "message": "Attendance status created successfully",
  "data": { "id": "uuid", "name": "Present", "description": "Student attended the lesson" },
  "code": 201
}
```

Load `GET /attendance-statuses` to populate attendance-status selectors. After a create or update, merge the returned `data` into the local list; after delete, remove its ID from the list. A nonexistent or already-deleted ID returns `404`, while a duplicate name returns `409`. Validation errors identify the invalid field through the standard validation response.
