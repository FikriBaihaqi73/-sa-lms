# User Module & Repository Implementation Guide

Dokumentasi implementasi data access layer (`user.select.ts` dan `user.repository.ts`), DTO/schema, dan UserService/UserController untuk entitas **Users**.

---

## 1. Data Model (Prisma Schema Reference)

Berdasarkan `packages/shared/src/prisma/schema/Users.prisma`:

| Field | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | `UUID` (PK) | Primary Key user |
| `role_id` | `UUID` (FK) | Foreign Key ke tabel `Role` |
| `username` | `VarChar` (Unique) | Username unik untuk login |
| `password` | `VarChar` | Password hash |
| `is_active` | `Boolean` | Status keaktifan akun (default: `true`) |
| `last_login` | `Timestamp?` | Timestamp login terakhir |
| `created_at` | `Timestamp` | Waktu dibuat |
| `updated_at` | `Timestamp` | Waktu diperbarui |
| `deleted_at` | `Timestamp?` | Soft delete timestamp |

---

## 2. Select & Entity Layer (`@repo/shared/selects/user.select`)

### `userSelect`
Mendefinisikan atribut yang di-fetch secara default (mengecualikan kolom `password` untuk keamanan):

```typescript
export const userSelect = {
  id: true,
  role_id: true,
  username: true,
  is_active: true,
  last_login: true,
  created_at: true,
  updated_at: true,
  deleted_at: true,
} satisfies Prisma.UsersSelect;

export type UserSelectType = typeof userSelect;
export type UserEntity = Prisma.UsersGetPayload<{ select: UserSelectType }>;
```

### `userWithPasswordSelect`
Digunakan khusus untuk verifikasi autentikasi/login:

```typescript
export const userWithPasswordSelect = {
  ...userSelect,
  password: true,
} satisfies Prisma.UsersSelect;

export type UserWithPasswordEntity = Prisma.UsersGetPayload<{
  select: typeof userWithPasswordSelect;
}>;
```

---

## 3. Repository Layer (`@repo/shared/infrastructure/repository/user.repository`)

Repository mengelola operasi database dengan konsistensi soft-delete dan strict typing:

### Methods Available:
- `create(data: CreateUserInput): Promise<UserEntity>`: Membuat user baru.
- `findById(id: string): Promise<UserEntity | null>`: Mencari user aktif berdasarkan ID.
- `findByUsername(username: string): Promise<UserEntity | null>`: Mencari user aktif berdasarkan username.
- `findByRoleId(role_id: string): Promise<UserEntity[]>`: Mencari semua user aktif dalam role tertentu.
- `findAll(): Promise<UserEntity[]>`: Mengambil seluruh user aktif (`deleted_at: null`).
- `update(id: string, data: UpdateUserInput): Promise<UserEntity>`: Memperbarui field user secara parsial.
- `delete(id: string): Promise<UserEntity>`: Melakukan soft delete (`deleted_at: new Date()`).
- `findByUsernameWithPassword(username: string): Promise<UserWithPasswordEntity | null>`: Mencari user beserta hash password untuk autentikasi.
- `updateLastLogin(id: string): Promise<UserEntity>`: Memperbarui waktu `last_login`.

---

## 4. API Endpoints Specification

### Endpoints Overview

| Method | Endpoint | Summary |
| :--- | :--- | :--- |
| `GET` | `/users` | Get all users |
| `GET` | `/users/:id` | Get user by ID |
| `POST` | `/users` | Create new user |
| `PATCH` | `/users/:id` | Update user |
| `DELETE` | `/users/:id` | Delete user (soft delete) |

---

### Request & Response Examples

#### 1. Create User (`POST /users`)

**Request Body:**
```json
{
  "role_id": "223e4567-e89b-12d3-a456-426614174001",
  "username": "john_doe",
  "password": "SecretPassword123!",
  "is_active": true
}
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "code": 201,
  "message": "User created successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "role_id": "223e4567-e89b-12d3-a456-426614174001",
    "username": "john_doe",
    "is_active": true,
    "last_login": null,
    "created_at": "2026-08-20T03:00:00.000Z",
    "updated_at": "2026-08-20T03:00:00.000Z",
    "deleted_at": null
  }
}
```

#### 2. Get All Users (`GET /users`)

**Success Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "role_id": "223e4567-e89b-12d3-a456-426614174001",
      "username": "john_doe",
      "is_active": true,
      "last_login": null,
      "created_at": "2026-08-20T03:00:00.000Z",
      "updated_at": "2026-08-20T03:00:00.000Z",
      "deleted_at": null
    }
  ]
}
```

#### 3. Update User (`PATCH /users/:id`)

**Request Body:**
```json
{
  "username": "john_updated",
  "is_active": false
}
```

**Success Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "User updated successfully",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "role_id": "223e4567-e89b-12d3-a456-426614174001",
    "username": "john_updated",
    "is_active": false,
    "last_login": null,
    "created_at": "2026-08-20T03:00:00.000Z",
    "updated_at": "2026-08-20T03:05:00.000Z",
    "deleted_at": null
  }
}
```

#### 4. Delete User (`DELETE /users/:id`)

**Success Response (200 OK):**
```json
{
  "status": "success",
  "code": 200,
  "message": "User deleted successfully",
  "data": null
}
```

---

## 5. Frontend Integration Notes

1. **Password Security**: Field `password` tidak pernah dikembalikan dalam response `GET`, `POST`, maupun `PATCH`.
2. **Soft Delete**: Data yang dihapus tidak langsung hilang dari DB melainkan diberi timestamp `deleted_at`. Seluruh endpoint retrieval otomatis menyaring hanya record aktif (`deleted_at: null`).
3. **Role Relationship**: `role_id` harus berupa valid UUID yang terdaftar di tabel `Role`.
