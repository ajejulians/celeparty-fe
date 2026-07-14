# CELEPARTY — Panduan Simulasi & Uji Fitur Komprehensif (A–Z Client Demo Guide)

Panduan ini disusun secara sistematis dan detail untuk memandu jalannya presentasi produk (UAT / Demo) kepada Klien (**Rizky Fadillah Hermawan**). Setiap skenario dilengkapi dengan langkah operasional, validasi visual, pembuktian data, dan jaminan keamanan sistem.

---

## DAFTAR SKENARIO SIMULASI

1. [Skenario 1: Struktur Website & Optimalisasi Gambar (Modul A & E)](#skenario-1-struktur-website--optimalisasi-gambar-modul-a--e)
2. [Skenario 2: Alur Pembelian Tiket & Verifikasi Scan (Modul B)](#skenario-2-alur-pembelian-tiket--verifikasi-scan-modul-b)
3. [Skenario 3: Alur Sewa Perlengkapan & Pembayaran Escrow (Modul C)](#skenario-3-alur-sewa-perlengkapan--pembayaran-escrow-modul-c)
4. [Skenario 4: Custom Quotation Negosiasi Offline (Modul D)](#skenario-4-custom-quotation-negosiasi-offline-modul-d)
5. [Skenario 5: Pembuktian Keamanan Sistem & Audit Trail (Hardening Audit)](#skenario-5-pembuktian-keamanan-sistem--audit-trail-hardening-audit)

---

## SKENARIO 1: STRUKTUR WEBSITE & OPTIMALISASI GAMBAR (Modul A & E)

Skenario ini membuktikan penghapusan kategori "Event" (menyisakan taksonomi produk yang bersih), perapihan responsivitas antarmuka, serta fitur kompresi foto produk secara otomatis sebelum upload.

### 1.1 Verifikasi Struktur Kategori & UI Polish
*   **Langkah Simulasi:**
    1. Buka browser dan arahkan ke halaman utama katalog: `{FRONTEND_URL}/products`.
    2. Tunjukkan sidebar filter kategori di bagian kiri (desktop) atau tombol filter laci (mobile).
    3. **Bukti Visual untuk Klien:** Tunjukkan bahwa opsi kategori **"Event"** sudah tidak ada lagi di dalam daftar filter maupun kategori produk. Kategori yang tersedia hanya kategori produk fisik/sewa (misalnya: *Decoration, Sound System, Catering, Lighting*).
    4. Buka halaman detail produk: `{FRONTEND_URL}/products/[slug]`.
    5. **Bukti Visual untuk Klien:** Tunjukkan bahwa semua elemen **Rating & Review (Bintang Emas)** telah sepenuhnya dihilangkan dari kartu produk dan detail halaman produk guna menyederhanakan sistem.
    6. Aktifkan Mode DevTools (F12) di browser, ubah resolusi ke **375px (iPhone SE)** atau **414px (iPhone 11 Pro)**.
    7. **Bukti Visual untuk Klien:** Scroll seluruh halaman utama, katalog, detail produk, dan cart. Tunjukkan bahwa **tidak ada scrollbar horizontal (overflow-x)**, tombol memiliki area sentuh minimum `44x44px`, dan formulir secara otomatis reflow menjadi satu kolom yang nyaman.

### 1.2 Uji Auto-Kompresi Gambar Produk
*   **Langkah Simulasi:**
    1. Login sebagai Vendor/Mitra, lalu masuk ke dashboard vendor: `{FRONTEND_URL}/user/vendor/add-product` (atau ubah profil di `/user/profile/bio`).
    2. Siapkan file gambar berukuran besar (misalnya: file `.jpg` berukuran **2.5 MB**).
    3. Seret dan lepaskan (Drag & Drop) atau pilih file tersebut pada input uploader gambar.
    4. **Bukti Visual untuk Klien:** 
        *   Tampilan loading indicator akan muncul bertuliskan: `"Mengompresi gambar..."`.
        *   Setelah kompresi selesai, uploader akan menampilkan pesan toast pemberitahuan: `"Gambar berhasil dikompresi! Ukuran berkurang dari 2.5 MB menjadi 780 KB (hemat 68.8%)"`.
        *   Tekan tombol "Simpan/Upload" dan tunjukkan bahwa file gambar berhasil disimpan ke Strapi CMS dalam waktu singkat karena ukurannya yang optimal.

---

## SKENARIO 2: ALUR PEMBELIAN TIKET & VERIFIKASI SCAN (Modul B)

Skenario ini mendemonstrasikan pembelian tiket acara secara berkelompok, pengisian data pelanggan individual, pembuatan e-ticket dengan barcode unik 17-digit, pengiriman email otomatis, dan validasi check-in masuk venue.

### 2.1 Alur Checkout Tiket Berkelompok
*   **Langkah Simulasi:**
    1. Masuk ke halaman detail produk tiket (misalnya: *"Konser Musik Celeparty"*).
    2. Pilih varian tiket *"Presale 1"* dan ubah kuantitas pembelian menjadi **3 tiket**.
    3. Klik **"Tambah ke Keranjang"** dan arahkan ke halaman Cart (`{FRONTEND_URL}/cart`).
    4. **Bukti Visual untuk Klien:** Di halaman checkout, tunjukkan bahwa formulir **Recipient Data (Data Pemegang Tiket)** muncul sebanyak **3 form terpisah** sesuai dengan jumlah kuantitas tiket.
    5. Coba kosongkan salah satu field (misalnya email) dan klik tombol checkout. Tunjukkan pesan validasi schema Zod: `"Format email tidak valid"` atau `"Nomor WhatsApp minimal 10 digit"`.
    6. Isi data recipient dengan lengkap dan berbeda:
        *   Recipient 1: `budi@mail.com` (KTP: `3273123456780001`)
        *   Recipient 2: `ani@mail.com` (KTP: `3273123456780002`)
        *   Recipient 3: `caca@mail.com` (KTP: `3273123456780003`)
    7. Klik **"Bayar Sekarang"** untuk memunculkan modal Midtrans Snap.
    8. Lakukan pembayaran menggunakan Simulator Midtrans Sandbox (pilih Bank Transfer / GoPay, lalu set status ke **Success / Settlement**).
    9. Browser akan otomatis melakukan redirect ke halaman success: `{FRONTEND_URL}/cart/success`.

### 2.2 Pengiriman E-Ticket via Email & Audit Log
*   **Langkah Simulasi:**
    1. Buka kotak masuk (Inbox) dari masing-masing email recipient yang digunakan dalam tes (atau buka log Resend jika menggunakan akun uji coba).
    2. **Bukti Visual untuk Klien:** Tunjukkan email masuk bermerek Celeparty (dengan tema warna ungu khas dan logo) yang melampirkan file **PDF E-Ticket**.
    3. Unduh dan buka file PDF E-Ticket tersebut. Tunjukkan konten e-ticket:
        *   Logo Celeparty, Nama Event, Tanggal/Waktu Acara, Lokasi Event.
        *   Nama Lengkap Pemegang Tiket (Recipient), email, WA, dan nomor identitas yang sesuai.
        *   **Barcode 17-Digit Unik** yang terpampang jelas beserta kode numeriknya.
        *   **QR Code** yang ter-render sempurna di dalam dokumen PDF.

### 2.3 Simulasi Uji Validasi Tiket di Venue (Triple-Mode Scanner)
*   **Langkah Simulasi:**
    1. Login sebagai Vendor/Mitra pemilik event, lalu arahkan ke halaman pemindaian tiket: `{FRONTEND_URL}/user/vendor/tickets` (atau tab `/user/vendor/tickets/scan`).
    2. Tunjukkan **Mode Selector** kepada klien: **📷 Kamera**, **🔌 USB Scanner**, dan **⌨️ Manual Input**.
    3. **Demo Mode 1 (Kamera):** 
        *   Pilih mode Kamera. Izinkan akses kamera browser.
        *   Arahkan kamera smartphone/laptop ke QR code yang ada di PDF E-Ticket Budi.
        *   Sistem akan berbunyi **beep sukses** dan memunculkan status: `✅ TIKET VALID — Budiman (KTP: 3273123456780001)`.
    4. **Demo Mode 2 (USB Scanner):**
        *   Pilih mode USB Scanner. Letakkan kursor di input teks terfokus.
        *   Gunakan barcode scanner eksternal untuk memindai barcode di tiket Ani.
        *   Pemicu keypress `Enter` dari scanner akan memproses verifikasi instan. Bunyi **beep sukses** berdering, menampilkan data tiket Ani.
    5. **Demo Mode 3 (Manual Input):**
        *   Ketik manual kode barcode Ani/Budi pada kotak input, lalu klik tombol **"Verifikasi"**.
    6. **Uji Keamanan / Double-Scan:**
        *   Coba scan kembali tiket Budi yang telah terpakai sebelumnya.
        *   Sistem akan berbunyi **buzz gagal** (suara error) dan memunculkan status berwarna merah: `⚠️ ALREADY USED — Tiket sudah diverifikasi sebelumnya pada tanggal [Waktu Scan Pertama] oleh staff [Nama Staff]`.
    7. **Uji Tiket Palsu:**
        *   Masukkan kode acak (misalnya: `99999999999999999`) dan klik verifikasi.
        *   Sistem akan berbunyi **buzz gagal** dan memunculkan status: `❌ INVALID / NOT FOUND — Tiket tidak terdaftar di database Celeparty`.

---

## SKENARIO 3: ALUR SEWA PERLENGKAPAN & PEMBAYARAN ESCROW (Modul C)

Skenario ini mendemonstrasikan penyewaan perlengkapan event (non-tiket) menggunakan mekanisme pembayaran escrow 2-fase (DP 30% di awal + Pelunasan 70% sebelum loading).

### 3.1 Checkout Rental & Pembayaran DP 30%
*   **Langkah Simulasi:**
    1. Buka halaman detail perlengkapan event (misalnya: *"Sewa Sound System 5000 Watt"* yang memiliki bendera/status **Escrow Active**).
    2. **Bukti Visual untuk Klien:** Tunjukkan breakdown harga sewa di halaman detail:
        *   *Total Harga Sewa:* Rp 10.000.000
        *   *Down Payment (DP 30%):* Rp 3.000.000
        *   *Pelunasan (70%):* Rp 7.000.000
    3. Klik sewa, lalu isi form checkout: Tanggal Event (misal: 10 Juli 2026), Tanggal Loading (misal: 9 Juli 2026), Jam Loading (10:00 WIB), Lokasi Pengiriman, dan Catatan Logistik.
    4. Klik **"Sewa Sekarang"** untuk memunculkan modal Midtrans Snap.
    5. **Bukti Teknis untuk Klien:** Tunjukkan di console log / inspect element bahwa `order_id` yang dikirim ke Midtrans memiliki suffix `-DP` (contoh: `TRX-10024-DP`) dan nominal tagihan adalah **Rp 3.000.000** (30% dari total).
    6. Selesaikan pembayaran simulator Midtrans.

### 3.2 Persetujuan (Approve/Reject) oleh Vendor
*   **Langkah Simulasi:**
    1. Login sebagai Vendor penyedia sound system, buka dashboard order masuk: `{FRONTEND_URL}/user/vendor/orders` (atau `/user/vendor/equipment-orders`).
    2. Temukan pesanan sound system di atas. Status pesanan akan bertuliskan: `escrow_status: dp_paid`, `vendor_status: pending`.
    3. **Bukti Visual untuk Klien:** Tunjukkan adanya dua opsi aksi: **"✓ Terima Pesanan"** dan **"✗ Tolak Pesanan"**.
    4. **Skenario Tolak (Demo):**
        *   Klik "Tolak Pesanan". Muncul modal pop-up: `"Masukkan alasan penolakan"`.
        *   Ketik: `"Peralatan sound system sedang dalam perawatan rutin pada tanggal tersebut"`.
        *   Kirim penolakan. Tunjukkan status berubah menjadi `rejected` dan email penolakan otomatis terkirim ke customer yang melampirkan catatan alasan vendor serta informasi refund manual dari admin.
    5. *(Untuk kelanjutan demo sewa, gunakan order baru/lain yang disetujui)*. Klik **"Terima Pesanan"**. Status vendor berubah menjadi `approved`.

### 3.3 Pelunasan Sisa Pembayaran 70%
*   **Langkah Simulasi:**
    1. Login sebagai Customer, masuk ke dashboard pembeli: `{FRONTEND_URL}/user/profile/orders`.
    2. Cari pesanan sound system yang telah disetujui vendor di atas.
    3. **Bukti Visual untuk Klien:** Tunjukkan tombol **"Bayar Pelunasan (70%)"** kini aktif di samping pesanan tersebut.
    4. Klik tombol tersebut untuk membuka Midtrans Snap.
    5. **Bukti Teknis untuk Klien:** Tunjukkan nominal tagihan adalah **Rp 7.000.000** (70% sisa pelunasan) dengan kode `order_id` bersuffix `-REMAINING` (contoh: `TRX-10024-REMAINING`).
    6. Selesaikan pembayaran simulator Midtrans.
    7. **Bukti Data Akhir:** Arahkan kembali ke order list customer. Tunjukkan status pesanan telah berubah menjadi `fully_paid / settlement`. Tombol bayar hilang dan digantikan dengan tombol **"Lihat Invoice PDF"**.

---

## SKENARIO 4: CUSTOM QUOTATION NEGOSIASI OFFLINE (Modul D)

Skenario ini mendemonstrasikan bagaimana admin memproses negosiasi offline dengan customer, membuat quotation kustom, menghasilkan tautan pembayaran, dan memproses pelunasannya.

### 4.1 Generate Custom Quotation oleh Admin
*   **Langkah Simulasi:**
    1. Login ke admin dashboard Strapi CMS (atau halaman panel admin custom): `{FRONTEND_URL}/admin/quotation` (atau via CMS panel `Collection Types -> Custom Quotation`).
    2. Klik **"Create New Entry"**, isi formulir penawaran kustom:
        *   Nama Customer: `Randi Wijaya`
        *   Email Customer: `randi@mail.com`
        *   Deskripsi Sewa: *"Paket Dekorasi Wedding Outdoor Kustom + Panggung Utama"*
        *   Harga yang Disepakati: `Rp 15.000.000` (tanpa floating point / desimal uang sesuai prinsip materialitas)
    3. Klik **"Simpan & Kirim"**.
    4. **Bukti Visual untuk Klien:** Sistem menghasilkan kode quotation unik `QT-20260703-9A1F` dan link pembayaran: `{FRONTEND_URL}/pay/QT-20260703-9A1F`. Salin link tersebut.

### 4.2 Pembayaran Quotation oleh Customer
*   **Langkah Simulasi:**
    1. Buka tab baru di browser dan akses link quotation: `{FRONTEND_URL}/pay/QT-20260703-9A1F`.
    2. **Bukti Visual untuk Klien:** Tunjukkan halaman checkout quotation bermerek Celeparty yang menampilkan:
        *   Nama Project / Produk: *Paket Dekorasi Wedding Outdoor Kustom + Panggung Utama*
        *   Nama Penerima: *Randi Wijaya*
        *   Total Harga Disepakati: *Rp 15.000.000*
        *   Status: *Menunggu Pembayaran (Sisa waktu: 6 Hari 23 Jam)*
    3. Klik tombol **"Bayar Sekarang"** untuk membuka Midtrans Snap.
    4. Selesaikan pembayaran simulator Midtrans.
    5. Tunjukkan halaman otomatis redirect ke halaman sukses, dan status quotation di layar seketika berubah menjadi **"Sudah Dibayar" (Paid)** dengan detail transaksi terlampir.

---

## SKENARIO 5: PEMBUKTIAN KEAMANAN SISTEM & AUDIT TRAIL (Hardening Audit)

Skenario ini sangat penting untuk membuktikan kepada Klien bahwa website Celeparty tidak memiliki celah keamanan kritis (vulnerabilities) dan memiliki log audit transaksi yang ketat.

### 5.1 Pembuktian Keamanan Endpoint (Hak Akses Terkunci)
*   **Langkah Simulasi (Menggunakan Postman / REST Client / cURL):**
    1. Coba kirim request `PUT` langsung ke endpoint update saldo vendor tanpa menyertakan token otorisasi JWT:
       ```bash
       curl -X PUT http://localhost:1337/api/vendor-balance/update -d "saldo=100000000"
       ```
    2. **Bukti Teknis untuk Klien:** Tunjukkan bahwa server menolak mentah-mentah dengan mengembalikan status: **`401 Unauthorized`** (Akses Ditolak).
    3. Lakukan pengujian yang sama untuk mengirim email spam via `/api/emails/send` atau mengubah status tiket menjadi terpakai via `/api/ticket-verifications/markAsUsed/[id]` tanpa login. Server akan selalu melempar status **`401 Unauthorized`**.

### 5.2 Pembuktian Keamanan Akses Invoice PDF (Next.js Secure Proxy)
*   **Langkah Simulasi:**
    1. Salin link invoice PDF milik customer Budi (misal: `/api/invoice/trx-9908`).
    2. Buka tab samaran (Incognito) di browser atau login dengan akun customer lain (misal: Randi).
    3. Coba akses link invoice milik Budi tersebut: `{FRONTEND_URL}/api/invoice/trx-9908`.
    4. **Bukti Visual untuk Klien:** Halaman akan menampilkan JSON error: **`{ "error": "Akses ditolak — Anda tidak memiliki akses ke invoice ini" }`** dengan status **`403 Forbidden`**. Ini membuktikan sistem proxy mencegah kebocoran data sensitif pembeli lain.

### 5.3 Audit Trail Verifikasi Tiket di Database
*   **Langkah Simulasi:**
    1. Buka Admin Panel Strapi CMS, masuk ke collection type **`Ticket Verifications`**.
    2. Tunjukkan baris data log verifikasi yang baru saja dilakukan pada Skenario 2.
    3. **Bukti Data untuk Klien:** Tunjukkan record audit trail lengkap berisi data:
        *   `ticket_code` / `barcode` yang di-scan.
        *   `verified_by_user` (staff/vendor yang melakukan scan).
        *   `verification_time` (kapan scan dilakukan).
        *   `verification_result` (apakah Valid, Expired, atau Already Used).
        *   `ip_address` & `device_info` (mencatat perangkat yang digunakan memindai untuk keamanan ekstra).

---

## DAFTAR CHECKLIST SERAH TERIMA & KESIAPAN UAT (UAT CHECKLIST)

Gunakan tabel checklist di bawah ini saat sesi presentasi berlangsung di hadapan Klien untuk menandai setiap fitur yang telah disetujui:

| No | Modul / Fitur | Target Perilaku Bisnis | Status (Klien) | Catatan |
|---|---|---|---|---|
| 1 | **Modul A.a** | Kategori "Event" hilang & relasi bersih | `[ ] Approved` | |
| 2 | **Modul A.b** | Halaman responsif di mobile 375px (no horizontal scroll) | `[ ] Approved` | |
| 3 | **Modul A.c** | Pencarian produk terfilter wilayah vendor | `[ ] Approved` | |
| 4 | **Modul B.c** | Input data recipient per tiket yang dibeli | `[ ] Approved` | |
| 5 | **Modul B.d** | Barcode 17-digit unik & bebas bentrokan | `[ ] Approved` | |
| 6 | **Modul B.f** | Verifikasi scan tiket via Kamera & USB Scanner | `[ ] Approved` | |
| 7 | **Modul B.g** | E-Ticket terkirim via email dalam bentuk PDF | `[ ] Approved` | |
| 8 | **Modul C.c** | Vendor bisa Approve/Reject pesanan alat | `[ ] Approved` | |
| 9 | **Modul C.d** | Escrow payment DP 30% & Pelunasan 70% | `[ ] Approved` | |
| 10| **Modul C.f** | Export data pesanan non-tiket format .xlsx | `[ ] Approved` | |
| 11| **Modul D.a** | Admin generate Custom Quotation | `[ ] Approved` | |
| 12| **Modul D.b** | Link checkout pembayaran harga negosiasi kustom | `[ ] Approved` | |
| 13| **Modul E.a** | Fitur Rating & Review dinonaktifkan sementara | `[ ] Approved` | |
| 14| **Modul E.b** | Gambar terkompresi otomatis sebelum upload | `[ ] Approved` | |
| 15| **Security** | Semua endpoint publik berisiko berhasil dikunci | `[ ] Approved` | |
