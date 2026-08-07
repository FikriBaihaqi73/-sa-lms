# Part 1 - Master Data

## Overview

Master Data merupakan kumpulan tabel referensi yang digunakan oleh seluruh modul dalam sistem. Tabel-tabel ini menyimpan data dasar seperti role, permission, tahun akademik, status akademik, agama, kewarganegaraan, dan data referensi lainnya.

---

# Roles

Digunakan untuk menyimpan daftar role pengguna dalam sistem.

```dbml
Table roles {
  id uuid [pk]

  name varchar [not null, unique]
  description text
  created_at timestamp
  updated_at timestamp
}
```

---

# Permissions

Digunakan untuk menyimpan daftar permission (hak akses) pada setiap modul.

```dbml
Table permissions {
  id uuid [pk]

  name varchar [not null, unique]
  module varchar [not null]
  description text

  created_at timestamp
  updated_at timestamp
}
```

---

# Role Permissions

Merupakan tabel pivot yang menghubungkan Role dengan Permission.

Satu role dapat memiliki banyak permission dan satu permission dapat dimiliki oleh banyak role.

```dbml
Table role_permissions {
  id uuid [pk]

  role_id uuid [not null, ref: > roles.id]
  permission_id uuid [not null, ref: > permissions.id]

  created_at timestamp

  Indexes {
    (role_id, permission_id) [unique]
  }
}
```

---

# Institution Levels

Menyimpan jenis atau jenjang institusi.

Contoh:

- SD
- SMP
- SMA
- SMK
- Universitas

```dbml
Table institution_levels {
  id uuid [pk]

  name varchar [not null, unique]
  description text

  created_at timestamp
  updated_at timestamp
}
```

---

# Academic Years

Menyimpan daftar tahun akademik.

```dbml
Table academic_years {
  id uuid [pk]

  academic_year varchar [not null, unique]

  is_active boolean [default: false]

  created_at timestamp
  updated_at timestamp
}
```

---

# Academic Statuses

Digunakan untuk menyimpan status akademik mahasiswa atau siswa.

Contoh:

- Aktif
- Cuti
- Lulus
- Drop Out

```dbml
Table academic_statuses {
  id uuid [pk]

  name varchar [not null, unique]
  description text

  created_at timestamp
  updated_at timestamp
}
```

---

# Employment Statuses

Digunakan untuk menyimpan status kepegawaian guru atau dosen.

Contoh:

- Tetap
- Honorer
- Kontrak

```dbml
Table employment_statuses {
  id uuid [pk]

  name varchar [not null, unique]
  description text

  created_at timestamp
  updated_at timestamp
}
```

---

# Specializations

Menyimpan data bidang keahlian atau spesialisasi guru.

```dbml
Table specializations {
  id uuid [pk]

  name varchar [not null, unique]
  description text

  created_at timestamp
  updated_at timestamp
}
```

---

# Assignment Types

Digunakan untuk menyimpan jenis tugas atau penilaian.

Contoh:

- Tugas
- Quiz
- UTS
- UAS

```dbml
Table assignment_types {
  id uuid [pk]

  name varchar [not null, unique]
  description text

  created_at timestamp
  updated_at timestamp
}
```

---

# Attendance Statuses

Digunakan sebagai referensi status kehadiran.

Contoh:

- Hadir
- Izin
- Sakit
- Alpha

```dbml
Table attendance_statuses {
  id uuid [pk]

  name varchar [not null, unique]
  description text

  created_at timestamp
  updated_at timestamp
}
```

---

# Grades

Digunakan untuk menentukan rentang nilai huruf.

Contoh:

| Grade | Minimum | Maximum |
|--------|---------|---------|
| A | 85 | 100 |
| B | 70 | 84 |
| C | 55 | 69 |

```dbml
Table grades {
  id uuid [pk]

  grade varchar [not null, unique]

  minimum_score decimal(5,2)

  maximum_score decimal(5,2)

  description text

  created_at timestamp
  updated_at timestamp
}
```

---

# Religions

Menyimpan daftar agama.

Contoh:

