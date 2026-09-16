# Profiles API

## List profiles

`GET /profiles?page=1&limit=10&search=Ahmad`

Query parameters:

- `page`: nomor halaman, default `1`.
- `limit`: jumlah data per halaman, default `10`, maksimum `100`.
- `search`: pencarian case-insensitive berdasarkan nama lengkap, nomor identitas, email profile, nomor telepon, email user, nama institusi, role, agama, atau kewarganegaraan.

Response menggunakan pagination dan eager loading relasi `users`, `institution`, `role`, `religion`, dan `nationality`:

```json
{
  "status": "success",
  "message": "Profiles retrieved successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "userId": "uuid",
        "institutionId": "uuid",
        "fullName": "Ahmad Student",
        "email": "ahmad@example.com",
        "users": {
          "id": "uuid",
          "email": "ahmad@example.com",
          "is_active": true,
          "last_login": null
        },
        "institution": {
          "id": "uuid",
          "name": "Institution Name",
          "shortName": "INST"
        },
        "role": {
          "id": "uuid",
          "name": "Student",
          "description": "Student role"
        },
        "religion": {
          "id": "uuid",
          "name": "Religion"
        },
        "nationality": {
          "id": "uuid",
          "name": "Indonesian",
          "description": null
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

- `GET /profiles/:id`: mengambil detail profile beserta eager-loaded relations.
- `POST /profiles`: membuat profile baru.
- `PATCH /profiles/:id`: mengubah profile.
- `DELETE /profiles/:id`: soft delete profile.

Semua endpoint membutuhkan Bearer token. Password dan access token user tidak pernah dikembalikan dalam eager loading.
