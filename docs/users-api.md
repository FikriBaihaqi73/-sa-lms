# Users API

CRUD user tersedia pada endpoint `/users` dan membutuhkan bearer token JWT.

## Endpoints

- `GET /users`: mengambil user aktif dengan pagination, search, dan eager-loaded profile.
- `GET /users/:id`: mengambil user berdasarkan UUID.
- `POST /users`: membuat user baru.
- `PATCH /users/:id`: memperbarui user.
- `DELETE /users/:id`: melakukan soft delete user.

## List, pagination, dan search

`GET /users?page=1&limit=10&search=Ahmad`

Query parameters:

- `page`: nomor halaman, default `1`.
- `limit`: jumlah data per halaman, default `10`, maksimum `100`.
- `search`: pencarian case-insensitive berdasarkan email user, nama profile, nomor identitas, nomor telepon, nama institusi, atau role.

Setiap user membawa eager-loaded `profile` beserta relasi profile yang dipilih secara aman (`institution`, `role`, `religion`, dan `nationality`).

```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": {
    "data": [
      {
        "id": "uuid",
        "email": "user@example.com",
        "is_active": true,
        "last_login": null,
        "profile": [
          {
            "id": "uuid",
            "fullName": "Ahmad Student",
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
        ]
      }
    ],
    "meta": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  },
  "code": 200
}
```

## Create request

```json
{
  "email": "user@example.com",
  "password": "password123",
  "is_active": true
}
```

`email` harus valid dan unik. `password` harus memiliki panjang 8 sampai 128 karakter. Jika `is_active` tidak dikirim, nilainya mengikuti default schema `true`.

## Update request

Semua field bersifat opsional:

```json
{
  "email": "new-user@example.com",
  "password": "newpassword123",
  "is_active": false
}
```

Password di-hash sebelum disimpan. Email dinormalisasi menjadi lowercase dan duplikasi email ditolak.

## Response

Response sukses menggunakan format standar `ResponseHelper`:

```json
{
  "status": "success",
  "message": "Users retrieved successfully",
  "data": [],
  "code": 200
}
```

Delete mengembalikan `{ "success": true, "id": "<user-id>" }`. User yang dihapus tidak dikembalikan oleh endpoint list/detail. Field `password` dan `access_token` tidak pernah dikembalikan dalam response publik.
