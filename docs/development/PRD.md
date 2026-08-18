# PRODUCT REQUIREMENT DOCUMENT (PRD)

## Project NEXORA — Sistem Informasi Akademik (SIAKAD) Terintegrasi

**Target Jenjang:** SD, SMP, SMA/SMK, & Perguruan Tinggi
**Versi:** v1.1.0 (revisi)

---

## 1. Visi & Tujuan Sistem (Overview & Objectives)

 Sistem Informasi Akademik (SIAKAD) dan Learning Management System (LMS) terintegrasi yang dirancang untuk memudahkan pengelolaan data siswa/mahasiswa, guru/dosen, mata pelajaran/kuliah, nilai, presensi, penugasan, dan administrasi akademik secara terpusat pada berbagai jenjang pendidikan, dalam satu platform multi-tenant yang dapat digunakan oleh banyak institusi sekaligus.

## 2. Ruang Lingkup (Scope)

### 2.1 Dalam Lingkup (In Scope) — v1.1.0

- Manajemen master data akademik untuk jenjang SD-PT dalam satu platform multi-tenant.
- Modul akademik inti: jadwal, presensi, nilai, jurnal mengajar.
- Modul LMS dasar: materi, penugasan, pengumpulan tugas.
- Dashboard per role dan pelaporan dasar.

### 2.2 Di Luar Lingkup (Out of Scope) — v1.1.0

- Integrasi pembayaran/SPP dan modul keuangan.
- Aplikasi mobile native (fokus awal: web responsif).
- Integrasi dengan sistem eksternal pemerintah (Dapodik/PDDikti) — direncanakan untuk fase berikutnya.
- Fitur video conference/kelas daring real-time.

> **Catatan revisi:** Bagian Ruang Lingkup ini baru — mohon dikonfirmasi dan disesuaikan bersama tim/stakeholder, karena PRD sebelumnya belum menetapkan batasan scope secara eksplisit.

## 3. Target Pengguna (User Roles)

| Role | Deskripsi Wewenang |
|---|---|
| **Super Admin (Platform Level)** | Wewenang tertinggi di tingkat sistem global: registrasi institusi baru (tenant provisioning), konfigurasi skema RBAC, master data pusat, dan monitoring operasional seluruh ekosistem platform. |
| **Administrator (Tenant Level)** | Wewenang administratif penuh, dibatasi pada lingkup satu institusi (tenant-restricted access): master data operasional lokal (peserta didik, pengajar, staf), konfigurasi akademik internal, tata kelola akun. |
| **Guru / Dosen** | Mengelola materi pembelajaran, jurnal mengajar, presensi, membuat tugas, dan melakukan penilaian. |
| **Siswa / Mahasiswa** | Mengakses materi, melakukan KRS (khusus PT), mengumpulkan tugas, melihat jadwal, presensi, dan KHS/Nilai. |
| **Orang Tua / Wali (Guardian)** | Memantau perkembangan akademik, presensi, dan nilai anak secara transparan (read-only, terhubung ke satu atau lebih akun siswa). |

## 4. Alur Pengguna Utama (User Journeys & Pseudocode Integration)

### 4.1 Alur Pengumpulan Tugas Siswa

1. Siswa login ke sistem dan membuka menu Tugas.
2. Siswa memilih tugas dan mengunggah file.
3. Sistem memverifikasi format file:
   - Jika valid: sistem mencatat timestamp. Jika melewati deadline, status dikirim sebagai **Terlambat**, selain itu **Terkumpul**.
   - Jika invalid: sistem menampilkan pesan error format file.

### 4.2 Alur Manajemen Tugas & Materi oleh Guru

1. Guru memilih Kelas dan Mata Pelajaran/Kuliah.
2. Guru dapat mengunggah materi baru atau membuat penugasan (dengan validasi deadline dan bobot nilai).
3. Sistem menyimpan penugasan dan mengirim notifikasi in-app/email ke siswa di kelas tersebut.

### 4.3 Alur Monitoring Kelas & Presensi

1. Guru mengisi jurnal mengajar dan mencatat kehadiran (Hadir, Izin, Sakit, Alpha).
2. Admin dapat memantau seluruh aktivitas kelas dan melakukan pencarian berdasarkan kelas, guru, maupun tanggal.

## 5. Kebutuhan Fungsional (Functional Requirements — MoSCoW)

