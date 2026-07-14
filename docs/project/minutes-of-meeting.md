# Minutes of Meeting (MoM)
## Review Kebutuhan & Kendala Platform Celeparty

| Item | Keterangan |
|---|---|
| **Proyek** | Celeparty — Platform Marketplace Penyewaan & Penjualan Alat Event |
| **Jenis Dokumen** | Minutes of Meeting (MoM) — Review Fitur, Flow, dan Kendala Sistem |
| **Tanggal Rapat** | 18 Juni 2026 |
| **Tanggal Penyusunan** | 4 Juli 2026 |
| **Disusun oleh** | Arief Maulana (PIC Teknis / Developer — Pihak Kedua) |
| **Peserta Rapat** | Rizky Fadillah Hermawan (Pihak Pertama / Klien), Arief Maulana (Pihak Kedua / Developer) |
| **Referensi Kontrak** | Perjanjian Kerja Sama Pengembangan Website Celeparty, ditandatangani 26 Juni 2026 |
| **Dokumen Teknis Terkait** | [development-guide.md](../architecture/development-guide.md) (v2.0), [todos.md](./todos.md), [implementation_plan.md](./implementation-plan.md) |
| **Status Dokumen** | **Final** — Seluruh poin klarifikasi pada Bagian 8 telah diresolusi. Poin di luar scope kontrak telah diidentifikasi pada Bagian 1A. |

---

## 1. Ringkasan Umum Platform

Celeparty merupakan platform berbasis marketplace yang berfokus pada kebutuhan **event**, dengan model bisnis utama berupa **penyewaan (sewa) dan penjualan (jual) alat/perlengkapan event**. Secara konsep, platform ini mengadopsi pendekatan **e-commerce yang dikhususkan untuk kebutuhan event**, mencakup dua jalur transaksi utama yaitu:

1. **Transaksi Produk** — penyewaan dan penjualan alat/perlengkapan event.
2. **Transaksi Tiket** — penjualan tiket masuk event, termasuk skema tiket berbayar dan tiket undangan (gratis).

Kedua jalur transaksi ini berjalan pada flow yang berbeda dan memiliki kebutuhan struktur data yang berbeda pula, sebagaimana dijabarkan lebih lanjut pada Bagian 4.

---

## 1A. Layanan Tambahan Gratis (Bonus Service — Modul F)

> **CATATAN PROFESIONAL:** Berdasarkan hasil cross-reference antara catatan rapat ini dengan dokumen Perjanjian Kerja Sama (kontrak) yang ditandatangani 26 Juni 2026, poin-poin berikut **secara formal tidak termasuk dalam ruang lingkup kontrak** (Modul A–E). Namun, sebagai bentuk komitmen profesional dan layanan bernilai tambah, developer (Pihak Kedua) **secara sukarela mengerjakan dan mendokumentasikan** poin-poin ini sebagai **Modul F — Bonus Service** tanpa biaya tambahan.

| No | Poin dari Rapat | Status di Kontrak | Disposisi Developer | Task ID |
|---|---|---|---|---|
| 1 | **Guest Checkout Tiket** (§4.3) — Pembelian tiket tanpa registrasi akun | Tidak tercantum dalam Modul B | ✅ **Dikerjakan sebagai Bonus Service** | TASK-500 [F.a] |
| 2 | **Konfigurasi SEO per Filter & per Kota** (§6.2) | Tidak tercantum dalam Modul A–E | ✅ **Dikerjakan sebagai Bonus Service** | TASK-501 [F.b] |
| 3 | **Penataan Slug & URL** (§6.3) | Tidak tercantum dalam Modul A–E | ✅ **Dikerjakan sebagai Bonus Service** | TASK-501 [F.b] |
| 4 | **Optimisasi Performa Sistem secara Menyeluruh** (§7 No.4) | Optimisasi spesifik per fitur sudah termasuk; audit menyeluruh tidak termasuk | ✅ **Dikerjakan sebagai Bonus Service** | TASK-502 [F.c] |

> Keempat poin di atas didokumentasikan secara profesional di `implementation_plan.md` (Modul F) dan `todos.md` (Fase 4B: TASK-500–502) dengan acceptance criteria yang lengkap. Pekerjaan bonus ini dijadwalkan di Fase 4 setelah seluruh deliverable kontrak selesai, agar tidak mengganggu timeline utama.

---

