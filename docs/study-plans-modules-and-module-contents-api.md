# Study Plans, Modules, and Module Contents API

All endpoints accept `Content-Type: application/json` and return `{ "status", "message", "data", "code" }`.

## Endpoints

| Resource | List | Detail | Create | Update | Delete |
| --- | --- | --- | --- | --- | --- |
| Study plans | `GET /study-plans` | `GET /study-plans/:id` | `POST /study-plans` | `PATCH /study-plans/:id` | `DELETE /study-plans/:id` |
| Learning modules | `GET /modules` | `GET /modules/:id` | `POST /modules` | `PATCH /modules/:id` | `DELETE /modules/:id` |
| Module contents | `GET /module-contents` | `GET /module-contents/:id` | `POST /module-contents` | `PATCH /module-contents/:id` | `DELETE /module-contents/:id` |

## Request examples

```json
// POST /study-plans
{
  "student_id": "6e278a13-a4ed-4d23-9d70-9ad9746b436a",
  "class_subject_id": "c8c8d75a-8a61-4b1c-b573-6d433fce0caa",
  "academic_year_id": "c9f9c5a3-43f7-4f68-a8e4-3e640dfcf5bf"
}
```

```json
// POST /modules
{
  "class_subject_id": "c8c8d75a-8a61-4b1c-b573-6d433fce0caa",
  "title": "Introduction to Algebra",
  "description": "Foundational algebra concepts",
  "display_order": 1,
  "is_published": false,
  "is_locked": false
}
```

```json
// POST /module-contents
{
  "moduleId": "c391f0dc-dd07-49e4-8fc5-5d2e3c08e45f",
  "title": "Variables",
  "contentType": "text",
  "content": "A variable represents a value.",
  "sortOrder": 1
}
```

All fields are optional for PATCH. Study-plan relations must exist and the student/class-subject/academic-year combination must be unique; duplicate requests return HTTP 409. Modules require an existing class subject, while module contents require an active module. Missing related records and unknown resource IDs return HTTP 404. Invalid UUIDs and invalid input values return field-level HTTP 400 validation errors.

Successful POST returns HTTP 201. DELETE is a soft delete and returns `data: { "success": true, "id": "..." }`; deleted data no longer appears in GET responses.
