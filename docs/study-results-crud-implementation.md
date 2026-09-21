# Study Results (Hasil Studi / KHS) CRUD Implementation Guide

Dokumen ini ditujukan untuk Frontend Developer sebagai panduan lengkap integrasi fitur **CRUD Study Results (KHS)** dengan dukungan **Eager Loading**, **Paginasi**, dan **Pencarian (Search)**.

---

## 1. Ringkasan Endpoint

| Method | Endpoint | Deskripsi |
| :--- | :--- | :--- |
| `GET` | `/study-results` | Mengambil daftar study results dengan paginasi, search, dan eager loaded relations |
| `GET` | `/study-results/:id` | Mengambil detail study result berdasarkan ID |
| `GET` | `/study-results/student/:studentId` | Mengambil daftar study result milik student tertentu |
| `GET` | `/study-results/academic-year/:academicYearId` | Mengambil daftar study result berdasarkan tahun akademik |
| `GET` | `/study-results/semester/:semesterId` | Mengambil daftar study result berdasarkan semester |
| `POST` | `/study-results` | Membuat data study result baru |
| `PATCH` | `/study-results/:id` | Mengupdate data study result |
| `DELETE` | `/study-results/:id` | Menghapus (soft-delete) data study result |

---

## 2. Autentikasi & Header

Semua request membutuhkan header Authorization berupa JWT token:

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

---

## 3. Detail Endpoint & Contoh Payloads

### A. GET `/study-results` (List with Pagination & Search)

#### Query Parameters:
- `page` (optional, default: `1`): Nomor halaman.
- `limit` (optional, default: `10`): Jumlah data per halaman.
- `search` (optional): Kata kunci pencarian. Mencari berdasarkan:
  - Nomor Induk Siswa (`studentNumber`)
  - Nama Lengkap Siswa (`student.profile.fullName`)
  - Tahun Akademik (`academicYear.academic_year`)
  - Nama Semester (`semester.name`)
  - Status Akademik (`academicStatus.name`)

#### Contoh Request:
`GET /study-results?page=1&limit=10&search=John`

#### Contoh Response (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Study results retrieved successfully",
  "data": [
    {
      "id": "e4b2a8d3-9f5e-4c7b-8a2f-1d3e5f7a9b0c",
      "createdAt": "2026-09-21T08:00:00.000Z",
      "updatedAt": "2026-09-21T08:00:00.000Z",
      "deletedAt": null,
      "studentId": "b1a2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
      "academicYearId": "c1d2e3f4-a5b6-7c8d-9e0f-a1b2c3d4e5f6",
      "semesterId": "d1e2f3a4-b5c6-7d8e-9f0a-b1c2d3e4f5a6",
      "totalCredits": 24,
      "semesterGpa": 3.85,
      "cumulativeGpa": 3.80,
      "academicStatusId": "f1a2b3c4-d5e6-7f8a-9b0c-d1e2f3a4b5c6",
      "student": {
        "id": "b1a2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
        "studentNumber": "2024001",
        "profile": {
          "id": "p1a2b3c4-d5e6-7f8a-9b0c-d1e2f3a4b5c6",
          "fullName": "John Doe",
          "email": "john.doe@example.com"
        }
      },
      "academicYear": {
        "id": "c1d2e3f4-a5b6-7c8d-9e0f-a1b2c3d4e5f6",
        "academic_year": "2024/2025",
        "is_active": true
      },
      "semester": {
        "id": "d1e2f3a4-b5c6-7d8e-9f0a-b1c2d3e4f5a6",
        "name": "Ganjil 2024/2025",
        "is_active": true
      },
      "academicStatus": {
        "id": "f1a2b3c4-d5e6-7f8a-9b0c-d1e2f3a4b5c6",
        "name": "Aktif",
        "description": "Mahasiswa/Siswa Aktif"
      }
    }
  ],
  "meta": {
    "totalData": 1,
    "totalPages": 1,
    "currentPage": 1,
    "perPage": 10
  }
}
```

---

### B. GET `/study-results/:id`

#### Contoh Response (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Study result detail retrieved successfully",
  "data": {
    "id": "e4b2a8d3-9f5e-4c7b-8a2f-1d3e5f7a9b0c",
    "studentId": "b1a2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
    "academicYearId": "c1d2e3f4-a5b6-7c8d-9e0f-a1b2c3d4e5f6",
    "semesterId": "d1e2f3a4-b5c6-7d8e-9f0a-b1c2d3e4f5a6",
    "totalCredits": 24,
    "semesterGpa": 3.85,
    "cumulativeGpa": 3.80,
    "academicStatusId": "f1a2b3c4-d5e6-7f8a-9b0c-d1e2f3a4b5c6",
    "student": { ... },
    "academicYear": { ... },
    "semester": { ... },
    "academicStatus": { ... }
  }
}
```

