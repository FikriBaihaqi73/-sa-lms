# Entity Relationship Diagram (ERD)

## Deskripsi

Database ini digunakan untuk Sistem Informasi Akademik. Sistem ini mengelola data pengguna, administrator, guru, siswa, jurusan, kelas, mata pelajaran, jadwal, absensi, tugas, modul pembelajaran, pengumuman, dan hasil studi.

Seluruh tabel saling terhubung menggunakan Primary Key (PK) dan Foreign Key (FK) sehingga data tetap konsisten dan mudah dikelola.

---

# Diagram ERD

Diagram berikut menjelaskan hubungan antar tabel dalam sistem.

---

# Daftar Tabel

## 1. roles

Menyimpan data role pengguna.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| name | varchar | Nama role |
| description | text | Deskripsi role |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 2. admins

Menyimpan data administrator sistem.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| name | varchar | Nama administrator |
| email | varchar | Email |
| phone_number | varchar | Nomor telepon |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 3. departments

Menyimpan data jurusan.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| name | varchar | Nama jurusan |
| level | varchar | Tingkatan |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 4. classes

Menyimpan data kelas.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| department_id | uuid | Foreign Key ke departments |
| class_name | varchar | Nama kelas |
| grade | varchar | Tingkat kelas |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 5. students

Menyimpan data siswa.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| student_number | varchar | Nomor induk siswa |
| name | varchar | Nama siswa |
| gender | varchar | Jenis kelamin |
| birth_date | date | Tanggal lahir |
| class_id | uuid | Foreign Key ke classes |
| department_id | uuid | Foreign Key ke departments |
| address | text | Alamat |
| phone_number | varchar | Nomor telepon |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 6. teachers

Menyimpan data guru.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| employee_number | varchar | Nomor induk guru |
| name | varchar | Nama guru |
| gender | varchar | Jenis kelamin |
| birth_date | date | Tanggal lahir |
| department_id | uuid | Foreign Key ke departments |
| phone_number | varchar | Nomor telepon |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 7. users

Menyimpan akun pengguna yang digunakan untuk login.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| username | varchar | Username |
| password | varchar | Password |
| role_id | uuid | Foreign Key ke roles |
| admin_id | uuid | Foreign Key ke admins |
| teacher_id | uuid | Foreign Key ke teachers |
| student_id | uuid | Foreign Key ke students |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 8. subjects

Menyimpan data mata pelajaran.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| subject_name | varchar | Nama mata pelajaran |
| subject_code | varchar | Kode mata pelajaran |
| credits | int | Jumlah SKS |
| department_id | uuid | Foreign Key ke departments |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 9. schedules

Menyimpan jadwal pelajaran.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| class_id | uuid | Foreign Key ke classes |
| subject_id | uuid | Foreign Key ke subjects |
| teacher_id | uuid | Foreign Key ke teachers |
| day | varchar | Hari |
| start_time | time | Jam mulai |
| end_time | time | Jam selesai |
| classroom | varchar | Ruang kelas |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 10. attendances

Menyimpan data absensi siswa.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| schedule_id | uuid | Foreign Key ke schedules |
| student_id | uuid | Foreign Key ke students |
| attendance_date | date | Tanggal absensi |
| status | varchar | Status kehadiran |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 11. study_plans

Menyimpan data rencana studi siswa.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| student_id | uuid | Foreign Key ke students |
| subject_id | uuid | Foreign Key ke subjects |
| semester | int | Semester |
| academic_year | varchar | Tahun ajaran |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 12. teaching_journals

Menyimpan jurnal mengajar guru.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| schedule_id | uuid | Foreign Key ke schedules |
| meeting_number | int | Pertemuan ke- |
| journal_date | date | Tanggal |
| material | text | Materi |
| notes | text | Catatan |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 13. announcements

Menyimpan pengumuman.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| title | varchar | Judul |
| content | text | Isi pengumuman |
| admin_id | uuid | Foreign Key ke admins |
| announcement_date | date | Tanggal pengumuman |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 14. study_results

Menyimpan hasil studi siswa.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| student_id | uuid | Foreign Key ke students |
| semester | int | Semester |
| academic_year | varchar | Tahun ajaran |
| semester_gpa | decimal | Nilai IP Semester |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 15. assignment_types

Menyimpan jenis tugas.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| name | varchar | Nama jenis tugas |
| description | text | Deskripsi |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |

---

## 16. assignments

Menyimpan data tugas.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| class_id | uuid | Foreign Key ke classes |
| subject_id | uuid | Foreign Key ke subjects |
| teacher_id | uuid | Foreign Key ke teachers |
| assignment_type_id | uuid | Foreign Key ke assignment_types |
| title | varchar | Judul tugas |
| description | text | Deskripsi tugas |
| attachment | text | Lampiran |
| deadline | datetime | Batas pengumpulan |
| created_by | uuid | Foreign Key ke users |
| updated_by | uuid | Foreign Key ke users |
| deleted_by | uuid | Foreign Key ke users |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |
| deleted_at | timestamp | Waktu dihapus |

---

## 17. modules

Menyimpan modul pembelajaran.

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| id | uuid | Primary Key |
| subject_id | uuid | Foreign Key ke subjects |
| class_id | uuid | Foreign Key ke classes |
| title | varchar | Judul modul |
| description | text | Deskripsi |
| content | text | Isi modul |
| created_by | uuid | Foreign Key ke users |
| updated_by | uuid | Foreign Key ke users |
| deleted_by | uuid | Foreign Key ke users |
| created_at | timestamp | Waktu dibuat |
| updated_at | timestamp | Waktu diperbarui |
| deleted_at | timestamp | Waktu dihapus |

---

# Relasi

## One-to-Many

- departments → classes
- departments → students
- departments → teachers
- departments → subjects
- classes → students
- classes → schedules
- classes → assignments
- classes → modules
- roles → users
- teachers → schedules
- teachers → assignments
- subjects → schedules
- subjects → study_plans
- subjects → assignments
- subjects → modules
- schedules → attendances
- schedules → teaching_journals
- students → attendances
- students → study_plans
- students → study_results
- assignment_types → assignments
- admins → announcements

## One-to-One / Opsional

- admins → users
- teachers → users
- students → users

## Audit Relationship

Tabel `assignments` dan `modules` memiliki kolom:

- created_by
- updated_by
- deleted_by

Ketiga kolom tersebut merupakan Foreign Key yang mengarah ke tabel `users` untuk mencatat pengguna yang membuat, mengubah, atau menghapus data.