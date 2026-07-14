# Celeparty — *Event Marketplace Platform* 🎪🎟

[![Next.js](https://img.shields.io/badge/Next.js-14.2.23-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![Strapi](https://img.shields.io/badge/Strapi-5.50.1-purple?style=for-the-badge&logo=strapi)](https://strapi.io/)
[![Midtrans](https://img.shields.io/badge/Midtrans-Payment--Gateway-blue?style=for-the-badge)](https://midtrans.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind--CSS-3.4.1-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

**Celeparty** adalah *platform marketplace event* berbasis *web* modern yang menghubungkan penyedia jasa (*vendor*) dengan pelanggan. *Platform* ini memfasilitasi dua alur bisnis utama: **Penyewaan Perlengkapan & Jasa Event (*Equipment Rental*)** serta **Penjualan Tiket Masuk Event (*E-Ticketing System*)** dengan verifikasi *QR code* yang aman.

Proyek ini menggunakan struktur ***monorepo*** yang mengintegrasikan *Frontend* (*Next.js*) dan *Backend* *CMS* (*Strapi 5*), serta telah ditingkatkan secara menyeluruh ke standar tingkat korporat (*corporate-grade*).

---

## 📌 Daftar Isi
1. [Struktur Repositori](#-struktur-repositori)
2. [Arsitektur & Aliran Data](#-arsitektur--aliran-data)
3. [Fitur Utama](#-fitur-utama)
4. [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
5. [Pekerjaan Tambahan & Redesain](#-pekerjaan-tambahan--redesain)
6. [Struktur Dokumentasi Terpusat](#-struktur-dokumentasi-terpusat)
7. [Panduan Instalasi & Pengembangan](#-panduan-instalasi--pengembangan)
8. [Konfigurasi Environment Variables](#-konfigurasi-environment-variables)
9. [Deployment & Produksi](#-deployment--produksi)

---

## 📂 Struktur Repositori

Struktur folder utama pada repositori *monorepo* ini dirinci sebagai berikut:

```
celeparty/
├── celeparty-fe/            # Frontend Web App (Next.js 14 App Router)
│   ├── app/                 # Halaman & Routing System (Next.js Router)
│   ├── components/          # Komponen UI global & spesifik domain
│   ├── lib/                 # Core logic, state management (Zustand), utilitas
│   └── public/              # Aset statis frontend
│
├── celeparty-strapi/        # Headless CMS & Backend API (Strapi 5 TypeScript)
│   ├── src/                 # Kustomisasi API, Controller, Lifecycle & Services
│   ├── config/              # Konfigurasi server, database, & plugin Strapi
│   └── public/              # Media uploads & aset backend
│
├── docs/                    # Pusat Dokumentasi Kelas Korporat (Corporate-Grade Docs)
│   ├── architecture/        # Desain Sistem, Flow, & Skema Basis Data
│   ├── api/                 # Endpoint Contracts & REST API Reference
│   ├── deployment/          # Panduan Setup, PM2, & Infrastruktur
│   ├── operational/         # Akun Demo & Prosedur Validasi Tiket
│   └── project/             # Kontrak, Rencana Kerja (Todos), & Riwayat Rapat (MoM)
│
├── AGENTS.md                # Panduan Konteks AI & Aturan Arsitektur Mutlak
└── README.md                # Panduan Memulai & Gambaran Umum Proyek
```

---

## 🔄 Arsitektur & Aliran Data

Sistem ini menerapkan pola *Next.js Server-Side API Routes* sebagai perantara aman (*Secure Proxy*) untuk melindungi kunci autentikasi (*API keys*) sebelum meneruskan permintaan dari sisi pengguna (*Client*) ke *Strapi Backend*.

```mermaid
graph TD
    Client[Next.js Client-Side App]
    Proxy[Next.js API Routes Proxy]
    Strapi[Strapi 5 Backend TypeScript]
    DB[(Database PostgreSQL 17)]
    Midtrans[Midtrans Payment Gateway]
    Resend[Resend Email Service]

    Client -->|API Request| Proxy
    Proxy -->|Add Auth Credentials / Server Key| Strapi
    Strapi -->|CRUD Query| DB
    Proxy -->|Init Snap Transaction| Midtrans
    Midtrans -->|Webhook Notification| Proxy
    Strapi -->|Trigger Lifecycle Email| Resend
```

---

## ✨ Fitur Utama

### 🛍️ Rental Perlengkapan & Layanan Event
1. **Katalog Produk Fleksibel:** Pengelompokan produk per *vendor* dengan *filter* canggih (kategori, lokasi kabupaten/provinsi, rentang harga, pencarian, dan penanggalan).
2. **Multi-Varian:** Mendukung varian produk (harga, kuota, tenggat waktu pemesanan).

### 🎫 *E-Ticketing System End-to-End*
1. **Input Data Penerima:** Pembeli dapat memasukkan detail nama penerima tiket secara individual sebelum memesan.
2. **Auto-Generated PDF & QR Code:** Tiket berformat *PDF* profesional lengkap dengan *QR Code* unik yang akan dikirim secara otomatis ke email penerima setelah transaksi berhasil (*settlement*).
3. **Scan & QR Verification:** Antarmuka khusus *vendor* untuk memindai *QR Code* tiket menggunakan kamera gawai guna memverifikasi keabsahan tiket secara *real-time*.

### 💳 Integrasi Pembayaran Midtrans Snap
1. Transaksi aman melalui *Midtrans Snap*.
2. Sinkronisasi status pembayaran otomatis (*Settlement*, *Pending*, *Expired*) melalui *webhook*.
3. Sistem *Escrow* yang memastikan dana tertahan di *platform* hingga acara terlaksana sebelum diteruskan ke saldo *vendor*.

### 💰 *Vendor Wallet* & Penarikan Dana
1. Dasbor pengelolaan saldo *vendor* (*Saldo Aktif* & *Saldo Refund*).
2. Modul pengajuan penarikan dana (*withdrawal request*) terintegrasi.
3. Otomatisasi potongan biaya admin *platform* (*application fee*) per kategori acara.

---

## 🛠️ Teknologi yang Digunakan

### Frontend (`celeparty-fe`)
* **Core Framework:** Next.js 14.2.23 (*App Router*, *Server Actions*, *Standalone Output*)
* **Language:** TypeScript 5.3.3
* **State Management:** Zustand 4.5.2 (*Persisted session storage*)
* **Data Fetching:** TanStack React Query v5 (*Data caching* & *auto-refetch* 10s)
* **Styling:** Tailwind CSS 3.4.1 & *shadcn/ui* (*Radix UI primitives*)
* **Autentikasi:** NextAuth.js 4.24.7 (*Credentials Provider* & *JWT*)
* **Ekspor Dokumen:** *jsPDF* & *jsPDF-AutoTable*
* **Lainnya:** *Framer Motion* (Animasi), *Axios* (*HTTP Client*), *Biome* & *ESLint* (*Linting*)

### Backend (`celeparty-strapi`)
* **Core Engine:** Strapi Headless CMS 5.50.1 (Migrasi Penuh ke *TypeScript*)
* **Language:** TypeScript (Node.js >= 18)
* **Database:** PostgreSQL 17+ (Stabilitas & performa *production-grade*)
* **Security:** *Users-Permissions Plugin* (*RBAC*: *Customer*, *Vendor*, *Admin*)
* **Email System:** Resend Email Provider (`strapi-provider-email-resend`)
* **Pembuatan PDF:** PDFKit 0.17.2
* **Penjadwalan:** *Cron Job* Internal (Pengecekan kedaluwarsa varian & tiket tiap 60 detik)

---

## 💎 Pekerjaan Tambahan & Redesain

Untuk memenuhi kebutuhan bisnis yang lebih berkembang dan meningkatkan kredibilitas platform, beberapa pekerjaan tambahan (*change requests*) telah berhasil disepakati dan diintegrasikan ke dalam repositori utama:

### 1. Migrasi Penuh Backend ke TypeScript
Seluruh kode sumber pada modul `celeparty-strapi` (sebelumnya menggunakan *JavaScript*) telah dimigrasi 100% ke *TypeScript*. Proses ini mencakup:
* Konfigurasi *type checking* ketat menggunakan `tsconfig.json`.
* Deklarasi tipe data kustom (*interfaces* & *types*) untuk semua *controller*, *services*, dan *lifecycles*.
* Eliminasi penggunaan `require()` dan standarisasi menggunakan *ES modules* (`import`/`export`).

### 2. Redesain Frontend Menyeluruh (*Comprehensive UI/UX Redesign*)
Sisi antarmuka pengguna (`celeparty-fe`) didesain ulang secara menyeluruh dengan mengutamakan aspek estetika modern, responsivitas prima, serta kualitas *corporate-grade*:
* **Struktur Komponen Konsisten:** Menggunakan sistem token desain yang ketat berbasis *Tailwind CSS* untuk warna *branding* utama (`#3E2882` untuk *primary*, `#CBD002` untuk *accent*).
* **Tipografi Premium:** Integrasi font lokal *Inter* (untuk teks utama) dan *Quicksand* (untuk judul) yang dimuat menggunakan komponen `next/font`.
* **Micro-Animations:** Penambahan efek transisi halus menggunakan *Framer Motion* untuk interaksi tombol, transisi halaman, dan penayangan modal dialog.

---

## 📂 Struktur Dokumentasi Terpusat

Seluruh dokumentasi teknis dan administratif telah diatur secara rapi dan profesional di dalam folder `docs/` dengan klasifikasi sebagai berikut:

| Kategori Dokumen | Berkas Utama | Deskripsi |
|---|---|---|
| **Arsitektur & Desain** | [system-architecture.md](file:///home/ariefmavl/learning/cerdascrew/celeparty-dev/docs/architecture/system-architecture.md) | Penjelasan diagram sistem, tech stack lengkap, dan desain database global |
| **Panduan Pengembangan** | [development-guide.md](file:///home/ariefmavl/learning/cerdascrew/celeparty-dev/docs/architecture/development-guide.md) | Dokumentasi rinci modul, lifecycles, API endpoints, dan alur data |
| **Panduan Instalasi** | [setup-guide.md](file:///home/ariefmavl/learning/cerdascrew/celeparty-dev/docs/deployment/setup-guide.md) | Langkah-langkah detail penyiapan environment pengembangan dan produksi |
| **Ruang Lingkup Kontrak** | [contract-scope.md](file:///home/ariefmavl/learning/cerdascrew/celeparty-dev/docs/project/contract-scope.md) | Rincian pekerjaan legalitas sesuai dengan kesepakatan kontrak |
| **Rencana Kerja & Todos** | [todos.md](file:///home/ariefmavl/learning/cerdascrew/celeparty-dev/docs/project/todos.md) | Daftar prioritas pekerjaan, rantai dependensi, dan kriteria penerimaan |
| **Panduan Operasional** | [client-demo-guide.md](file:///home/ariefmavl/learning/cerdascrew/celeparty-dev/docs/operational/client-demo-guide.md) | Panduan langkah demi langkah demonstrasi fitur kepada klien |

---

## 🚀 Panduan Instalasi & Pengembangan

Sangat direkomendasikan untuk merujuk pada berkas **[setup-guide.md](file:///home/ariefmavl/learning/cerdascrew/celeparty-dev/docs/deployment/setup-guide.md)** untuk instruksi penyiapan lingkungan yang lebih lengkap. Berikut adalah ringkasan langkah-langkahnya:

### Langkah 1: Kloning Repositori
```bash
git clone <repository-url> celeparty
cd celeparty
```

### Langkah 2: Setup Backend (Strapi)
1. Pindah ke direktori *backend*:
   ```bash
   cd celeparty-strapi
   ```
2. Pasang dependensi dan jalankan *server* dalam mode pengembangan:
   ```bash
   npm install
   npm run develop
   ```

### Langkah 3: Setup Frontend (Next.js)
1. Pindah ke direktori *frontend*:
   ```bash
   cd ../celeparty-fe
   ```
2. Pasang dependensi dan jalankan aplikasi:
   ```bash
   npm install
   npm run dev
   ```

---

## 🔑 Konfigurasi Environment Variables

Silakan salin templat konfigurasi variabel lingkungan berikut ke berkas `.env.local` (*frontend*) dan `.env` (*backend*):

### Frontend (`celeparty-fe/.env.local`)
```env
BASE_API=http://localhost:1337/api
URL_API=http://localhost:1337/api
KEY_API=your_strapi_api_token_here
URL_MEDIA=http://localhost:1337
BASE_API_REGION=https://api.binderbyte.com/wilayah
KEY_REGION=your_binderbyte_api_key_here
NEXTAUTH_SECRET=your_nextauth_jwt_secret_32_chars
NEXTAUTH_URL=http://localhost:3000
MIDTRANS_SERVER_KEY=your_midtrans_server_key
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

### Backend (`celeparty-strapi/.env`)
```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt_secret
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_user_jwt_secret
RESEND_API_KEY=your_resend_api_key
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://celeparty:celeparty@127.0.0.1:5432/celeparty
FRONTEND_URL=http://localhost:3000
```

---

## 📦 Deployment & Produksi

### Standalone Build (Frontend)
Aplikasi *Next.js* dikompilasi menggunakan mode `standalone` untuk mengoptimalkan ukuran *bundle* di *hosting* mandiri (*VPS*/*Docker*).
```bash
# Di dalam folder celeparty-fe
npm run build
pm2 start ecosystem.config.js
```

### Produksi Backend (Strapi)
Untuk menjalankan backend Strapi pada lingkungan produksi dengan database PostgreSQL:
```bash
# Di dalam folder celeparty-strapi
npm run build
npm run start
```
