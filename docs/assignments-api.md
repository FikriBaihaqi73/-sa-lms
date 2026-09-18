# Assignments API

The assignments CRUD is exposed under `/assignments` and uses the same success response shape as the other API modules.

All endpoints require the JWT bearer token configured by the API.

## Endpoints

- `GET /assignments?page=1&limit=10&search=algebra` lists active assignments.
- `GET /assignments/:id` returns one active assignment.
- `POST /assignments` creates an assignment.
- `PATCH /assignments/:id` updates an assignment.
- `DELETE /assignments/:id` soft-deletes an assignment.

The list endpoint returns `data` plus `meta` containing `totalData`, `totalPages`, `currentPage`, and `perPage`. `limit` is capped at 100. Search matches assignment title/description, assignment type name, module title, and the related class or subject name.

Assignment responses include the selected `module.class_subject` relation and the `assignment_type` relation. These are the Prisma relation names for the `class_subjects` and `AssignmentTypes` data described by the feature.

## Request body

```json
{
  "module_id": "uuid",
  "assignment_type_id": "uuid",
  "title": "Algebra quiz",
  "description": "Complete questions 1-20",
  "due_date": "2026-09-30T23:59:59.000Z",
  "max_score": 100
}
```

`module_id`, `assignment_type_id`, and `title` are required when creating an assignment. Update fields are optional. `due_date` accepts an ISO datetime or `null`, and `max_score` must be non-negative.

## Response example

```json
{
  "status": "success",
  "message": "Assignments retrieved successfully",
  "data": [],
  "code": 200,
  "meta": {
    "totalData": 0,
    "totalPages": 0,
    "currentPage": 1,
    "perPage": 10
  }
}
```

Missing IDs return a standard NestJS `404` response. Invalid UUIDs, datetimes, or negative scores are rejected by the Zod validation pipe with a `400` response.
