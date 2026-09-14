# Users API

CRUD user tersedia pada endpoint `/users` dan membutuhkan bearer token JWT.

## Endpoints

- `GET /users`: mengambil semua user aktif.
- `GET /users/:id`: mengambil user berdasarkan UUID.
- `POST /users`: membuat user baru.
- `PATCH /users/:id`: memperbarui user.
- `DELETE /users/:id`: melakukan soft delete user.

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

Delete mengembalikan `{ "success": true, "id": "<user-id>" }`. User yang dihapus tidak dikembalikan oleh endpoint list/detail.