- Islam
- Kristen
- Katolik
- Hindu
- Buddha
- Konghucu

```dbml
Table religions {
  id uuid [pk]

  name varchar [not null, unique]

  created_at timestamp
  updated_at timestamp
}
```

---

# Nationalities

Menyimpan daftar kewarganegaraan.

Contoh:

- Indonesia
- Malaysia
- Singapore

```dbml
Table nationalities {
  id uuid [pk]

  name varchar [not null, unique]

  created_at timestamp
  updated_at timestamp
}
```

---

# Summary

Part 1 terdiri dari **12 tabel master** yang menjadi referensi utama bagi seluruh modul dalam sistem School Academic Learning Management System (SA-LMS).

Seluruh tabel pada bagian ini bersifat **master/reference data**, sehingga akan digunakan sebagai foreign key oleh tabel-tabel pada modul User Management, Academic Management, LMS, Assessment, maupun System Management.




# Part 2 - User Management

## Overview

User Management merupakan modul yang bertanggung jawab dalam mengelola seluruh data pengguna pada sistem. Modul ini mencakup pengelolaan institusi, akun pengguna, profil, guru, siswa, wali siswa, serta hubungan antar entitas yang berkaitan dengan identitas pengguna.

---

# Institutions

Menyimpan data institusi atau sekolah yang menggunakan sistem.

