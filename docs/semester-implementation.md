# Semester Implementation

## Overview
This document outlines the implementation of the `semesters` API endpoints, including CRUD operations, pagination, search functionality, and eager loading of the related `academic_years`.

## Endpoints

### 1. Create a Semester
- **Method:** `POST`
- **URL:** `/api/semesters`
- **Request Body:**
```json
{
  "academic_year_id": "uuid",
  "name": "Semester Ganjil",
  "start_date": "2024-08-01T00:00:00Z",
  "end_date": "2024-12-31T00:00:00Z",
  "is_active": true
}
```
- **Response:**
```json
{
  "status": "success",
  "code": 201,
  "message": "Semester created successfully",
  "data": { ... }
}
```

### 2. Get All Semesters
- **Method:** `GET`
- **URL:** `/api/semesters`
- **Query Parameters:**
  - `page` (optional): Page number (e.g., `1`)
  - `limit` (optional): Items per page (e.g., `10`)
  - `search` (optional): Search keyword for semester name or academic year.
  - `academic_year_id` (optional): Filter by specific academic year ID.
- **Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Semesters retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "academic_year_id": "uuid",
      "name": "Semester Ganjil",
      "academicYear": {
        "id": "uuid",
        "academic_year": "2024/2025"
      }
      // ...
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. Get Semester by ID
- **Method:** `GET`
- **URL:** `/api/semesters/:id`
- **Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Semester retrieved successfully",
  "data": { ... }
}
```

### 4. Update Semester by ID
- **Method:** `PATCH`
- **URL:** `/api/semesters/:id`
- **Request Body:** (All fields are optional)
```json
{
  "name": "Semester Genap"
}
```
- **Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Semester updated successfully",
  "data": { ... }
}
```

### 5. Delete Semester by ID
- **Method:** `DELETE`
- **URL:** `/api/semesters/:id`
- **Response:**
```json
{
  "status": "success",
  "code": 200,
  "message": "Semester deleted successfully",
  "data": { ... }
}
```

## Frontend Implementation Guide
1. Ensure to include the `academic_year_id` when creating a new semester.
2. The `academicYear` object is eager-loaded and returned within each semester object to display the academic year info directly in tables.
3. Pass `page`, `limit`, and `search` query parameters for server-side pagination and searching.
