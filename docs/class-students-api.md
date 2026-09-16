# Class Students API

## List class students

`GET /class-students`

Query parameters:

- `page`: halaman, default `1`.
- `limit`: jumlah data per halaman, default `10`, maksimum `100`.
- `search`: mencari berdasarkan nama kelas atau nomor siswa.

Response data menggunakan eager loading untuk ringkasan `classes` dan `student`:

```json
{
  "status": "success",
  "message": "Class students retrieved successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "classId": "uuid",
        "studentId": "uuid",
        "classes": {
          "id": "uuid",
          "name": "Class A",
          "grade_level": 10,
          "capacity": 32
        },
        "student": {
          "id": "uuid",
          "studentNumber": "20260001",
          "profileId": "uuid",
          "academicStatusId": "uuid"
        }
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

## Other operations

- `GET /class-students/:id`: mengambil assignment beserta relasi kelas dan siswa.
- `POST /class-students`: body `{ "classId": "uuid", "studentId": "uuid" }`.
- `PATCH /class-students/:id`: body parsial `classId` atau `studentId`.
- `DELETE /class-students/:id`: soft delete assignment.

Assignment duplikat untuk kombinasi kelas dan siswa ditolak dengan `409 Conflict`.