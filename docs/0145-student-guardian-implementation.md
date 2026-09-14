# 0145 — Student Guardian API & Feature Implementation

This document provides complete instructions for Frontend Developers integrating the Student Guardian (Wali Murid) management API module, as well as updated eager loading, pagination, and search capabilities across Auth, Religion, and Attendance Status modules.

---

## 1. Authentication Header

All requests (except public auth endpoints like `/auth/login` and `/auth/register`) require standard Bearer token authorization:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

---

## 2. Endpoints Summary

### Student Guardians (`/student-guardians`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/student-guardians` | List paginated student guardian relations with optional search |
| `GET` | `/student-guardians/:id` | Get single student guardian relation by ID |
| `GET` | `/student-guardians/student/:studentId` | Get all guardian relations for a specific student ID |
| `GET` | `/student-guardians/guardian/:guardianId` | Get all student relations for a specific guardian ID |
| `POST` | `/student-guardians` | Create a new student guardian relation |
| `PATCH` | `/student-guardians/:id` | Update an existing student guardian relation |
| `DELETE` | `/student-guardians/:id` | Soft-delete a student guardian relation |

### Reference Modules (`/religions`, `/attendance-statuses`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/religions` | List religions with pagination (`page`, `limit`), search query (`search`), and eager loaded profiles |
| `GET` | `/attendance-statuses` | List attendance statuses with pagination (`page`, `limit`), search query (`search`), and eager loaded attendances |

---

## 3. Query Parameters & Pagination / Search

List endpoints support standard pagination and case-insensitive multi-field search:

- `page` (number, default: `1`): Page index.
- `limit` (number, default: `10`): Items per page.
- `search` (string, optional): Search keyword.
  - **Student Guardians**: matches student number, student full name, guardian full name, guardian email, or guardian phone number.
  - **Religions**: matches religion name.
  - **Attendance Statuses**: matches status name or description.

### Example Request
`GET /student-guardians?page=1&limit=10&search=Ahmad`

---

## 4. Request & Response Payloads

### A. Create Student Guardian Relation (`POST /student-guardians`)

**Request Body**:
```json
{
  "studentId": "00000000-0000-0000-0000-000000000001",
  "guardianId": "00000000-0000-0000-0000-000000000002",
  "isPrimary": true
}
```

**Success Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Student guardian relation created successfully",
  "data": {
    "id": "e9b1c7d2-3f4a-5b6c-7d8e-9f0a1b2c3d4e",
    "studentId": "00000000-0000-0000-0000-000000000001",
    "guardianId": "00000000-0000-0000-0000-000000000002",
    "isPrimary": true,
    "createdAt": "2026-09-14T10:00:00.000Z",
    "updatedAt": "2026-09-14T10:00:00.000Z",
    "deletedAt": null,
    "student": {
      "id": "00000000-0000-0000-0000-000000000001",
      "studentNumber": "STD-2026-001",
      "enrollmentYear": 2026,
      "profile": {
        "id": "11111111-1111-1111-1111-111111111111",
        "userId": "22222222-2222-2222-2222-222222222222",
        "institutionId": "33333333-3333-3333-3333-333333333333",
        "fullName": "Ahmad Student",
        "identityNumber": "3201000011112222",
        "gender": "Male",
        "birthPlace": "Jakarta",
        "birthDate": "2010-05-15T00:00:00.000Z",
        "religionId": "44444444-4444-4444-4444-444444444444",
        "nationalityId": "55555555-5555-5555-5555-555555555555",
        "address": "Jl. Pendidikan No. 10",
        "phoneNumber": "081234567890",
        "email": "ahmad@example.com",
        "photoUrl": "https://example.com/avatar.jpg",
        "createdAt": "2026-09-01T00:00:00.000Z",
        "updatedAt": "2026-09-01T00:00:00.000Z"
      }
    },
    "guardian": {
      "id": "00000000-0000-0000-0000-000000000002",
      "fullName": "Budi Guardian",
      "relationship": "Father",
      "phoneNumber": "089876543210",
      "email": "budi@example.com",
      "address": "Jl. Pendidikan No. 10",
      "occupation": "Software Engineer",
      "createdAt": "2026-09-01T00:00:00.000Z",
      "updatedAt": "2026-09-01T00:00:00.000Z"
    }
  },
  "code": 201
}
```

### B. List Student Guardian Relations (`GET /student-guardians`)

**Success Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Student guardian relations retrieved successfully",
  "data": [
    {
      "id": "e9b1c7d2-3f4a-5b6c-7d8e-9f0a1b2c3d4e",
      "studentId": "00000000-0000-0000-0000-000000000001",
      "guardianId": "00000000-0000-0000-0000-000000000002",
      "isPrimary": true,
      "createdAt": "2026-09-14T10:00:00.000Z",
      "updatedAt": "2026-09-14T10:00:00.000Z",
      "deletedAt": null,
      "student": { ... },
      "guardian": { ... }
    }
  ],
  "code": 200,
  "meta": {
    "totalData": 1,
    "totalPages": 1,
    "currentPage": 1,
    "perPage": 10
  }
}
```

### C. Update Relation (`PATCH /student-guardians/:id`)

**Request Body**:
```json
{
  "isPrimary": false
}
```

---

## 5. Frontend Implementation Flow & Edge Cases

1. **Relation Assignment Flow**:
   - Before calling `POST /student-guardians`, ensure `studentId` and `guardianId` are valid UUIDs.
   - If `studentId` or `guardianId` does not exist in active records, the backend returns HTTP `404` (`Student not found` or `Guardian not found`).
   - If the student-guardian pair already exists, the backend returns HTTP `409` (`Student guardian relation already exists`).

2. **Search and Pagination Integration**:
   - Bind search input fields to query param `search` with debouncing (e.g., 300ms).
   - Use `meta.currentPage`, `meta.totalPages`, and `meta.perPage` to drive UI pagination tables.

3. **Soft Delete Handling**:
   - On successful `DELETE /student-guardians/:id`, remove the item locally from state array or refetch current page.
