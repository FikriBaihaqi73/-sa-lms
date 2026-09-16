# 0151 — Class Subjects API & Eager Loading Implementation Guide

This document provides a detailed integration guide for Frontend Developers working with the `class_subjects` (Mata Pelajaran Kelas) API endpoints, featuring eager-loaded relations (`classes`, `subjects`, `teachers`, `academic_years`), pagination, search, and JWT authentication.

---

## 1. Authentication & API Reference

All requests to `/class-subjects` require JWT authentication header:

```http
Authorization: Bearer <accessToken>
Content-Type: application/json
```

Interactive Scalar documentation is available at `http://localhost:5000/api` under tag **Class Subjects**.

---

## 2. Endpoints Summary (`/class-subjects`)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/class-subjects` | List paginated class subjects with eager loading & multi-field search |
| `GET` | `/class-subjects/:id` | Get single class subject mapping detail by ID |
| `GET` | `/class-subjects/class/:classId` | Get class subjects for a specific class ID |
| `GET` | `/class-subjects/subject/:subjectId` | Get class subjects for a specific subject ID |
| `GET` | `/class-subjects/teacher/:teacherId` | Get class subjects for a specific teacher ID |
| `GET` | `/class-subjects/academic-year/:academicYearId` | Get class subjects for a specific academic year ID |
| `POST` | `/class-subjects` | Create a new class subject mapping |
| `PATCH` | `/class-subjects/:id` | Update an existing class subject mapping |
| `DELETE` | `/class-subjects/:id` | Soft-delete a class subject mapping |

---

## 3. Query Parameters: Pagination & Search

The main list endpoint (`GET /class-subjects`) supports pagination and multi-field search:

- `page` (number, default `1`): Page number.
- `limit` (number, default `10`): Items per page.
- `search` (string, optional): Multi-field search keyword matching:
  - `class.name` (e.g. "X IPA 1")
  - `subject.name` or `subject.code` (e.g. "Mathematics", "MATH101")
  - `teacher.teacher_number`, `teacher.profile.first_name`, `teacher.profile.last_name`
  - `academic_year.academic_year` (e.g. "2024/2025")

### Example Query
`GET /class-subjects?page=1&limit=10&search=Math`

---

## 4. Request & Response Examples

### A. List Class Subjects (`GET /class-subjects`)

**Response (200 OK)**:
```json
{
  "status": "success",
  "message": "Class subjects retrieved successfully",
  "data": [
    {
      "id": "e9b1c7d2-3f4a-5b6c-7d8e-9f0a1b2c3d4e",
      "class_id": "11111111-1111-1111-1111-111111111111",
      "subject_id": "22222222-2222-2222-2222-222222222222",
      "teacher_id": "33333333-3333-3333-3333-333333333333",
      "academic_year_id": "44444444-4444-4444-4444-444444444444",
      "created_at": "2026-09-16T08:00:00.000Z",
      "updated_at": "2026-09-16T08:00:00.000Z",
      "deleted_at": null,
      "class": {
        "id": "11111111-1111-1111-1111-111111111111",
        "institution_id": "55555555-5555-5555-5555-555555555555",
        "homeroom_teacher_id": "33333333-3333-3333-3333-333333333333",
        "academic_year_id": "44444444-4444-4444-4444-444444444444",
        "name": "X IPA 1",
        "grade_level": 10,
        "capacity": 36,
        "created_at": "2026-09-01T00:00:00.000Z",
        "updated_at": "2026-09-01T00:00:00.000Z"
      },
      "subject": {
        "id": "22222222-2222-2222-2222-222222222222",
        "code": "MATH101",
        "name": "Mathematics",
        "credits": 3,
        "description": "General High School Mathematics",
        "institutionId": "55555555-5555-5555-5555-555555555555",
        "departmentId": null,
        "createdAt": "2026-09-01T00:00:00.000Z",
        "updatedAt": "2026-09-01T00:00:00.000Z"
      },
      "teacher": {
        "id": "33333333-3333-3333-3333-333333333333",
        "profile_id": "66666666-6666-6666-6666-666666666666",
        "department_id": null,
        "specialization_id": null,
        "employment_status_id": null,
        "teacher_number": "TCH-2026-001",
        "join_date": "2024-01-01T00:00:00.000Z",
        "created_at": "2026-09-01T00:00:00.000Z",
        "updated_at": "2026-09-01T00:00:00.000Z"
      },
      "academic_year": {
        "id": "44444444-4444-4444-4444-444444444444",
        "academic_year": "2024/2025",
        "is_active": true,
        "created_at": "2026-09-01T00:00:00.000Z",
        "updated_at": "2026-09-01T00:00:00.000Z"
      }
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

### B. Create Class Subject (`POST /class-subjects`)

**Request Body**:
```json
{
  "class_id": "11111111-1111-1111-1111-111111111111",
  "subject_id": "22222222-2222-2222-2222-222222222222",
  "teacher_id": "33333333-3333-3333-3333-333333333333",
  "academic_year_id": "44444444-4444-4444-4444-444444444444"
}
```

**Response (201 Created)**:
```json
{
  "status": "success",
  "message": "Class subject created successfully",
  "data": { ... },
  "code": 201
}
```

### C. Update Class Subject (`PATCH /class-subjects/:id`)

**Request Body**:
```json
{
  "teacher_id": "77777777-7777-7777-7777-777777777777"
}
```

---

## 5. Frontend Integration & Error Edge Cases

1. **Validation & Referential Integrity**:
   - `class_id`, `subject_id`, `teacher_id`, and `academic_year_id` must be valid UUIDs.
   - If a referenced entity does not exist or is deleted, HTTP `404` is returned (`Class not found`, `Subject not found`, `Teacher not found`, or `Academic year not found`).
   - If an identical mapping combination already exists, HTTP `409` (`Class subject relation already exists for this combination`) is returned.

2. **Search Debouncing**:
   - Implement debouncing (e.g., 300ms) on the search input before sending request queries to optimize server load.
