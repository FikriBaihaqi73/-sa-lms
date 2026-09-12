# Teachers Feature Implementation

This document provides a detailed overview of the Teachers CRUD feature implementation for frontend developers.

## Endpoints Available

All endpoints are available under the `/teachers` route.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/teachers` | Create a new teacher |
| `GET` | `/teachers` | Retrieve all teachers |
| `GET` | `/teachers/:id` | Retrieve a specific teacher by ID |
| `PATCH` | `/teachers/:id` | Update an existing teacher |
| `DELETE` | `/teachers/:id` | Soft delete a teacher |

---

## 1. Create a New Teacher

**Endpoint**: `POST /teachers`

### Request Expectations

**Body** (JSON):
```json
{
  "profile_id": "uuid",
  "teacher_number": "T12345",
  "department_id": "uuid",          // Optional
  "specialization_id": "uuid",      // Optional
  "employment_status_id": "uuid",   // Optional
  "join_date": "2023-01-01T00:00:00.000Z" // Optional
}
```

### Response Expectations

**Success Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Teacher successfully created",
  "data": {
    "id": "uuid",
    "profile_id": "uuid",
    "teacher_number": "T12345",
    "department_id": "uuid",
    "specialization_id": "uuid",
    "employment_status_id": "uuid",
    "join_date": "2023-01-01T00:00:00.000Z",
    "created_at": "...",
    "updated_at": "..."
  }
}
```

---

## 2. Retrieve All Teachers

**Endpoint**: `GET /teachers`

### Response Expectations

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Teachers successfully retrieved",
  "data": [
    {
      "id": "uuid",
      "profile_id": "uuid",
      "teacher_number": "T12345",
      "department_id": "uuid",
      "specialization_id": "uuid",
      "employment_status_id": "uuid",
      "join_date": "2023-01-01T00:00:00.000Z",
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

---

## 3. Retrieve a Specific Teacher

**Endpoint**: `GET /teachers/:id`

### Response Expectations

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Teacher successfully retrieved",
  "data": {
    "id": "uuid",
    "profile_id": "uuid",
    "teacher_number": "T12345",
    ...
  }
}
```

**Error Response (404 Not Found)**:
```json
{
  "statusCode": 404,
  "message": "Teacher not found",
  "error": "Not Found"
}
```

---

## 4. Update an Existing Teacher

**Endpoint**: `PATCH /teachers/:id`

### Request Expectations

**Body** (JSON - all fields optional):
```json
{
  "teacher_number": "T12346",
  "department_id": "new-uuid"
}
```

### Response Expectations

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Teacher successfully updated",
  "data": {
    "id": "uuid",
    "teacher_number": "T12346",
    ...
  }
}
```

---

## 5. Delete a Teacher

**Endpoint**: `DELETE /teachers/:id`

### Response Expectations

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Teacher successfully deleted",
  "data": {
    "id": "uuid",
    "deleted_at": "2023-10-10T00:00:00.000Z",
    ...
  }
}
```

## Implementation Notes
- The `deleted_at` field is used for soft deletion. Deleted teachers will not be returned in `GET` requests.
- Relationships (like `Profile`, `Department`) can be fetched by adjusting the backend Prisma selects, but the current endpoints return the IDs as requested.