---

### C. POST `/study-results`

#### Request Body:
```json
{
  "studentId": "b1a2c3d4-e5f6-7a8b-9c0d-e1f2a3b4c5d6",
  "academicYearId": "c1d2e3f4-a5b6-7c8d-9e0f-a1b2c3d4e5f6",
  "semesterId": "d1e2f3a4-b5c6-7d8e-9f0a-b1c2d3e4f5a6",
  "totalCredits": 24,
  "semesterGpa": 3.85,
  "cumulativeGpa": 3.80,
  "academicStatusId": "f1a2b3c4-d5e6-7f8a-9b0c-d1e2f3a4b5c6"
}
```

#### Field Rules:
- `studentId` (string, UUID, mandatory): ID dari siswa.
- `academicYearId` (string, UUID, mandatory): ID tahun akademik.
- `semesterId` (string, UUID, mandatory): ID semester.
- `totalCredits` (integer, optional, min: 0): Jumlah SKS/Kredit yang diambil.
- `semesterGpa` (number, optional, range 0.0 - 4.0): IPS (Indeks Prestasi Semester).
- `cumulativeGpa` (number, optional, range 0.0 - 4.0): IPK (Indeks Prestasi Kumulatif).
- `academicStatusId` (string, UUID, optional, nullable): ID status akademik (e.g., Aktif, Cuti, Lulus).

#### Contoh Response (201 Created):
```json
{
  "status": "success",
  "code": 201,
  "message": "Study result created successfully",
  "data": { ... }
}
```

---

### D. PATCH `/study-results/:id`

#### Request Body (Semua field bersifat optional):
```json
{
  "semesterGpa": 3.90,
  "cumulativeGpa": 3.85
}
```

#### Contoh Response (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Study result updated successfully",
  "data": { ... }
}
```

---

### E. DELETE `/study-results/:id`

#### Contoh Response (200 OK):
```json
{
  "status": "success",
  "code": 200,
  "message": "Study result deleted successfully",
  "data": { ... }
}
```

---

## 4. Penanganan Error (Validation & Edge Cases)

### A. Validation Error (400 Bad Request)
Jika input tidak valid (misal GPA > 4.0 atau format UUID salah):
```json
{
  "status": "error",
  "code": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "semesterGpa",
      "message": "GPA must not exceed 4.0"
    }
  ]
}
```

### B. Entity Not Found (404 Not Found)
Jika `studentId`, `academicYearId`, `semesterId`, `academicStatusId`, atau `id` tidak ditemukan:
```json
{
  "status": "error",
  "code": 404,
  "message": "Student not found"
}
```

### C. Duplicate Entry (409 Conflict)
Kombinasi `(studentId, academicYearId, semesterId)` bersifat unik. Jika sudah ada data untuk siswa di tahun akademik & semester tersebut:
```json
{
  "status": "error",
  "code": 409,
  "message": "Study result record already exists for this student, academic year, and semester"
}
```

---

## 5. Panduan Alur Implementasi Frontend

1. **Daftar KHS (Table View)**:
   - Gunakan `GET /study-results?page={page}&limit={limit}&search={query}`.
   - Tampilkan informasi siswa (`student.profile.fullName`, `student.studentNumber`), Tahun Akademik (`academicYear.academic_year`), Semester (`semester.name`), Total Kredit (`totalCredits`), IPS (`semesterGpa`), IPK (`cumulativeGpa`), dan Status (`academicStatus.name`).
   - Implementasikan debouncing (misal 300ms) pada input search bar sebelum memanggil API.

2. **Form Tambah / Edit KHS**:
   - Untuk dropdown relasi, panggil endpoint master data masing-masing:
     - `GET /students` (pilih siswa)
     - `GET /academic-years` (pilih tahun akademik)
     - `GET /semesters` (pilih semester)
     - `GET /academic-statuses` (pilih status akademik)
   - Validasi nilai IPS/IPK pada rentang 0.00 hingga 4.00 di form sebelum submit.
   - Tangani error `409 Conflict` dengan menampilkan notifikasi: "Siswa ini sudah memiliki KHS pada tahun akademik & semester yang dipilih."
