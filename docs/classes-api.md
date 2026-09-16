# Classes API

## List classes

`GET /classes`

Query parameters:

- `page`: halaman, default `1`.
- `limit`: jumlah data per halaman, default `10`, maksimum `100`.
- `search`: mencari berdasarkan nama kelas, nama institusi, nomor guru wali, atau tahun akademik.

Response `data` berisi pagination dan eager loading relasi `institution`, `homeroom_teacher`, serta `academic_year`:

```json
{
  "status": "success",
  "message": "Classes retrieved successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "institution_id": "uuid",
        "homeroom_teacher_id": "uuid",
        "academic_year_id": "uuid",
        "name": "Class A",
        "grade_level": 10,
        "capacity": 32,
        "institution": {
          "id": "uuid",
          "name": "Institution Name",
          "shortName": "INST"
        },
        "homeroom_teacher": {
          "id": "uuid",
          "teacher_number": "T-001",
          "profile_id": "uuid"
        },
        "academic_year": {
          "id": "uuid",
          "academic_year": "2026/2027",
          "is_active": true
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

- `GET /classes/:id`: mengambil detail kelas beserta relasi eager-loaded.
- `POST /classes`: membuat kelas baru.
- `PATCH /classes/:id`: mengubah kelas; `homeroom_teacher_id` dan `capacity` dapat dikirim `null` untuk mengosongkan nilainya.
- `DELETE /classes/:id`: soft delete kelas.

Create body:

```json
{
  "institution_id": "uuid",
  "homeroom_teacher_id": "uuid",
  "academic_year_id": "uuid",
  "name": "Class A",
  "grade_level": 10,
  "capacity": 32
}
```
