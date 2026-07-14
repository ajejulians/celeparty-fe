# CELEPARTY — Data Uji Coba & Akun Simulasi (Demo Credentials & Mock Data)

Dokumen ini menyediakan data riil, akun uji coba, detail produk mockup, serta kredensial gateway pembayaran Midtrans Sandbox untuk mendukung seluruh skenario di **Panduan Simulasi & Uji Fitur (Client Demo Guide)**.

---

## 1. AKUN SIMULASI SISTEM (DEMO ACCOUNTS)

Karena database pengembangan dimulai dari kondisi kosong (*clean database slate*), daftarkan/buat akun-akun di bawah ini terlebih dahulu melalui Halaman Registrasi Frontend (`{FRONTEND_URL}/register`) atau melalui Strapi Admin Panel (`http://localhost:1337/admin` -> *Settings* -> *Administration Panel* atau *Content Manager* -> *Users*).

### 1.1 Akun Pembeli (Customer Account)
Digunakan untuk membeli tiket, mengisi form recipient, menyewa perlengkapan event, dan membayar custom quotation.

*   **Email:** `customer_celeparty@mail.com`
*   **Username:** `customer_demo`
*   **Password:** `PasswordDemo123!`
*   **Role di Strapi:** `Authenticated`

### 1.2 Akun Vendor/Mitra (Vendor Account)
Digunakan untuk mengelola produk sewa, melihat tiket terjual, mengonfirmasi pesanan (Approve/Reject), dan memverifikasi tiket via barcode scanner.

*   **Email:** `vendor_celeparty@mail.com`
*   **Username:** `vendor_acme_event`
*   **Password:** `PasswordDemo123!`
*   **Role di Strapi:** `Authenticated` *(dengan field `vendor_doc_id` diatur ke `doc-acme-event-001` di user profile)*
*   **Nama Usaha Vendor:** `Acme Event Solutions`
*   **Wilayah Operasional:** `DKI Jakarta`

### 1.3 Akun Admin CMS (Strapi Admin Account)
Digunakan untuk mengelola data master, menyetujui produk vendor, memantau riwayat transaksi keseluruhan, dan membuat *Custom Quotation*.

*   **URL Portal:** `http://localhost:1337/admin`
*   **Email:** `admin@celeparty.com`
*   **Username:** `admin_celeparty`
*   **Password:** `AdminPasswordCeleparty2026!`
*   **Role:** `Super Admin`

---

## 2. DATA PRODUK & TIKET MOCKUP (MOCK PRODUCTS)

Buat data produk berikut melalui Strapi Admin Panel di bawah koleksi **`Product`** dan **`Ticket`** untuk menyajikan data katalog yang menarik di mata klien.

### 2.1 Produk Tiket Event (Modul B)
*   **Koleksi:** `Ticket`
*   **Nama Event:** *"Java Jazz Festival Celeparty 2026"*
*   **Kategori:** *Music Festival* (Event)
*   **Lokasi:** `JIExpo Kemayoran, Jakarta`
*   **Event Date:** `2026-08-15`
*   **Deskripsi:**
    > *"Festival musik jazz tahunan terbesar di Indonesia kembali hadir dengan kolaborasi spesial musisi nasional dan internasional. Dapatkan pengalaman festival terbaik bersama Celeparty!"*
*   **Varian Tiket & Kuota:**
    1.  **Varian 1 (Daily Pass - Friday):** 
        *   Harga: `Rp 450.000`
        *   Kuota: `100` tiket
        *   Active: `true`
    2.  **Varian 2 (Daily Pass - Saturday):** 
        *   Harga: `Rp 550.000`
        *   Kuota: `150` tiket
        *   Active: `true`
    3.  **Varian 3 (3-Day Pass VIP):** 
        *   Harga: `Rp 1.500.000`
        *   Kuota: `50` tiket
        *   Active: `true`

### 2.2 Produk Rental Perlengkapan — Opsi Escrow Aktif (Modul C)
*   **Koleksi:** `Product`
*   **Nama Produk:** *"Sewa Panggung Utama & Sound System Rigging 10.000 Watt"*
*   **Kategori:** *Sound & Stage*
*   **Vendor Owner:** `Acme Event Solutions` (vendor_doc_id: `doc-acme-event-001`)
*   **Escrow Toggle:** `true` (Aktif)
*   **Harga Sewa Harian:** `Rp 15.000.000`
*   **Breakdown Finansial Otomatis:**
    *   *Down Payment (DP 30%):* Rp 4.500.000
    *   *Pelunasan (70%):* Rp 10.500.000
*   **Deskripsi:**
    > *"Panggung rigging luar ruangan ukuran 8x6 meter lengkap dengan sound system line array FOH 10.000 Watt, monitor panggung, mic wireless shure, dan operator profesional stanby selama event berlangsung. Cocok untuk konser mini, wedding outdoor, dan gathering korporat."*