## 2. Struktur Peran (Role) Pengguna

Platform Celeparty mendefinisikan tiga peran utama sebagai berikut:

| Role | Deskripsi Tanggung Jawab |
|---|---|
| **Admin** | Mengelola keseluruhan website, termasuk konten (blog), pengaturan SEO, approval vendor/produk, dan monitoring transaksi. |
| **Vendor** | Pihak yang menjual dan/atau menyewakan produk/alat event di platform. Produk vendor melalui proses approval sebelum tayang. |
| **User (Buyer)** | Pihak pembeli/penyewa, baik untuk kebutuhan produk maupun tiket event. |

---

## 3. Modul Produk — Sewa & Jual (Sisi Vendor)

### 3.1 Ketentuan Umum
- Vendor dapat menjual **dan** menyewakan produknya melalui platform yang sama.
- Setiap produk yang diunggah vendor melalui mekanisme **approval** oleh Admin sebelum dapat ditampilkan ke publik.
- Pengalaman input produk di sisi vendor diarahkan untuk **sesederhana mungkin**, dengan mengikuti struktur list menu yang sudah tersedia saat ini (tidak menambah kompleksitas baru pada alur input vendor).

### 3.2 Ketentuan Kuantitas (Qty)
- Jumlah (qty) ketersediaan barang **sepenuhnya diisi oleh vendor sendiri**, berdasarkan kesanggupan/kapasitas vendor masing-masing. Sistem tidak melakukan validasi atau pembatasan otomatis atas angka yang diinput vendor.

### 3.3 Ketentuan Lokasi
- Lokasi produk yang ditampilkan ke pembeli mengikuti **lokasi vendor pemilik produk tersebut** — bukan lokasi custom per produk.

### 3.4 Kategori Produk
- Terdapat kebutuhan pendefinisian kategori produk pada platform. **Detail struktur kategori belum tercantum secara lengkap dalam catatan rapat** dan memerlukan klarifikasi lebih lanjut (lihat Bagian 8, poin 8.1).

### 3.5 Skema Negosiasi Harga (Sewa) — Custom Quotation
- Berdasarkan observasi perilaku customer eksisting, **hampir selalu terjadi negosiasi harga** pada transaksi sewa.
- Kebutuhan ke depan: tersedia fitur **Custom Quotation**, yaitu mekanisme di mana pihak **Celeparty (Admin)** dapat menerbitkan penawaran harga khusus yang telah disesuaikan hasil negosiasi kepada customer, sebagai bagian resmi dari flow transaksi (bukan proses manual di luar sistem).

### 3.6 Rating/Review Produk
- Fitur rating berbentuk bintang (star rating) **dihapus sementara** dari tampilan produk, sambil menunggu keputusan lebih lanjut mengenai fitur ini.

---

## 4. Modul Tiket Event

### 4.1 Kebutuhan Fundamental
- Modul tiket **memerlukan pembangunan struktur database dari awal (from scratch)**, karena flow bisnis tiket berbeda secara signifikan dari flow produk (sewa/jual alat).

### 4.2 Jenis Tiket
- **Tiket Berbayar** — melalui flow pembelian dan pembayaran standar.
- **Tiket Undangan (Invitation/Gratis)** — tiket dengan skema gratis yang **langsung masuk ke tahap verifikasi tiket** tanpa melalui proses pembayaran.

### 4.3 Ketentuan Akses Pembelian Tiket
- Pembelian tiket **tidak mewajibkan proses pendaftaran (registrasi akun) terlebih dahulu**. User dapat melakukan pembelian tiket sebagai guest.
- ✅ **Disposisi:** Fitur guest checkout **tidak termasuk dalam scope kontrak**, namun **dikerjakan sebagai Bonus Service** (Modul F). Implementasi melalui session-based cart dengan endpoint khusus `/api/transaction-tickets/guest-checkout`. (Ref: TASK-500 [F.a])

### 4.4 QR Code Tiket
- Format/struktur QR Code pada tiket saat ini **berbeda-beda (tidak konsisten)** antar tiket, sehingga memerlukan standardisasi format QR Code ke depannya.
- ✅ **Status Resolusi:** Standardisasi telah diselesaikan — barcode 17-digit numerik (8 timestamp + 8 hex random + 1 checksum) dengan constraint `unique` di database. QR Code meng-encode nilai barcode tersebut. (Ref: TASK-202)