| Prioritas | Fitur | Deskripsi Fungsional |
|---|---|---|
| **MUST HAVE** | Autentikasi & RBAC | Gerbang masuk sistem berbasis peran (Super Admin, Admin, Guru, Siswa, Orang Tua) menggunakan JWT, dengan kontrol akses granular per permission. |
| **MUST HAVE** | Dashboard Multi-Role | Ringkasan informasi yang disesuaikan dengan peran pengguna yang login. |
| **MUST HAVE** | Master Data Management | CRUD data Siswa, Guru, Kelas, Jurusan/Prodi, dan Jenjang Pendidikan (SD-PT). |
| **MUST HAVE** | Jadwal & Presensi | Penyusunan jadwal pelajaran/kuliah dan pencatatan kehadiran siswa per pertemuan. |
| **MUST HAVE** | Input & Lihat Nilai | Guru memasukkan nilai (rentang 0-100), siswa & orang tua dapat melihat hasilnya. |
| **MUST HAVE** | Jurnal Mengajar | Pencatatan aktivitas harian mengajar oleh guru/dosen. |
| **SHOULD HAVE** | KRS & KHS (Perguruan Tinggi) | Fitur rencana studi dan rekapitulasi IP/IPK untuk jenjang Perguruan Tinggi. |
| **SHOULD HAVE** | Pengumuman & Kalender | Penyampaian informasi kampus/sekolah dan kalender akademik tahunan. |
| **SHOULD HAVE** | LMS (Materi & Penugasan) | Manajemen materi, pengumpulan tugas siswa, serta histori penugasan. |
| **SHOULD HAVE** | Notifikasi | Pemberitahuan in-app dan email untuk tugas baru, nilai terbit, dan pengumuman. (Channel tambahan seperti push/WhatsApp: opsional, ditentukan kemudian.) |
| **COULD HAVE** | Mode Tampilan & Presensi QR | Pilihan Dark/Light mode dan absensi presisi via scan QR Code. |
| **COULD HAVE** | Ekspor PDF & Statistik | Cetak KHS/Rapor/Jadwal ke PDF serta grafik statistik performa akademik. |

## 6. Kebutuhan Non-Fungsional (Non-Functional Requirements)

| Aspek | Ketentuan |
|---|---|
| **Performa** | Waktu proses login < 1 detik, muat dashboard/CRUD < 2 detik, ekspor PDF < 5 detik. |
| **Keamanan Data** | Password di-hash dengan bcrypt; akses API dikontrol penuh via RBAC; pencegahan duplikasi data unik (NIS/NIP/NIM); JWT access token berumur pendek + refresh token, disimpan sebagai httpOnly cookie. |
| **Kepatuhan Data Pribadi** | Mematuhi UU No. 27/2022 (PDP) mengingat sistem menyimpan data pribadi anak (NIK/NIS, nilai, presensi). Perlu consent flow untuk Guardian, kebijakan retensi data, dan pembatasan akses data lintas tenant. |
| **Skalabilitas & Concurrent Users** | Target jumlah tenant (sekolah/kampus) dan concurrent user aktif per tenant perlu ditentukan bersama tim produk untuk menentukan kapasitas infrastruktur. |
| **Ketersediaan (Availability)** | Target uptime (mis. 99.5%) untuk jam operasional akademik; perlu monitoring & alerting. |
| **Backup & Disaster Recovery** | Backup database terjadwal (harian) dengan retensi minimum 30 hari; prosedur restore terdokumentasi dan diuji berkala. |
| **Kompatibilitas Perangkat** | Wajib responsif di mobile browser (banyak siswa/orang tua mengakses lewat HP); dukungan browser modern dua versi terakhir (Chrome, Safari, Edge, Firefox). |
| **Auditing** | Seluruh aktivitas penting (create/update/delete pada data akademik & akun) dicatat pada tabel `activity_logs`, termasuk aktor, waktu, dan perubahan data. |

## 7. Metrik Keberhasilan (Success Metrics) — draf awal

- Waktu onboarding institusi baru (dari registrasi Super Admin hingga siap dipakai).
- Tingkat adopsi aktif per role (persentase guru/siswa yang login rutin per minggu).
- Tingkat keterlambatan pengumpulan tugas sebelum vs. sesudah implementasi.
- Jumlah insiden/bug kritikal per rilis.

> **Catatan revisi:** Bagian ini baru dan masih berupa usulan kerangka — angka target perlu ditentukan bersama product owner/stakeholder sebelum difinalisasi.

## 8. Risiko & Asumsi

### 8.1 Risiko

- Kompleksitas kebutuhan yang berbeda antar jenjang (SD vs PT) dapat memperlambat delivery jika tidak dipisah fase.
- Kebocoran data lintas tenant jika strategi multi-tenancy tidak dirancang dengan hati-hati (lihat System Architecture, bagian Multi-Tenancy).
- Resistensi adopsi dari guru/staf yang belum terbiasa sistem digital.

### 8.2 Asumsi

- Setiap institusi (tenant) memiliki koneksi internet yang memadai untuk mengakses sistem berbasis web.
- Data master awal (siswa, guru, kelas) akan dimigrasi/di-input manual oleh Admin tenant saat onboarding.

> **Catatan revisi:** Bagian Risiko & Asumsi ini baru ditambahkan — isinya masih berupa draf awal berdasarkan pola umum proyek SIAKAD sejenis, perlu divalidasi oleh tim.