### 2.3 Produk Rental Perlengkapan — Opsi Escrow Tidak Aktif (Modul C)
*   **Koleksi:** `Product`
*   **Nama Produk:** *"Sewa AC Portable 5 PK (Per Unit)"*
*   **Kategori:** *Cooling System*
*   **Vendor Owner:** `Acme Event Solutions` (vendor_doc_id: `doc-acme-event-001`)
*   **Escrow Toggle:** `false` (Tidak Aktif)
*   **Harga Sewa Harian:** `Rp 1.200.000` (Pembayaran langsung 100% di awal)
*   **Deskripsi:**
    > *"AC portable kapasitas pendinginan 5 PK. Menjaga suhu tenda event outdoor atau aula indoor tetap sejuk dan nyaman. Harga sewa sudah termasuk ongkos kirim Jabodetabek dan instalasi kabel daya."*

---

## 3. KREDENSIAL MIDTRANS SANDBOX (PAYMENT SIMULATOR)

Saat modal pembayaran Midtrans Snap terbuka di layar website, gunakan kredensial berikut untuk melakukan simulasi transaksi berhasil, tertunda, atau gagal.

### 3.1 Kartu Kredit Simulator (Credit Card)
*   **Card Number:** `4811 1111 1111 1111`
*   **Card Expiry:** `12/29` (Bulan/Tahun di masa depan)
*   **CVV:** `123`
*   **Kode OTP (3D Secure):** `112233`
*   *Hasil:* **Success / Settlement**

### 3.2 Simulator Bank Transfer (Virtual Account)
*   Pilih opsi **Bank Transfer** -> **BCA / Mandiri / BNI / Permata**.
*   Salin Nomor Virtual Account yang diterbitkan oleh Midtrans Snap.
*   Buka Simulator Pembayaran Midtrans di browser Anda:
    `https://simulator.sandbox.midtrans.com/`
*   Masukkan Nomor Virtual Account tersebut dan klik **"Pay"** (Bayar) untuk mensimulasikan pembayaran instan tanpa uang sungguhan.
*   *Hasil:* **Success / Settlement** (webhook akan langsung mengirim callback ke `/api/midtrans-webhook` dan merubah status pesanan).

### 3.3 Kartu Kredit Simulator Uji Gagal (Credit Card Decline)
*   **Card Number:** `4811 1111 1111 1112`
*   **Card Expiry:** `12/29`
*   **CVV:** `123`
*   *Hasil:* **Transaction Declined / Failed**

---

## 4. TIKET SIMULATOR & KODE VERIFIKASI (TICKET VERIFICATION DATA)

Gunakan daftar barcode mockup ini untuk melakukan simulasi verifikasi manual tanpa melakukan scan QR code secara fisik:

| Barcode Tiket (17 Digit) | Nama Pemegang | Event | Status Uji Coba |
|---|---|---|---|
| `20260703C12A4F9E8` | Budiman | Java Jazz Festival | **VALID & ACTIVE** (Gunakan ini untuk scan pertama yang sukses) |
| `20260703B89E2F1C2` | Anisa | Java Jazz Festival | **ALREADY USED** (Gunakan ini untuk simulasi scan kedua kali untuk menunjukkan penolakan ganda) |
| `99999999999999999` | Palsu | Tidak Ada | **INVALID / NOT FOUND** (Gunakan ini untuk mensimulasikan kegagalan scan tiket palsu) |

---

## 5. LANGKAH-LANGKAH MENYIAPKAN DATA SEEDING MANDIRI

Jika Anda ingin mengisi database dengan cepat sebelum presentasi, Anda dapat mengikuti langkah-langkah berikut:

1.  **Daftarkan User Baru di Frontend:**
    Akses `{FRONTEND_URL}/register`, daftarkan `customer_celeparty@mail.com` dan `vendor_celeparty@mail.com`.
2.  **Ubah Role Vendor di Strapi:**
    Buka `http://localhost:1337/admin` -> masuk ke menu *Content Manager* -> *Users* -> pilih `vendor_acme_event`. Isi field `vendor_doc_id` dengan `doc-acme-event-001`.
3.  **Buat Kategori Produk:**
    Masuk ke *Content Manager* -> *Category* -> Tambahkan kategori: *Music Festival*, *Sound & Stage*, *Cooling System*.
4.  **Buat Produk Sewa & Tiket Baru:**
    Tambahkan produk dan tiket baru sesuai data Mockup di atas, isi harga, deskripsi, varian, dan pasang gambar mockup (misalnya foto panggung atau poster konser).
5.  **Siap Presentasi:**
    Setelah data terpasang, ikuti urutan simulasi pada **Client Demo Guide** untuk memukau klien Anda.