### 4.5 Verifikasi Tiket
Tersedia dua metode verifikasi tiket saat masuk lokasi event:
1. **Verifikasi via Scan QR Code** — harapannya proses scan dapat langsung mengarahkan (redirect) ke halaman/status verifikasi tiket secara otomatis.
2. **Verifikasi Manual** — verifikasi dilakukan tanpa proses scan, sebagai alternatif metode.

### 4.6 Cetak Tiket (Print PDF)
- Terdapat kendala pada fitur **cetak PDF tiket per penerima (per-recipient ticket printing)**. Kendala ini perlu diinvestigasi dan diperbaiki lebih lanjut oleh tim teknis (lihat Bagian 7).

### 4.7 Export Data
- Data tiket diharapkan dapat **diekspor ke format Excel**, untuk keperluan rekap dan pelaporan pihak penyelenggara event.

### 4.8 Struktur Tabel & Data Historis
Kebutuhan penataan ulang struktur tabel terkait tiket dan transaksi mencakup:
- **Tabel Log History** — mencatat riwayat aktivitas terkait tiket.
- **Tabel Detail Tiket** — mencatat status/riwayat tiket yang sudah berjalan (used/verified/pending, dsb).
- **Tabel Transaksi** — diarahkan agar **fokus hanya pada data produk** (bukan tercampur dengan data tiket), sehingga struktur data transaksi produk dan tiket perlu dipisahkan secara jelas.

---

## 5. Payment Gateway & Integrasi Transaksi

### 5.1 Payment Gateway
- Platform menggunakan **Midtrans** sebagai penyedia payment gateway.

### 5.2 Kendala Integrasi Transaksi ke API Internal (PAPI)
- Pada flow sewa alat dan tiket, transaksi pembelian **sudah tercatat di sisi payment gateway**, namun **data transaksi tersebut belum diteruskan/dikirim ke API internal (PAPI)**.
- Dengan kata lain, terdapat **gap integrasi** antara hasil transaksi di Midtrans dengan sistem internal (PAPI) yang seharusnya menerima notifikasi/data transaksi tersebut. Ini menjadi salah satu prioritas perbaikan teknis (lihat Bagian 7).
- ✅ **Status Resolusi:** Gap ini telah **sepenuhnya diselesaikan**. Istilah "PAPI" (API Internal) merujuk pada backend Strapi yang kini menerima webhook callback dari Midtrans melalui endpoint `/api/midtrans-webhook`. Webhook handler mendukung 4 jenis routing pembayaran: Regular, Escrow DP (`-DP`), Escrow Pelunasan (`-REMAINING`), dan Custom Quotation (`QT-`). Seluruh data transaksi terintegrasi ke database Strapi. (Ref: TASK-201, TASK-301, TASK-303, TASK-400)

---

## 6. Manajemen Konten & SEO

### 6.1 Blog
- Konten blog pada platform **dibuat dan dikelola oleh Admin**.

### 6.2 Pengaturan SEO
- Pengaturan SEO pada platform **secara umum belum dikonfigurasi**.
- Kebutuhan SEO secara spesifik mencakup dua konteks utama:
  1. **SEO per filter produk** (contoh: kategori/jenis produk tertentu).
  2. **SEO per Kota** (lokasi geografis produk/vendor).
- ✅ **Disposisi:** Konfigurasi SEO **tidak termasuk dalam scope kontrak**, namun **dikerjakan sebagai Bonus Service** (Modul F). Mencakup: dynamic meta tags via `generateMetadata()`, Open Graph tags, JSON-LD structured data, dan sitemap.xml. (Ref: TASK-501 [F.b])

### 6.3 Slug & URL
- Struktur **slug dan URL pada platform belum dikonfigurasi**, sehingga memerlukan penataan agar sesuai kaidah SEO dan konsisten antar halaman.
- ✅ **Disposisi:** Penataan slug dan URL **tidak termasuk dalam scope kontrak**, namun **dikerjakan sebagai Bonus Service** (Modul F). Format slug: `/products/{slugified-name}-{documentId}`. Mencakup 301 redirect dari URL lama. (Ref: TASK-501 [F.b])

---

## 7. Kendala Teknis & Performa (Issues Log)

