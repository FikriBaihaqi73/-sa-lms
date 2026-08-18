# SYSTEM ARCHITECTURE DOCUMENT

## Project NEXORA — System Architecture Specification

**Pola Arsitektur:** Layered Clean Architecture / Monolithic Scalable
**Versi:** v1.1.0 (revisi)

---

## 1. Gambaran Umum Sistem (System Overview)

Arsitektur Sistem Informasi Akademik (SIAKAD) dirancang untuk mendukung multi-tenant/multi-jenjang (SD, SMP, SMA, Perguruan Tinggi) dengan pemisahan tegas antara Master Data, Modul Akademik, Learning Management System (LMS), dan System Management.

## 2. Pilihan Teknologi (Tech Stack Definition)

| Layer | Pilihan Teknologi |
|---|---|
| **Frontend** | React, Next.js, Tailwind CSS. |
| **Backend** | Node.js + TypeScript, Express (atau NestJS bila tim ingin struktur modular bawaan yang lebih ketat untuk proyek multi-modul sebesar ini). |
| **Database** | PostgreSQL (data relasional utama), Prisma (ORM), Redis (cache, session/rate-limit, dan job queue). |
| **Object Storage** | Layanan S3-compatible (mis. AWS S3, Cloudflare R2, atau Supabase Storage) untuk file tugas & materi — bukan filesystem lokal, agar aman saat scaling horizontal. |
| **Hosting Frontend** | Vercel (cocok untuk Next.js). |
| **Hosting Backend** | Layanan yang mendukung koneksi persisten & background job (mis. Railway, Render, atau VPS/AWS ECS) — dipisah dari hosting frontend karena backend menggunakan koneksi Redis & Postgres yang persisten, kurang cocok untuk lingkungan serverless murni seperti Vercel Functions. |
| **CI/CD** | GitHub Actions untuk build, test, dan deploy otomatis ke staging/production. |

## 3. Strategi Multi-Tenancy

Karena Super Admin melakukan tenant provisioning (lihat PRD bagian 3) dan satu platform akan melayani banyak institusi sekaligus, strategi pemisahan data antar tenant perlu ditetapkan secara eksplisit. Tiga opsi umum:

- **Shared database, shared schema + kolom `tenant_id` (`institution_id`)** di setiap tabel — paling murah dioperasikan, cocok untuk jumlah tenant menengah-besar, tapi butuh disiplin ketat: SETIAP query wajib difilter `tenant_id` (di level ORM/middleware, bukan manual per query).
- **Shared database, schema per tenant** — isolasi lebih baik, tapi migrasi skema jadi lebih rumit saat jumlah tenant bertambah.
- **Database per tenant** — isolasi terbaik & memudahkan compliance, tapi biaya operasional & kompleksitas provisioning paling tinggi.

> **Perlu keputusan tim:** Untuk skala awal (peluncuran ke beberapa sekolah/kampus pertama), opsi "shared schema + tenant_id" dengan Row-Level Security PostgreSQL sebagai lapisan pengaman tambahan biasanya paling praktis. Tim perlu menetapkan target jumlah tenant di tahun pertama untuk memastikan pilihan ini masih sesuai.

## 4. Pola Akses Keamanan (Role-Based Access Control / RBAC)

Sistem menerapkan skema RBAC ketat melalui tiga tabel utama:

- `roles`: menyimpan entitas peran (Super Admin, Administrator, Teacher, Student, Guardian).
- `permissions`: menyimpan hak akses granular unik (misal: `student.create`, `grade.update`).
- `role_permissions`: menghubungkan role dengan permissions secara dinamis.

## 5. Struktur Relasi Database (Database Schema ERD)

### 5.1 Master Data Module

- `institutions`: mengakomodasi identitas sekolah/kampus (tenant).
- `academic_years`: pengaturan tahun ajaran (misal 2025/2026 Ganjil/Genap).
- `departments`: jurusan (SMA/SMK) atau program studi (Perguruan Tinggi).
- `users` & `profiles`: pemisahan data autentikasi akun dengan biodata diri.
- `teachers`, `students`, `guardians`, `student_guardians`: identitas spesifik entitas akademik.

### 5.2 Academic Module