```dbml
Table institutions {
  id uuid [pk]

  institution_level_id uuid [not null, ref: > institution_levels.id]

  name varchar [not null]
  short_name varchar

  address text
  city varchar
  province varchar
  postal_code varchar

  phone_number varchar
  email varchar
  website varchar

  logo_url text

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Users

Menyimpan akun yang digunakan untuk login ke dalam sistem.

Setiap user memiliki satu role sebagai pengatur hak akses.

```dbml
Table users {
  id uuid [pk]

  role_id uuid [not null, ref: > roles.id]

  username varchar [not null, unique]
  password varchar [not null]

  is_active boolean [default: true]
  last_login timestamp

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Profiles

Menyimpan informasi pribadi dari setiap pengguna.

Satu user hanya memiliki satu profile.

```dbml
Table profiles {
  id uuid [pk]

  user_id uuid [not null, unique, ref: > users.id]
  institution_id uuid [not null, ref: > institutions.id]

  full_name varchar [not null]

  identity_number varchar

  gender varchar

  birth_place varchar
  birth_date date

  religion_id uuid [ref: > religions.id]
  nationality_id uuid [ref: > nationalities.id]

  address text

  phone_number varchar
  email varchar

  photo_url text

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Departments

Menyimpan data jurusan atau program studi pada suatu institusi.

```dbml
Table departments {
  id uuid [pk]

  institution_id uuid [not null, ref: > institutions.id]

  name varchar [not null]
  description text

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Teachers

Menyimpan data guru atau dosen.

Setiap teacher memiliki satu profile dan dapat terhubung dengan department, specialization, serta employment status.

```dbml
Table teachers {
  id uuid [pk]

  profile_id uuid [not null, unique, ref: > profiles.id]

  department_id uuid [ref: > departments.id]

  specialization_id uuid [ref: > specializations.id]

  employment_status_id uuid [ref: > employment_statuses.id]

  teacher_number varchar [not null, unique]

  join_date date

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Students

Menyimpan data siswa atau mahasiswa.

Setiap student memiliki satu profile dan satu academic status.

```dbml
Table students {
  id uuid [pk]

  profile_id uuid [not null, unique, ref: > profiles.id]

  department_id uuid [ref: > departments.id]

  academic_status_id uuid [not null, ref: > academic_statuses.id]

  student_number varchar [not null, unique]

  enrollment_year int

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Guardians

Menyimpan informasi wali atau orang tua siswa.

```dbml
Table guardians {
  id uuid [pk]

  full_name varchar [not null]

  relationship varchar

  phone_number varchar
  email varchar

  address text

  occupation varchar

  created_at timestamp
  updated_at timestamp
}
```

---

# Student Guardians

Merupakan tabel penghubung antara siswa dan wali.

Satu siswa dapat memiliki lebih dari satu wali, dan satu wali dapat terhubung ke beberapa siswa.

```dbml
Table student_guardians {
  id uuid [pk]

  student_id uuid [not null, ref: > students.id]

  guardian_id uuid [not null, ref: > guardians.id]

  is_primary boolean [default: false]

  created_at timestamp

  Indexes {
    (student_id, guardian_id) [unique]
  }
}
```

---

# Entity Relationship

Hubungan antar tabel pada modul User Management:

```text
Institution Level
        │
        ▼
 Institutions
        │
        ├──────────────┐
        ▼              ▼
   Departments     Profiles
                       │
                 ┌─────┴─────┐
                 ▼           ▼
              Teachers    Students
                               │
                               ▼
                      Student Guardians
                               ▲
                               │
                          Guardians

Roles
   │
   ▼
Users
   │
   ▼
Profiles
```

---

# Summary

Part 2 terdiri dari **8 tabel** yang berfungsi sebagai pusat pengelolaan pengguna dalam sistem.

Modul ini mengatur:

- Data institusi
- Akun pengguna
- Informasi profil
- Data guru
- Data siswa
- Data jurusan
- Data wali
- Relasi antara siswa dan wali

Seluruh tabel pada modul ini menjadi dasar bagi modul Academic Management, Learning Management System (LMS), Assessment System, serta System Management.


# Part 3 - Academic Management

## Overview

Academic Management merupakan modul yang mengelola seluruh aktivitas akademik dalam sistem. Modul ini mencakup pengelolaan kelas, mata pelajaran, jadwal pembelajaran, kehadiran siswa, jurnal mengajar, hingga rencana studi siswa.

---

# Classes

Menyimpan data kelas yang dimiliki oleh suatu institusi pada tahun akademik tertentu.

Setiap kelas dapat memiliki seorang wali kelas (homeroom teacher) dan terdiri dari banyak siswa.

```dbml
Table classes {
  id uuid [pk]

  institution_id uuid [not null, ref: > institutions.id]

  homeroom_teacher_id uuid [ref: > teachers.id]

  academic_year_id uuid [not null, ref: > academic_years.id]

  name varchar [not null]

  grade_level int [not null]

  capacity int

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Class Students

Merupakan tabel penghubung antara kelas dan siswa.

Satu kelas memiliki banyak siswa dan satu siswa hanya dapat terdaftar pada satu kelas untuk periode akademik tertentu.

```dbml
Table class_students {
  id uuid [pk]

  class_id uuid [not null, ref: > classes.id]

  student_id uuid [not null, ref: > students.id]

  created_at timestamp

  Indexes {
    (class_id, student_id) [unique]
  }
}
```

---

# Subjects

Menyimpan daftar mata pelajaran yang tersedia pada suatu institusi.

Setiap mata pelajaran dapat dikaitkan dengan jurusan tertentu.

```dbml
Table subjects {
  id uuid [pk]

  institution_id uuid [not null, ref: > institutions.id]

  department_id uuid [ref: > departments.id]

  code varchar [not null, unique]

  name varchar [not null]

  credits int

  description text

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Class Subjects

Menghubungkan kelas, mata pelajaran, guru, dan tahun akademik.

Tabel ini menentukan guru yang mengajar suatu mata pelajaran pada kelas tertentu.

```dbml
Table class_subjects {
  id uuid [pk]

  class_id uuid [not null, ref: > classes.id]

  subject_id uuid [not null, ref: > subjects.id]

  teacher_id uuid [not null, ref: > teachers.id]

  academic_year_id uuid [not null, ref: > academic_years.id]

  created_at timestamp

  Indexes {
    (class_id, subject_id, teacher_id, academic_year_id) [unique]
  }
}
```

---

# Schedules

Menyimpan jadwal pembelajaran setiap mata pelajaran.

Jadwal menentukan hari, waktu pelaksanaan, dan ruang kelas yang digunakan.

```dbml
Table schedules {
  id uuid [pk]

  class_subject_id uuid [not null, ref: > class_subjects.id]

  classroom_id uuid [not null, ref: > classrooms.id]

  day varchar [not null]

  start_time time

  end_time time

  created_at timestamp
  updated_at timestamp
}
```

---

# Attendances

Menyimpan data kehadiran siswa pada setiap jadwal pembelajaran.

Status kehadiran mengacu pada tabel **attendance_statuses**.

```dbml
Table attendances {
  id uuid [pk]

  schedule_id uuid [not null, ref: > schedules.id]

  student_id uuid [not null, ref: > students.id]

  attendance_status_id uuid [not null, ref: > attendance_statuses.id]

  attendance_date date

  notes text

  created_at timestamp
  updated_at timestamp

  Indexes {
    (schedule_id, student_id, attendance_date) [unique]
  }
}
```

---

# Teaching Journals

Menyimpan jurnal mengajar yang dibuat oleh guru pada setiap pertemuan.

Informasi yang dicatat meliputi materi pembelajaran, topik, nomor pertemuan, dan catatan tambahan.

```dbml
Table teaching_journals {
  id uuid [pk]

  schedule_id uuid [not null, ref: > schedules.id]

  meeting_number int

  journal_date date

  topic varchar

  material text

  notes text

  created_by uuid [ref: > users.id]

  updated_by uuid [ref: > users.id]

  created_at timestamp
  updated_at timestamp
}
```

---

# Study Plans

Menyimpan rencana studi (study plan) siswa pada setiap mata pelajaran di tahun akademik tertentu.

Tabel ini memastikan siswa hanya dapat mengambil satu kombinasi mata pelajaran pada tahun akademik yang sama.

```dbml
Table study_plans {
  id uuid [pk]

  student_id uuid [not null, ref: > students.id]

  class_subject_id uuid [not null, ref: > class_subjects.id]

  academic_year_id uuid [not null, ref: > academic_years.id]

  created_at timestamp
  updated_at timestamp

  Indexes {
    (student_id, class_subject_id, academic_year_id) [unique]
  }
}
```

---

# Entity Relationship

```text
Institutions
      │
      ▼
   Classes ──────────────┐
      │                  │
      ▼                  ▼
Class Students     Class Subjects
      │                  │
      ▼                  ▼
 Students          Subjects
                         │
                         ▼
                    Schedules
                   ┌─────┴─────┐
                   ▼           ▼
            Attendances   Teaching Journals
                   │
                   ▼
             Attendance Statuses

Students
    │
    ▼
Study Plans
    ▲
    │
Class Subjects
```

---

# Summary

Part 3 terdiri dari **8 tabel** yang mengelola proses akademik dalam sistem, meliputi:

- Pengelolaan kelas
- Keanggotaan siswa dalam kelas
- Mata pelajaran
- Penugasan guru pada mata pelajaran
- Jadwal pembelajaran
- Kehadiran siswa
- Jurnal mengajar
- Rencana studi siswa

Seluruh tabel pada modul ini menjadi dasar bagi modul **Learning Management System (LMS)** dan **Assessment System**, karena proses pembelajaran, penugasan, dan penilaian bergantung pada data akademik yang dikelola pada bagian ini.


# Part 4 - Learning Management System (LMS)

## Overview

Learning Management System (LMS) merupakan modul yang mendukung proses pembelajaran secara digital. Modul ini mengelola materi pembelajaran, konten modul, penugasan, serta pengumpulan tugas oleh siswa.

---

# Modules

Menyimpan informasi mengenai modul pembelajaran yang dibuat oleh guru untuk suatu mata pelajaran.

Setiap modul dapat berisi beberapa materi pembelajaran dan memiliki status publikasi.

```dbml
Table modules {
  id uuid [pk]

  class_subject_id uuid [not null, ref: > class_subjects.id]

  title varchar [not null]

  description text

  display_order int

  is_published boolean [default: false]

  is_locked boolean [default: false]

  created_by uuid [ref: > users.id]

  updated_by uuid [ref: > users.id]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Module Contents

Menyimpan isi atau materi yang terdapat dalam suatu modul pembelajaran.

Konten dapat berupa teks maupun file pendukung yang diunggah oleh guru.

```dbml
Table module_contents {
  id uuid [pk]

  module_id uuid [not null, ref: > modules.id]

  title varchar [not null]

  content_type varchar [not null]

  content text

  file_id uuid [ref: > files.id]

  sort_order int

  created_at timestamp
  updated_at timestamp

  Indexes {
    (module_id, sort_order)
  }
}
```

---

# Assignments

Menyimpan data tugas yang diberikan kepada siswa.

Setiap tugas terhubung dengan mata pelajaran, jenis tugas, serta dapat memiliki lampiran file.

```dbml
Table assignments {
  id uuid [pk]

  class_subject_id uuid [not null, ref: > class_subjects.id]

  assignment_type_id uuid [not null, ref: > assignment_types.id]

  title varchar [not null]

  description text

  attachment_file_id uuid [ref: > files.id]

  start_date datetime

  due_date datetime

  maximum_score decimal(5,2)

  created_by uuid [ref: > users.id]

  updated_by uuid [ref: > users.id]

  deleted_by uuid [ref: > users.id]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Assignment Submissions

Menyimpan hasil pengumpulan tugas yang dilakukan oleh siswa.

Data yang disimpan meliputi file tugas, waktu pengumpulan, nilai, umpan balik, serta informasi guru yang melakukan penilaian.

```dbml
Table assignment_submissions {
  id uuid [pk]

  assignment_id uuid [not null, ref: > assignments.id]

  student_id uuid [not null, ref: > students.id]

  submission_file_id uuid [ref: > files.id]

  submitted_at datetime

  score decimal(5,2)

  feedback text

  status varchar

  graded_by uuid [ref: > users.id]

  graded_at datetime

  created_at timestamp
  updated_at timestamp

  Indexes {
    (assignment_id, student_id) [unique]
  }
}
```

---

# Entity Relationship

```text
Class Subjects
       │
       ▼
    Modules
       │
       ▼
Module Contents
       │
       └──────────────► Files

Class Subjects
       │
       ▼
Assignments
       │
       ├──────────────► Assignment Types
       │
       ├──────────────► Files (Attachment)
       │
       ▼
Assignment Submissions
       │
       ├──────────────► Students
       ├──────────────► Files (Submission)
       └──────────────► Users (Graded By)
```

---

# Summary

Part 4 terdiri dari **4 tabel** yang membentuk modul **Learning Management System (LMS)**, yaitu:

- **Modules** – Mengelola modul pembelajaran.
- **Module Contents** – Menyimpan materi atau isi dari setiap modul.
- **Assignments** – Mengelola tugas yang diberikan kepada siswa.
- **Assignment Submissions** – Menyimpan hasil pengumpulan tugas beserta proses penilaiannya.

Modul ini mendukung proses pembelajaran digital dengan menyediakan media distribusi materi, pemberian tugas, pengumpulan tugas oleh siswa, hingga proses penilaian oleh guru.


# Part 5 - Assessment System

## Overview

Assessment System merupakan modul yang mengelola seluruh proses penilaian akademik dalam sistem. Modul ini mencakup pembuatan ujian, pencatatan nilai ujian, perhitungan nilai akhir siswa, hingga penyusunan hasil studi berdasarkan semester dan tahun akademik.

---

# Examinations

Menyimpan data ujian yang diberikan kepada siswa pada suatu mata pelajaran.

Setiap ujian dikaitkan dengan mata pelajaran, jenis ujian, serta memiliki informasi tanggal pelaksanaan, durasi, dan nilai maksimum.

```dbml
Table examinations {
  id uuid [pk]

  class_subject_id uuid [not null, ref: > class_subjects.id]

  assignment_type_id uuid [not null, ref: > assignment_types.id]

  title varchar [not null]

  description text

  examination_date datetime

  duration int

  maximum_score decimal(5,2)

  created_by uuid [ref: > users.id]

  updated_by uuid [ref: > users.id]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Examination Scores

Menyimpan nilai hasil ujian setiap siswa.

Setiap siswa hanya memiliki satu nilai untuk setiap ujian.

```dbml
Table examination_scores {
  id uuid [pk]

  examination_id uuid [not null, ref: > examinations.id]

  student_id uuid [not null, ref: > students.id]

  score decimal(5,2)

  notes text

  graded_by uuid [ref: > users.id]

  graded_at datetime

  created_at timestamp
  updated_at timestamp

  Indexes {
    (examination_id, student_id) [unique]
  }
}
```

---

# Student Grades

Menyimpan rekapitulasi nilai siswa pada setiap mata pelajaran dalam satu tahun akademik.

Nilai akhir diperoleh dari gabungan berbagai komponen penilaian seperti tugas, kuis, ujian tengah semester, dan ujian akhir semester.

```dbml
Table student_grades {
  id uuid [pk]

  student_id uuid [not null, ref: > students.id]

  class_subject_id uuid [not null, ref: > class_subjects.id]

  academic_year_id uuid [not null, ref: > academic_years.id]

  assignment_score decimal(5,2)

  quiz_score decimal(5,2)

  mid_exam_score decimal(5,2)

  final_exam_score decimal(5,2)

  final_score decimal(5,2)

  grade_id uuid [ref: > grades.id]

  remarks text

  created_at timestamp
  updated_at timestamp

  Indexes {
    (student_id, class_subject_id, academic_year_id) [unique]
  }
}
```

---

# Study Results

Menyimpan hasil studi siswa pada setiap semester.

Data yang disimpan meliputi total SKS yang ditempuh, IP Semester (IPS), IP Kumulatif (IPK), serta status akademik siswa.

```dbml
Table study_results {
  id uuid [pk]

  student_id uuid [not null, ref: > students.id]

  academic_year_id uuid [not null, ref: > academic_years.id]

  semester_id uuid [not null, ref: > semesters.id]

  total_credits int

  semester_gpa decimal(4,2)

  cumulative_gpa decimal(4,2)

  academic_status_id uuid [ref: > academic_statuses.id]

  created_at timestamp
  updated_at timestamp

  Indexes {
    (student_id, academic_year_id, semester_id) [unique]
  }
}
```

---

# Entity Relationship

```text
Class Subjects
       │
       ▼
Examinations
       │
       ├──────────────► Assignment Types
       │
       ▼
Examination Scores
       │
       ├──────────────► Students
       └──────────────► Users (Graded By)

Students
       │
       ▼
Student Grades
       │
       ├──────────────► Class Subjects
       ├──────────────► Academic Years
       └──────────────► Grades

Students
       │
       ▼
Study Results
       │
       ├──────────────► Academic Years
       ├──────────────► Semesters
       └──────────────► Academic Statuses
```

---

# Summary

Part 5 terdiri dari **4 tabel** yang membentuk modul **Assessment System**, yaitu:

- **Examinations** – Mengelola data ujian pada setiap mata pelajaran.
- **Examination Scores** – Menyimpan nilai hasil ujian setiap siswa.
- **Student Grades** – Merekap seluruh komponen nilai menjadi nilai akhir mata pelajaran.
- **Study Results** – Menyimpan hasil studi siswa berdasarkan semester, termasuk IPS, IPK, total SKS, dan status akademik.

Modul ini berfungsi sebagai pusat pengelolaan penilaian akademik yang mendukung proses evaluasi hasil belajar siswa secara menyeluruh.


# Part 6 - System Management

## Overview

System Management merupakan modul yang mendukung operasional sistem secara keseluruhan. Modul ini bertanggung jawab untuk mengelola penyimpanan file, pengumuman, notifikasi pengguna, pencatatan aktivitas (audit log), serta konfigurasi sistem.

---

# Files

Menyimpan metadata seluruh file yang diunggah ke dalam sistem.

Tabel ini digunakan sebagai referensi untuk berbagai modul seperti LMS, Assignment, Profile, dan Announcement.

```dbml
Table files {
  id uuid [pk]

  original_name varchar [not null]

  file_name varchar [not null]

  file_path text [not null]

  file_extension varchar

  mime_type varchar

  file_size bigint

  uploaded_by uuid [ref: > users.id]

  created_at timestamp
}
```

---

# Announcements

Menyimpan informasi pengumuman yang dibuat oleh institusi.

Pengumuman dapat dipublikasikan sesuai jadwal dan memiliki masa berlaku tertentu.

```dbml
Table announcements {
  id uuid [pk]

  institution_id uuid [not null, ref: > institutions.id]

  title varchar [not null]

  content text

  is_published boolean [default: false]

  published_at timestamp

  expired_at timestamp

  created_by uuid [ref: > users.id]

  updated_by uuid [ref: > users.id]

  deleted_by uuid [ref: > users.id]

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Notifications

Menyimpan notifikasi yang diterima oleh setiap pengguna.

Notifikasi digunakan untuk memberikan informasi terkait aktivitas, tugas, pengumuman, maupun proses akademik.

```dbml
Table notifications {
  id uuid [pk]

  user_id uuid [not null, ref: > users.id]

  title varchar [not null]

  message text

  is_read boolean [default: false]

  read_at timestamp

  created_at timestamp
}
```

---

# Activity Logs

Menyimpan riwayat seluruh aktivitas pengguna di dalam sistem.

Data ini berfungsi sebagai audit trail untuk melacak setiap perubahan yang dilakukan pengguna.

```dbml
Table activity_logs {
  id uuid [pk]

  user_id uuid [ref: > users.id]

  module varchar [not null]

  action varchar [not null]

  table_name varchar

  record_id uuid

  ip_address varchar

  user_agent text

  created_at timestamp
}
```

---

# Settings

Menyimpan konfigurasi atau pengaturan sistem yang dapat diubah tanpa melakukan perubahan pada kode aplikasi.

```dbml
Table settings {
  id uuid [pk]

  setting_key varchar [not null, unique]

  setting_value text

  description text

  updated_by uuid [ref: > users.id]

  updated_at timestamp
}
```

---

# Entity Relationship

```text
Users
   │
   ├──────────────► Files
   │
   ├──────────────► Notifications
   │
   ├──────────────► Activity Logs
   │
   └──────────────► Settings

Institutions
      │
      ▼
Announcements
      │
      ├──────────────► Created By (Users)
      ├──────────────► Updated By (Users)
      └──────────────► Deleted By (Users)

Files
   ▲
   │
Digunakan oleh berbagai modul:
- Profiles
- Module Contents
- Assignments
- Assignment Submissions
- Dan modul lain yang membutuhkan penyimpanan file.
```

---

# Summary

Part 6 terdiri dari **5 tabel** yang mendukung pengelolaan sistem secara menyeluruh, yaitu:

- **Files** – Menyimpan metadata file yang diunggah ke sistem.
- **Announcements** – Mengelola pengumuman yang dipublikasikan oleh institusi.
- **Notifications** – Menyimpan notifikasi untuk setiap pengguna.
- **Activity Logs** – Mencatat seluruh aktivitas pengguna sebagai audit trail.
- **Settings** – Menyimpan konfigurasi aplikasi yang dapat diubah secara dinamis.

Modul **System Management** berfungsi sebagai fondasi operasional aplikasi dengan menyediakan layanan pendukung yang digunakan oleh seluruh modul, seperti manajemen file, audit aktivitas, notifikasi, pengumuman, dan konfigurasi sistem.


# Part 7 - Supporting Modules

## Overview

Supporting Modules merupakan kumpulan modul pendukung yang melengkapi proses akademik dan operasional sistem. Modul ini menyediakan data referensi tambahan seperti semester, ruang kelas, prasyarat mata pelajaran, serta relasi antara pengumuman dan kelas.

---

# Semesters

Menyimpan data semester yang berada dalam suatu tahun akademik.

Setiap tahun akademik dapat memiliki beberapa semester, namun hanya satu semester yang aktif pada suatu waktu.

```dbml
Table semesters {
  id uuid [pk]

  academic_year_id uuid [not null, ref: > academic_years.id]

  name varchar [not null]

  start_date date

  end_date date

  is_active boolean [default: false]

  created_at timestamp
  updated_at timestamp
}
```

---

# Classrooms

Menyimpan informasi ruang kelas yang tersedia pada setiap institusi.

Data ini digunakan sebagai referensi dalam penyusunan jadwal pembelajaran.

```dbml
Table classrooms {
  id uuid [pk]

  institution_id uuid [not null, ref: > institutions.id]

  room_code varchar [not null, unique]

  room_name varchar [not null]

  building varchar

  floor int

  capacity int

  description text

  created_at timestamp
  updated_at timestamp
  deleted_at timestamp
}
```

---

# Subject Prerequisites

Menyimpan hubungan prasyarat antar mata pelajaran.

Tabel ini digunakan untuk menentukan mata pelajaran yang harus diselesaikan sebelum siswa dapat mengambil mata pelajaran tertentu.

```dbml
Table subject_prerequisites {
  id uuid [pk]

  subject_id uuid [not null, ref: > subjects.id]

  prerequisite_subject_id uuid [not null, ref: > subjects.id]

  created_at timestamp

  Indexes {
    (subject_id, prerequisite_subject_id) [unique]
  }
}
```

---

# Class Announcements

Merupakan tabel penghubung antara kelas dan pengumuman.

Dengan tabel ini, satu pengumuman dapat ditujukan ke beberapa kelas, dan satu kelas dapat menerima lebih dari satu pengumuman.

```dbml
Table class_announcements {
  id uuid [pk]

  class_id uuid [not null, ref: > classes.id]

  announcement_id uuid [not null, ref: > announcements.id]

  created_at timestamp

  Indexes {
    (class_id, announcement_id) [unique]
  }
}
```

---

# Entity Relationship

```text
Academic Years
       │
       ▼
  Semesters

Institutions
       │
       ▼
  Classrooms
       │
       ▼
   Schedules

Subjects
   │
   └──────────────► Subject Prerequisites
                    │
                    └──────────────► Subjects

Classes
    │
    ▼
Class Announcements
    ▲
    │
Announcements
```

---

# Summary

Part 7 terdiri dari **4 tabel** yang berfungsi sebagai modul pendukung (Supporting Modules), yaitu:

- **Semesters** – Mengelola data semester pada setiap tahun akademik.
- **Classrooms** – Menyimpan informasi ruang kelas yang digunakan dalam kegiatan belajar mengajar.
- **Subject Prerequisites** – Menentukan hubungan prasyarat antar mata pelajaran.
- **Class Announcements** – Menghubungkan pengumuman dengan kelas yang menjadi tujuan penyampaian informasi.

Meskipun bersifat pendukung, modul ini memiliki peran penting dalam menjaga konsistensi data dan mendukung proses akademik, penjadwalan, serta komunikasi antara institusi, guru, dan siswa.

---

# Overall Database Summary

Database **School Academic Learning Management System (SA-LMS)** dibagi menjadi **7 modul utama**, yaitu:

| Part | Module | Description |
|------|--------|-------------|
| Part 1 | Master Data | Menyimpan seluruh data referensi yang digunakan oleh sistem. |
| Part 2 | User Management | Mengelola akun pengguna, profil, guru, siswa, wali, dan institusi. |
| Part 3 | Academic Management | Mengelola kelas, mata pelajaran, jadwal, kehadiran, jurnal mengajar, dan rencana studi. |
| Part 4 | Learning Management System | Mengelola modul pembelajaran, materi, tugas, dan pengumpulan tugas. |
| Part 5 | Assessment System | Mengelola ujian, penilaian, nilai akhir, dan hasil studi siswa. |
| Part 6 | System Management | Mengelola file, pengumuman, notifikasi, audit log, dan konfigurasi sistem. |
| Part 7 | Supporting Modules | Menyediakan data pendukung seperti semester, ruang kelas, prasyarat mata pelajaran, dan relasi pengumuman kelas. |

Dengan pembagian ini, struktur database menjadi lebih **modular**, **mudah dipelihara**, serta mendukung pengembangan fitur baru tanpa memengaruhi modul lainnya.