| No | Kendala | Area Terdampak | Kategori |
|---|---|---|---|
| 1 | Data transaksi dari payment gateway (Midtrans) belum terkirim/terintegrasi ke API internal (PAPI) | Sewa alat & Tiket | Integrasi Sistem |
| 2 | Fitur cetak PDF tiket per penerima mengalami kendala | Modul Tiket | Bug/Fungsional |
| 3 | Format QR Code tiket tidak konsisten (berbeda-beda) | Modul Tiket | Standardisasi Data |
| 4 | Performa sistem secara umum masih terasa berat (lambat) | Platform (umum) | Performa/Optimisasi |
| 5 | Pengaturan SEO, slug, dan URL belum dikonfigurasi | Platform (umum) | Konfigurasi/SEO |

---

## 8. Poin yang Memerlukan Klarifikasi Lanjutan (Dengan Status Resolusi)

Berikut adalah poin-poin yang awalnya memerlukan klarifikasi dari pemberi requirement, beserta **status resolusi** per tanggal penyusunan dokumen ini:

| No | Poin Klarifikasi | Status | Resolusi |
|---|---|---|---|
| 1 | **Kategori Produk** — struktur dan daftar kategori produk belum tercantum detail. | ✅ **RESOLVED** | Kategori "Event" telah dihapus (TASK-101). Kategori produk dikelola secara dinamis melalui Strapi Admin Panel (Content Manager → Category). Daftar kategori bersifat fleksibel dan dapat ditambah/dikurangi oleh Admin kapan saja. Relasi terhadap filter SEO dikerjakan sebagai **Bonus Service** (TASK-501 [F.b]). |
| 2 | **Detail Skema Approval Vendor** — kriteria dan alur approval belum dirinci. | ✅ **RESOLVED** | Approver = Admin Strapi via CMS Panel. Parameter validasi: state (pending → approved/rejected), is_active (false → true). Lifecycle mengirim email notifikasi ke vendor. Didokumentasikan di [development-guide.md](../architecture/development-guide.md) §6.1 (flowchart). |
| 3 | **Detail Redirect Verifikasi Tiket (Scan QR)** — kejelasan halaman/aksi tujuan setelah scan. | ✅ **RESOLVED** | Scan berhasil → (1) Update `verification_status` ke "verified" dan `status` ke "used" di database, (2) Insert record audit trail ke `ticket-verification`, (3) Tampilkan info pemegang tiket di UI dengan indikator visual (✅/⚠️/❌) dan audio feedback. Tidak ada redirect ke halaman terpisah. Didokumentasikan di [development-guide.md](../architecture/development-guide.md) §5.3 dan §6.4. |
| 4 | **Ruang Lingkup Custom Quotation** — berlaku untuk semua kategori atau tertentu saja? Siapa yang berwenang? | ✅ **RESOLVED** | Custom Quotation berlaku untuk **seluruh produk/jasa sewa** tanpa batasan kategori. Yang berwenang menerbitkan: **Admin only** melalui halaman `/admin/quotation`. Vendor tidak memiliki akses ke fitur ini. Didokumentasikan di [development-guide.md](../architecture/development-guide.md) §5.4 (TASK-303). |
| 5 | **Skema Struktur Database Tiket (from scratch)** — penjabaran entitas data rinci. | ✅ **RESOLVED** | Skema lengkap telah dirancang dan diimplementasikan mencakup: Ticket (content type utama), Transaction-Ticket (transaksi tiket), Ticket-Detail (28 fields, individual e-ticket), Ticket-Verification (audit trail), Ticket-Send-History (log pengiriman). ERD lengkap di [development-guide.md](../architecture/development-guide.md) §4. |
| 6 | **Definisi "Berat" pada Kendala Performa** — data pendukung untuk prioritisasi. | ✅ **RESOLVED** | Meskipun data kuantitatif spesifik dari klien belum tersedia, developer proaktif mengambil inisiatif untuk melakukan audit performa menyeluruh sebagai **Bonus Service** (Modul F). Mencakup Lighthouse audit pada 5 halaman kunci, React Query tuning, image optimization via `next/image`, code splitting, dan bundle analysis. (Ref: TASK-502 [F.c]) |

---

## 9. Ringkasan Action Items (Dengan Status & Referensi Task)

