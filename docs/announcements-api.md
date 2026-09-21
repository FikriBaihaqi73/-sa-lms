# Announcements API

CRUD API untuk pengumuman institusi. Semua endpoint memerlukan header `Authorization: Bearer <token>` karena dilindungi global JWT guard.

## Endpoints

| Method | URL | Keterangan |
| --- | --- | --- |
| `GET` | `/announcements` | Daftar announcement dengan pagination dan search |
| `GET` | `/announcements/:id` | Detail announcement |
| `POST` | `/announcements` | Membuat announcement |
| `PATCH` | `/announcements/:id` | Mengubah announcement |
| `DELETE` | `/announcements/:id` | Soft-delete announcement |

## Query list

- `page`: nomor halaman, default `1`.
- `limit`: jumlah data per halaman, default `10`, maksimum `100`.
- `search`: mencari pada `title`, `content`, nama institusi, email creator, dan nama profil creator.

Response list memakai format project:

```json
{
  "status": "success",
  "message": "Announcements retrieved successfully",
  "data": [],
  "code": 200,
  "meta": {
    "totalData": 0,
    "totalPages": 0,
    "currentPage": 1,
    "perPage": 10
  }
}
```

## Request body

```json
{
  "institutionId": "00000000-0000-0000-0000-000000000001",
  "title": "Ujian tengah semester",
  "content": "Ujian dimulai pada pukul 08:00.",
  "isPublished": true,
  "publishedAt": "2026-09-22T08:00:00.000Z",
  "expiredAt": "2026-10-01T23:59:59.000Z"
}
```

`institutionId` harus berupa UUID, `title` wajib diisi dan maksimal 255 karakter, sedangkan field lain bersifat opsional. `publishedAt` dan `expiredAt` harus berupa ISO datetime. Update memakai field yang sama secara parsial.

## Relations

Response announcement melakukan eager loading terhadap `institution`, `creator`, `updater`, dan `deleter`. Data user tidak menyertakan password.

Delete menggunakan soft-delete, sehingga data tidak muncul lagi pada list atau detail normal tetapi tetap tersimpan di database.