- `subjects`: mata pelajaran atau mata kuliah (mencakup bobot SKS/Credits).
- `classes` & `class_students`: kelas beserta riwayat pendaftaran siswa per tahun ajaran.
- `class_subjects`: pemetaan pengampu guru pada mata pelajaran dan kelas tertentu.
- `schedules`: jadwal belajar harian (hari, jam, ruang).
- `attendances` & `teaching_journals`: presensi siswa dan jurnal pengajaran harian.
- `study_plans`: Kartu Rencana Studi (KRS) khusus jenjang Perguruan Tinggi.

### 5.3 Learning Management System (LMS) Module

- `assignment_types` & `assignments`: jenis dan rincian penugasan oleh guru.
- `assignment_submissions`: pengumpulan file tugas oleh siswa (status: Terkumpul / Terlambat).
- `modules` & `module_contents`: unggah materi pembelajaran daring.
- `grades` & `study_results`: penilaian dan rekapitulasi KHS/Rapor.

### 5.4 System Management Module

- `announcements`, `notifications`, `files`, `activity_logs`, `settings`.

Semua tabel di atas menyertakan kolom `institution_id` (`tenant_id`) sesuai strategi multi-tenancy pada bagian 3.

## 6. Keamanan API

- **Autentikasi:** JWT access token (umur pendek, ±15 menit) + refresh token (umur panjang, disimpan sebagai httpOnly, secure cookie — bukan localStorage, untuk mencegah pencurian token via XSS).
- **Rate limiting** per IP/akun (via Redis) untuk endpoint sensitif seperti `/auth/login`.
- **Validasi input** di setiap endpoint (skema validasi, mis. Zod) sebelum data masuk ke business logic.
- **CORS** dibatasi hanya ke origin frontend resmi.
- Semua trafik wajib **HTTPS/TLS**; terminasi TLS di level reverse proxy/load balancer.

## 7. Arsitektur Komunikasi API & Endpoint Utama

| Method | Endpoint Path | Fungsi Utama | Otorisasi |
|---|---|---|---|
| POST | `/api/v1/auth/login` | Autentikasi akun dan pengembalian JWT (access + refresh token). | Public |
| POST | `/api/v1/auth/refresh` | Memperbarui access token menggunakan refresh token. | Public (cookie) |
| POST | `/api/v1/auth/logout` | Invalidasi refresh token. | Authenticated |
| GET / POST | `/api/v1/students` | Manajemen data siswa (CRUD). | Admin |
| POST | `/api/v1/assignments` | Guru membuat tugas baru. | Teacher |
| POST | `/api/v1/assignments/:id/submit` | Siswa mengunggah file tugas. | Student |
| GET | `/api/v1/grades/me` | Siswa melihat hasil nilai/KHS. | Student |
| GET | `/api/v1/attendances` | Melihat rekap presensi (difilter kelas/tanggal). | Teacher, Admin |

> **Catatan revisi:** Tabel ini adalah contoh endpoint representatif, bukan daftar lengkap. Endpoint `auth/refresh` & `auth/logout` ditambahkan karena strategi JWT di bagian 6 membutuhkannya. Untuk kebutuhan dev sehari-hari, sebaiknya dilengkapi dengan spesifikasi OpenAPI/Swagger terpisah.

## 8. Strategi Deployment & Lingkungan

- Tiga lingkungan terpisah: **development, staging, production** — dengan konfigurasi environment variable dan database masing-masing.
- Backend dikemas dalam **container (Docker)** agar konsisten antara lokal, staging, dan production, serta memudahkan scaling horizontal di kemudian hari.
- Redis digunakan untuk: (a) cache query yang sering diakses, (b) job queue (mis. BullMQ) untuk proses asinkron seperti pengiriman notifikasi/email agar tidak memblokir request utama.

## 9. Ringkasan Diagram Alur Layanan (High-Level Diagram)

```
[ Mobile / Web Client ] (Siswa / Guru / Admin / Wali)
          |
          v  (HTTPS / REST API + JWT)
  [ API Gateway / Reverse Proxy ]  — TLS termination, rate limiting
          |
          v
  [ Backend Application Service ]  (Node.js + TypeScript, containerized)
     /        |        \           \
    v         v         v            v
[PostgreSQL] [Redis]  [Object Storage] [Job Queue Worker]
(per-tenant   (cache,   (S3-compatible,  (notifikasi/email,
 via tenant_id) queue)   file tugas)      async task)
```