| No | Action Item | Task ID | Status | Catatan |
|---|---|---|---|---|
| 1 | Investigasi & perbaikan integrasi transaksi Midtrans ke API internal (Strapi Backend) | TASK-201, TASK-400 | ✅ **Selesai** | Webhook handler mendukung 4 tipe routing pembayaran. |
| 2 | Perbaikan fitur cetak PDF tiket per penerima | TASK-204 | ✅ **Selesai** | PDF via PDFKit, email via Resend per recipient. |
| 3 | Perancangan skema database baru untuk modul Tiket | TASK-201 | ✅ **Selesai** | 5 content types: Ticket, Transaction-Ticket, Ticket-Detail, Ticket-Verification, Ticket-Send-History. |
| 4 | Standardisasi format QR Code tiket | TASK-202 | ✅ **Selesai** | Barcode 17-digit, QR Code encode barcode value, unique constraint. |
| 5 | Implementasi fitur export data tiket ke Excel | TASK-203 | ✅ **Selesai** | CSV (tiket) via file-saver + UTF-8 BOM; XLSX (non-tiket) via SheetJS. |
| 6 | Pemisahan struktur tabel transaksi (fokus produk) dari data tiket | — (Arsitektur) | ✅ **By Design** | Dual transaction system dipertahankan: `transaction` (equipment) dan `transaction-ticket` (tiket). Migrasi unified bukan scope kontrak. |
| 7 | Implementasi guest checkout untuk pembelian tiket tanpa registrasi | TASK-500 | 💎 **Bonus Service** | Dikerjakan sebagai Modul F [F.a]. Session-based cart + endpoint guest-checkout + rate limiting. |
| 8 | Perancangan fitur Custom Quotation untuk transaksi sewa | TASK-303 | ✅ **Selesai** | Content type baru, halaman admin, payment link, webhook routing QT-. |
| 9 | Konfigurasi SEO (per filter produk & per kota), slug, dan URL | TASK-501 | 💎 **Bonus Service** | Dikerjakan sebagai Modul F [F.b]. Slug SEO-friendly, meta tags, Open Graph, sitemap.xml, robots.txt. |
| 10 | Investigasi dan optimisasi performa sistem secara umum | TASK-502 | 💎 **Bonus Service** | Dikerjakan sebagai Modul F [F.c]. Lighthouse audit, React Query tuning, image optimization, code splitting. |
| 11 | Klarifikasi kategori produk final & struktur approval vendor | TASK-101, TASK-300 | ✅ **Resolved** | Kategori dinamis via Strapi CMS. Approval via Admin Panel. |
| 12 | Penghapusan sementara fitur rating bintang dari tampilan produk | TASK-100 | ✅ **Selesai** | Rating/review dihilangkan dari seluruh UI. Field `rate` tetap di DB untuk backward compatibility. |

---

## 10. Kesimpulan

Secara umum, platform Celeparty telah memiliki fondasi model bisnis yang jelas sebagai marketplace event dengan dua jalur transaksi (produk dan tiket), serta struktur peran (Admin, Vendor, User) yang terdefinisi.

Berdasarkan hasil cross-reference antara catatan rapat ini dengan dokumen kontrak, dokumentasi teknis, dan task list proyek, **seluruh 12 action item telah ter-address**: 9 item telah selesai diimplementasikan sebagai bagian kontrak, dan 3 item yang secara formal di luar scope kontrak **dikerjakan sebagai Bonus Service (Modul F)** oleh developer tanpa biaya tambahan.

Seluruh 6 poin klarifikasi pada Bagian 8 telah **RESOLVED**.

**Status Proyek per 4 Juli 2026:**
- ✅ **21/21** poin pekerjaan kontrak (Modul A–E) telah selesai diimplementasi
- 💎 **3 task bonus service** (Modul F: TASK-500, TASK-501, TASK-502) dijadwalkan di Fase 4B
- ✅ **6/6** poin klarifikasi telah resolved
- ✅ Seluruh endpoint API telah diamankan (security hardening)
- ✅ Build frontend dan backend berhasil tanpa error
- ✅ **12/12** action item dari rapat telah ter-address (0 item tersisa)

---

*Dokumen ini disusun berdasarkan catatan rapat internal tanggal 18 Juni 2026 antara Rizky Fadillah Hermawan (Pihak Pertama) dan Arief Maulana (Pihak Kedua), serta telah di-cross-reference terhadap Perjanjian Kerja Sama, dokumentasi teknis ([development-guide.md](../architecture/development-guide.md) v2.0), dan master task list ([todos.md](./todos.md) v2.0) per 4 Juli 2026.*
