# Students API

## List students

`GET /students?page=1&limit=10&search=Ahmad`

Query parameters:

- `page`: nomor halaman, default `1`.
- `limit`: jumlah data per halaman, default `10`, maksimum `100`.
- `search`: pencarian case-insensitive berdasarkan nomor siswa, nama lengkap, email, atau nomor identitas pada profile.

Response list menggunakan pagination dan eager loading `profile`, termasuk ringkasan `institution` dan `role`:

```json
{
  "status": "success",
  "message": "Students fetched successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "profileId": "uuid",
        "departmentId": "uuid",
        "academicStatusId": "uuid",
        "studentNumber": "STD-2026-001",
        "enrollmentYear": 2026,
        "profile": {
          "id": "uuid",
          "fullName": "Ahmad Student",
          "email": "ahmad@example.com",
          "phoneNumber": "081234567890",
          "institution": {
            "id": "uuid",
            "name": "Institution Name",
            "shortName": "INST"
          },
          "role": {
            "id": "uuid",
            "name": "Student"
          }
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

- `GET /students/:id`: mengambil detail student dengan eager-loaded profile.
- `POST /students`: membuat student baru.
- `PATCH /students/:id`: mengubah data student.
- `DELETE /students/:id`: soft delete student.

Semua endpoint Students memerlukan Bearer token. `departmentId` dan `academicStatusId` saat ini dikembalikan sebagai foreign key karena schema Prisma Student belum mendeklarasikan relation ke Department dan Academic Status.
