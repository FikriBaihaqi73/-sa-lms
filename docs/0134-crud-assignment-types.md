# Assignment Types CRUD Implementation

This document provides details for frontend developers to integrate the Assignment Types CRUD API.

## Endpoints Overview

The `Assignment Types` API allows you to manage different types of assignments (e.g., Exam, Quiz, Homework).

### Base URL: `/api/assignment-types`

| Method | Endpoint | Description | Auth Required |
| --- | --- | --- | --- |
| POST | `/api/assignment-types` | Create a new assignment type | Yes (Bearer) |
| GET | `/api/assignment-types` | Get all assignment types | Yes (Bearer) |
| GET | `/api/assignment-types/:id` | Get assignment type by ID | Yes (Bearer) |
| PUT | `/api/assignment-types/:id` | Update assignment type | Yes (Bearer) |
| DELETE | `/api/assignment-types/:id` | Delete assignment type | Yes (Bearer) |

---

## 1. Create Assignment Type
**POST** `/api/assignment-types`

**Request Body:**
```json
{
  "name": "Midterm Exam",
  "description": "Mid-semester examination"
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "code": 201,
  "message": "Assignment type created successfully",
  "data": {
    "id": "uuid-string",
    "name": "Midterm Exam",
    "description": "Mid-semester examination",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "status": "error",
  "code": 409,
  "message": "Assignment type name already exists",
  "errors": null
}
```

---

## 2. Get All Assignment Types
**GET** `/api/assignment-types`

**Success Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Assignment types retrieved successfully",
  "data": [
    {
      "id": "uuid-string",
      "name": "Midterm Exam",
      "description": "Mid-semester examination",
      "created_at": "2023-01-01T00:00:00.000Z",
      "updated_at": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

---

## 3. Get Assignment Type by ID
**GET** `/api/assignment-types/:id`

**Success Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Assignment type retrieved successfully",
  "data": {
    "id": "uuid-string",
    "name": "Midterm Exam",
    "description": "Mid-semester examination",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-01-01T00:00:00.000Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "status": "error",
  "code": 404,
  "message": "Assignment type not found",
  "errors": null
}
```

---

## 4. Update Assignment Type
**PUT** `/api/assignment-types/:id`

**Request Body:** (All fields are optional)
```json
{
  "name": "Final Exam"
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Assignment type updated successfully",
  "data": {
    "id": "uuid-string",
    "name": "Final Exam",
    "description": "Mid-semester examination",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-02-01T00:00:00.000Z"
  }
}
```

**Error Response (409 Conflict):**
```json
{
  "status": "error",
  "code": 409,
  "message": "Assignment type name already in use by another assignment type",
  "errors": null
}
```

---

## 5. Delete Assignment Type
**DELETE** `/api/assignment-types/:id`

**Success Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Assignment type deleted successfully",
  "data": {
    "id": "uuid-string",
    "name": "Final Exam",
    "description": "Mid-semester examination",
    "created_at": "2023-01-01T00:00:00.000Z",
    "updated_at": "2023-02-01T00:00:00.000Z"
  }
}
```
*Note: This operation sets the `deleted_at` field (Soft Delete). The data is still retained in the database but will no longer appear in the GET requests.*

---

## Frontend Validation Notes

- `name` is required on create and must contain at least one character.
- `description` is optional.
- `name` must be unique among active assignment types.
- Update requests may send only the fields that changed.
