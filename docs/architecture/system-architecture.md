# CELEPARTY — Dokumentasi Teknis & Arsitektur Sistem

> **Versi Dokumentasi:** 1.0 — *Pre-Contract Baseline*  
> **Status:** *Fully Implemented & Hardened* (*Production Ready*)  
> **Platform:** *Marketplace Event* (Penyewaan Perlengkapan & Pembelian Tiket)  
> **⚠️ Catatan:** Dokumen ini merupakan *baseline* arsitektur sistem sebelum kontrak pengembangan. Untuk dokumentasi kontrak aktif (termasuk *Escrow*, *Custom Quotation*, dan spesifikasi implementasi lengkap), rujuk ke **[development-guide.md](../architecture/development-guide.md) v2.1** (*Fully Implemented*).

---

## DAFTAR ISI

1. [Gambaran Umum Sistem](#1-gambaran-umum-sistem)
2. [Arsitektur & Teknologi](#2-arsitektur--teknologi)
3. [Frontend — Celeparty FE](#3-frontend--celeparty-fe)
4. [Backend — Celeparty Strapi](#4-backend--celeparty-strapi)
5. [Aliran Data End-to-End](#5-aliran-data-end-to-end)
6. [Sistem Autentikasi & Otorisasi](#6-sistem-autentikasi--otorisasi)
7. [Sistem Pembayaran](#7-sistem-pembayaran)
8. [Sistem E-Ticket & Verifikasi](#8-sistem-e-ticket--verifikasi)
9. [Sistem Saldo Vendor & Fee](#9-sistem-saldo-vendor--fee)
10. [Sistem Email & Notifikasi](#10-sistem-email--notifikasi)
11. [Sistem Manajemen Produk](#11-sistem-manajemen-produk)
12. [Struktur Basis Data & Relasi](#12-struktur-basis-data--relasi)
13. [Routing & Middleware](#13-routing--middleware)
14. [Environment Variables](#14-environment-variables)
15. [Deployment & Infrastruktur](#15-deployment--infrastruktur)
16. [Keamanan](#16-keamanan)
17. [Catatan Arsitektural & Potensi Pengembangan](#17-catatan-arsitektural--potensi-pengembangan)

---

## 1. GAMBARAN UMUM SISTEM

Celeparty adalah platform marketplace event berbasis web yang menghubungkan penyedia jasa (vendor) dengan pelanggan. Platform ini melayani dua skenario bisnis utama:

| Skenario | Deskripsi |
|----------|-----------|
| **Penyewaan Perlengkapan Event** | Vendor menyewakan peralatan seperti dekorasi, sound system, tenda, katering, dll. |
| **Penjualan Tiket Event** | Vendor menjual tiket masuk untuk acara seperti konser, seminar, workshop, dll. |

### 1.1 Actor Sistem

| Actor | Peran |
|-------|-------|
| **Pengunjung (Unauthenticated)** | Melihat katalog produk, blog, halaman statis |
| **Pembeli (Customer)** | Membeli produk/tiket, melihat riwayat pesanan, mengelola profil |
| **Vendor/Mitra** | Mengelola produk, tiket, pesanan, saldo, verifikasi tiket |
| **Admin Strapi** | Mengelola konten, user, konfigurasi dari CMS panel |

### 1.2 Alur Bisnis Utama

```
[Pengunjung] → Registrasi → [Customer/Vendor]
                                      ↓
[Customer] → Browse Produk → Add to Cart → Checkout → Midtrans Payment
                                      ↓
                          Settlement (Webhook Midtrans)
                                      ↓
              ┌─────────────────────────────────────────┐
              │                                         │
    [Equipment Order]                          [Ticket Order]
              ↓                                         ↓
    Invoice PDF via Email              Generate E-Ticket + QR Code
    Vendor mendapat notifikasi         Kirim PDF Tiket per Recipient
                                       Update Saldo Vendor
                                       Kurangi Kuota Variant
```

---

## 2. ARSITEKTUR & TEKNOLOGI

### 2.1 Diagram Arsitektur

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CELEPARTY SYSTEM                             │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                 FRONTEND (celeparty-fe)                   │       │
│  │  Next.js 14 (App Router) · TypeScript · Tailwind CSS     │       │
│  │                                                          │       │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │       │
│  │  │ NextAuth │  │ React    │  │ Zustand  │  │ Radix  │  │       │
│  │  │ (JWT)    │  │ Query    │  │ (Cart)   │  │ UI     │  │       │
│  │  └──────────┘  └──────────┘  └──────────┘  └────────┘  │       │
│  └──────────────────────┬───────────────────────────────┬───┘       │
│                         │ API Routes (Proxy)           │            │
└─────────────────────────┼───────────────────────────────┼───────────┘
                          │                               │
                          ▼                               ▼
┌─────────────────────────────────┐  ┌──────────────────────────────┐
│         STRAPI BACKEND          │  │       MIDTRANS SNAP          │
│     (celeparty-strapi)          │  │   Payment Gateway            │
│                                 │  │                              │
│  ┌────────────┐ ┌────────────┐  │  │  Snap Transaction            │
│  │ Content    │ │ Custom     │  │  │  Webhook Notification        │
│  │ Types (13) │ │ Controllers│  │  │                              │
│  └────────────┘ └────────────┘  │  └──────────────────────────────┘
│  ┌────────────┐ ┌────────────┐  │
│  │ Lifecycles │ │ Extensions │  │  ┌──────────────────────────────┐
│  │ (Business  │ │ (Users-    │  │  │   RESEND (Email Provider)    │
│  │ Logic)     │ │ Permissions│  │  │                              │
│  └────────────┘ └────────────┘  │  │  Invoice & E-Ticket PDF      │
│  ┌────────────┐                 │  │  Notification Emails         │
│  │ Bootstrap  │                 │  └──────────────────────────────┘
│  │ (Cron Job) │                 │
│  └────────────┘                 │
│                                 │
│  DB: PostgreSQL 17+             │
└─────────────────────────────────┘
```

### 2.2 Tech Stack Lengkap

#### Frontend (celeparty-fe)

| Kategori | Teknologi | Versi | Fungsi | Keterangan |
|----------|-----------|-------|--------|------------|
| **Framework** | Next.js | 14.2.23 | App Router, SSR, API Routes | Didesain ulang secara komprehensif untuk tampilan profesional, modern, dan kelas korporat |
| **Bahasa** | TypeScript | 5.3.3 | Type safety | |
| **Styling** | Tailwind CSS | 3.4.1 | Utility-first CSS | |
| **UI Library** | Radix UI + shadcn/ui | — | Komponen aksesibel | |
| **State Management** | Zustand | 4.5.2 | Cart, User, Transaction store | |
| **Server State** | TanStack React Query | 5.24.1 | Data fetching & caching | |
| **Form & Validasi** | React Hook Form + Zod | 7.51.5 / 3.23.8 | Form validation | |
| **Autentikasi** | NextAuth.js | 4.24.7 | JWT + Credentials | |
| **Payment** | Midtrans Client | 1.4.2 | Midtrans Snap | |
| **PDF** | jsPDF + jsPDF-AutoTable | 3.0.4 | Invoice PDF (frontend) | |
| **QR/Barcode** | @zxing/library, jsQR | 0.21.3 | QR Scanner & Generator | |
| **Rich Text** | CKEditor 5 | 41.4.2 | Editor konten | |
| **Icons** | Lucide React, React Icons | 0.341.0 | SVG icons | |
| **HTTP Client** | Axios | 1.7.9 | API calls | |
| **Carousel** | React Slick, Embla | 0.30.2 | Banner & produk slider | |
| **Animation** | Framer Motion | 11.0.6 | Animasi UI | |
| **Linting** | Biome + ESLint | 1.9.2 | Code quality | |

#### Backend (celeparty-strapi)

| Kategori | Teknologi | Versi | Fungsi | Keterangan |
|----------|-----------|-------|--------|------------|
| **CMS Framework** | Strapi | 5.50.1 | Headless CMS | Migrasi penuh ke TypeScript |
| **Bahasa** | TypeScript (Node.js) | ≥18.x | Server-side logic | Migrasi 100% dari JavaScript |
| **Database** | PostgreSQL | 17+ | Database utama | Migrasi penuh dari SQLite |
| **Auth Plugin** | users-permissions | 5.50.1 | User & role management | |
| **Email** | strapi-provider-email-resend | 1.0.4 | Transactional emails | |
| **PDF** | PDFKit | 0.17.2 | E-Ticket & Invoice PDF | |
| **QR Code** | qrcode | 1.5.4 | QR generation | |
| **Rich Text** | CKEditor 5 Plugin | 4.0.11 | Editor konten | |
| **CORS** | @strapi/plugin-users-permissions | — | API security | |

---

## 3. FRONTEND — CELEPARTY FE

### 3.1 Struktur Folder

```
celeparty-fe/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout global
│   ├── page.tsx                      # Homepage
│   ├── not-found.tsx                 # Halaman 404
│   ├── middleware.ts                 # Auth middleware
│   │
│   ├── about/                        # Halaman Tentang
│   ├── auth/                         # Autentikasi
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registrasi user
│   │   ├── register/mitra/           # Registrasi vendor
│   │   ├── forgot-password/          # Lupa password
│   │   ├── reset-password/           # Reset password
│   │   └── confirmation/             # Konfirmasi email
│   ├── blog/                         # Blog
│   │   ├── page.tsx                  # Daftar artikel
│   │   └── [slug]/                   # Detail artikel
│   ├── cart/                         # Keranjang
│   │   ├── page.tsx                  # Isi keranjang
│   │   ├── dataContent.tsx           # Logic cart (626 baris)
│   │   ├── order-summary/            # Checkout + Midtrans
│   │   └── success/                  # Sukses bayar
│   ├── contact/                      # Kontak
│   ├── fonts/                        # Font lokal (Inter, Quicksand)
│   ├── policy/                       # Syarat & Ketentuan
│   ├── products/                     # Katalog produk
│   │   ├── page.tsx                  # Listing
│   │   ├── ProductContent.tsx        # Logic listing (639 baris)
│   │   ├── ItemCategory.tsx          # Kategori
│   │   └── [slug]/                   # Detail produk
│   ├── qr/                           # QR Scanner
│   ├── ticket-render/[id]/           # Render tiket
│   ├── user/                         # Dashboard (Protected)
│   │   ├── home/                     # Redirect based on role
│   │   ├── profile/                  # Profil customer
│   │   │   ├── bio/                  # Data diri
│   │   │   └── orders/               # Riwayat pesanan
│   │   └── vendor/                   # Dashboard vendor
│   │       ├── profile/              # Profil vendor (739 baris)
│   │       ├── products/             # CRUD produk
│   │       ├── products/edit/[slug]/ # Edit produk
│   │       ├── add-product/          # Tambah produk/tiket
│   │       ├── orders/               # Pesanan masuk
│   │       ├── tickets/              # Manajemen tiket
│   │       ├── wallet/               # Saldo
│   │       ├── withdraw/             # Tarik saldo
│   │       └── equipment-orders/     # Pesanan perlengkapan
│   │
│   └── api/                          # API Routes (Proxy ke Strapi)
│       ├── auth/[...nextauth]/       # NextAuth handler
│       ├── products/                 # Proxy produk
│       ├── tickets/                  # Proxy tiket
│       ├── banners/                  # Proxy banner
│       ├── blogs/                    # Proxy blog
│       ├── payment/                  # Init Midtrans
│       ├── transaction-proxy/        # CRUD transaksi (unified)
│       ├── transaction-tickets-proxy/# CRUD transaksi tiket (legacy)
│       ├── midtrans-webhook/         # Webhook Midtrans (521 baris)
│       ├── send-*-email/             # Kirim email
│       ├── qr-verify/                # Verifikasi QR
│       ├── my/                       # Data user saat ini
│       └── ... (debug endpoints)
│
├── components/                       # Shared Components
│   ├── ui/                           # shadcn/ui primitives
│   ├── Header.tsx                    # Navigasi utama
│   ├── TopHeader.tsx                 # Top bar
│   ├── Footer.tsx                    # Footer
│   ├── SessionWrapper.tsx            # NextAuth SessionProvider
│   ├── MainBanner.tsx                # Banner carousel
│   ├── EventList.tsx                 # Grid event type
│   ├── ErrorBoundary.tsx             # Error boundary
│   ├── ErrorNetwork.tsx              # Error network display
│   ├── Skeleton.tsx                  # Loading skeleton
│   ├── InvoiceViewer.tsx             # PDF invoice viewer
│   │
│   ├── product/                      # Components produk
│   │   ├── ProductList.tsx           # Grid produk
│   │   ├── ItemProduct.tsx           # Card produk
│   │   ├── ProductFilters.tsx        # Filter sidebar (272 baris)
│   │   ├── ProductForm.tsx           # Form produk (577 baris)
│   │   ├── ProductVariant.tsx        # Input variant
│   │   ├── ProductImageSlider.tsx    # Slider gambar
│   │   ├── SchemaProduct.ts          # Zod schema produk
│   │   ├── SchemaTicket.ts           # Zod schema tiket
│   │   ├── TicketForm.tsx            # Form tiket
│   │   ├── ProductStatusBadge.tsx    # Status badge
│   │   └── FileUploader.tsx          # Upload gambar
│   │
│   ├── profile/                      # Components profil
│   │   ├── profile-form.tsx
│   │   ├── profile-image-form.tsx
│   │   ├── UserTransactionTable.tsx
│   │   ├── UserTicketTransactionTable.tsx
│   │   ├── ticket-order-details/
│   │   └── vendor/
│   │       ├── BankAccountDetails.tsx
│   │       ├── ManagementTicket.tsx
│   │       ├── region-subregion-selector.tsx
│   │       ├── ticket-management/
│   │       │   ├── TicketDashboard.tsx
│   │       │   ├── TicketVerification.tsx
│   │       │   ├── TicketScan.tsx
│   │       │   ├── TicketSend.tsx
│   │       │   ├── TicketSummaryTable.tsx
│   │       │   └── SoldTicketsTable.tsx
│   │       └── equipment-management/
│   │
│   ├── ticket-templates/             # Template PDF tiket
│   ├── form-components/              # Form controls reusable
│   └── vendor/transaction/           # View transaksi vendor
│
├── lib/                              # Business Logic
│   ├── auth.ts                       # NextAuth config (113 baris)
│   ├── services.ts                   # Axios instances
│   ├── appSettings.ts                # Konstanta (WhatsApp number)
│   ├── utils.ts                      # Utility functions
│   ├── dateUtils.ts                  # Format tanggal
│   ├── dateFormatIndonesia.ts        # Format tanggal Indonesia
│   ├── productUtils.ts               # Helpers produk
│   ├── orderStatusUtils.ts           # Konfigurasi status order
│   ├── store/                        # Zustand stores
│   │   ├── cart.ts                   # Cart store (188 baris)
│   │   ├── user.ts                   # User session store
│   │   ├── transaction.ts            # Transaction store
│   │   └── useButtonStore.ts         # UI button state
│   ├── interfaces/                   # TypeScript interfaces
│   │   ├── iCart.ts                  # CartItem, TicketRecipient
│   │   ├── iProduct.ts              # Product, Variant, Ticket
│   │   ├── iOrder.ts                # Order, PaymentStatus
│   │   ├── iUser.ts                 # User profile, role
│   │   ├── iMerchant.ts             # Vendor profile
│   │   ├── iTicketManagement.ts     # Ticket management
│   │   ├── iEquipmentManagement.ts
│   │   ├── iCategory.ts            # Event category
│   │   ├── iPost.ts                 # Blog post
│   │   └── iCommon.ts              # Shared types
│   ├── enums/                       # Enumerations
│   ├── api/                         # API endpoint docs
│   ├── services/                    # Service modules
│   │   └── emailService.ts          # Email + HTML templates
│   ├── static/                      # Static data
│   │   ├── indonesian-regions.ts    # Data wilayah Indonesia
│   │   └── categories.tsx           # Opsi kategori
│   └── utils/                       # Utility modules
│       ├── ticketManagementUtils.ts
│       ├── ticket-template/         # PDF generator
│       └── exportUtils.ts           # Export Excel/CSV/PDF
│
├── hooks/                           # Custom React Hooks
│   ├── use-balance.ts
│   ├── use-image-profile.ts
│   ├── use-pagination.ts
│   └── use-toast.ts
│
├── types/                           # Type declarations
├── public/                          # Static assets
├── next.config.js                   # Next.js config
├── tailwind.config.js               # Tailwind theme
├── tsconfig.json                    # TypeScript config
├── components.json                  # shadcn/ui config
└── ecosystem.config.js             # PM2 deployment
```

### 3.2 Routing & Halaman

#### Public Routes (No Auth)

| Path | Halaman | Fitur Utama |
|------|---------|-------------|
| `/` | Homepage | Banner carousel, grid event type, product list |
| `/products` | Listing Produk | Filter kategori, lokasi, harga; search; pagination |
| `/products/[slug]` | Detail Produk | Gambar, varian, harga, deskripsi, T&C, add to cart |
| `/blog` | Blog | Daftar artikel, artikel populer |
| `/blog/[slug]` | Detail Blog | Konten artikel, sidebar artikel terkait |
| `/about` | Tentang | Informasi platform |
| `/contact` | Kontak | Form kontak |
| `/policy` | Kebijakan | Syarat & ketentuan |
| `/auth/login` | Login | Support `?theme=vendor` |
| `/auth/register` | Register User | Form registrasi customer |
| `/auth/register/mitra` | Register Vendor | Form registrasi mitra/vendor |
| `/auth/forgot-password` | Lupa Password | Form email |
| `/auth/reset-password` | Reset Password | Form password baru |
| `/auth/confirmation` | Konfirmasi Email | Halaman konfirmasi |

#### Protected Routes (Requires Auth)

| Path | Halaman | Fitur Utama |
|------|---------|-------------|
| `/cart` | Keranjang | List item, pilih/qty, detail customer/recipient |
| `/cart/order-summary` | Checkout | Group by vendor, Midtrans Snap |
| `/cart/success` | Sukses | Konfirmasi pembayaran |
| `/user` | Dashboard | Redirect based on role |
| `/user/home` | Home User | Redirect (vendor → vendor/profile, user → profile/bio) |
| `/user/profile/bio` | Profil Customer | Edit nama, email, telepon, alamat, foto |
| `/user/profile/orders` | Riwayat Pesanan | Tab equipment + tickets |
| `/user/vendor/profile` | Profil Vendor | 5 sections: Personal, Business, Location, Banking, System |
| `/user/vendor/products` | Produk Vendor | CRUD dengan React Query, auto-refetch 10s |
| `/user/vendor/products/edit/[slug]` | Edit Produk | Form edit lengkap |
| `/user/vendor/add-product` | Tambah Produk | Tab switch: Product / Ticket |
| `/user/vendor/orders` | Pesanan Vendor | Tab equipment + tickets |
| `/user/vendor/tickets` | Tiket Vendor | Dashboard, Verification, Send tabs |
| `/user/vendor/wallet` | Saldo | Saldo aktif & refund |
| `/user/vendor/withdraw` | Tarik Saldo | Form permintaan penarikan |

### 3.3 State Management

#### Zustand Stores

| Store | Storage | Key Data |
|-------|---------|----------|
| **cart** | `sessionStorage` | `CartItem[]`, `selectedItems[]`, recipients, notes |
| **user** | `sessionStorage` | User session data |
| **transaction** | `sessionStorage` | Transaction data |
| **useButtonStore** | In-memory | UI button loading states |

**Cart Store — Fitur Utama:**
- Add item (dengan duplicate detection, auto-increment quantity)
- Select/deselect individual items
- Update quantity, notes, customer details
- Manage ticket recipients per item
- Calculate total price
- Mixed product detection (equipment + tickets)
- Validate all selected items are same type (tidak mix di checkout)

### 3.4 Data Fetching Strategy

```typescript
// Dua axios instance berbeda
const axiosData = axios.create({ baseURL: BASE_API, headers: { 'Authorization': KEY_API } });
// → Untuk data publik (produk, banner, blog)

const axiosUser = axios.create({ baseURL: BASE_API });
// → Untuk data terautentikasi (interceptor set Authorization: Bearer <jwt>)
```

Menggunakan **React Query** untuk:
- Product listing (dengan filter params)
- Vendor products (auto-refetch setiap 10 detik)
- Categories, Banners, Blogs
- User profiles & transactions

### 3.5 Design System (Tailwind Config)

**Brand Colors:**
- `c-blue`: `#3E2882` (primary — ungu)
- `c-green`: `#CBD002` (accent — kuning-hijau)
- `c-orange`: `#DA7E01` (secondary accent)
- `c-red`: `#d41f31` (danger)

**Typography:**
- `font-inter` → Body text
- `font-quick` (Quicksand) → Headings
- `font-lato`, `font-hind`, `font-kdam` → Additional

**Custom Spacing:** Scale 18 (`4.5rem`) hingga 102 (`25.5rem`), increment 4px

---

## 4. BACKEND — CELEPARTY STRAPI

### 4.1 Struktur Folder

```
celeparty-strapi/
├── config/
│   ├── admin.ts                     # Admin JWT, API Token, feature flags
│   ├── api.ts                       # REST config (defaultLimit: 300, maxLimit: 2000)
│   ├── database.ts                  # DB: PostgreSQL connection configuration
│   ├── middlewares.ts               # Standard Strapi middleware stack
│   ├── plugins.ts                   # Users-permissions, Email (Resend), CKEditor
│   └── server.ts                    # Host 0.0.0.0:1337, URL staging
│
├── src/
│   ├── index.ts                     # Bootstrap: Cron job tiap 60 detik
│   │                                 # → Disable expired variants & products
│   │
│   ├── admin/                       # Admin panel customization
│   │   └── app.ts                   # Admin app config
│   │
│   ├── api/                         # 13 Content Types
│   │   ├── banner/
│   │   │   └── content-types/banner/schema.json
│   │   ├── blog/
│   │   │   └── content-types/blog/schema.json
│   │   ├── category/
│   │   │   └── content-types/category/schema.json
│   │   ├── product/
│   │   │   ├── content-types/product/schema.json
│   │   │   └── lifecycles.ts        # Email on approve/reject
│   │   ├── ticket/
│   │   │   ├── content-types/ticket/schema.json
│   │   │   ├── lifecycles.ts        # Email on approve/reject
│   │   │   └── controllers/ticket.ts  # Auto-assign user, scope queries
│   │   ├── equipment/
│   │   │   └── content-types/equipment/schema.json
│   │   ├── transaction/
│   │   │   ├── content-types/transaction/schema.json
│   │   │   └── lifecycles.ts        # Validasi + PDF Invoice + Email
│   │   ├── transaction-ticket/
│   │   │   ├── content-types/transaction-ticket/schema.json
│   │   │   ├── controllers/transaction-ticket.ts  # Custom: sendTickets, verifyQR, generateInvoice
│   │   │   ├── lifecycles.ts        # Delegate ke ticket-generator service
│   │   │   └── utils/
│   │   │       ├── ticketGeneratorUtils.ts           # E-Ticket Code, Barcode, QR
│   │   │       └── generateProfessionalTicketPDF.ts  # PDF branded tiket
│   │   ├── ticket-detail/
│   │   │   ├── content-types/ticket-detail/schema.json  # 28 fields
│   │   │   └── lifecycles.ts
│   │   ├── ticket-verification/
│   │   │   ├── content-types/ticket-verification/schema.json
│   │   │   ├── controllers/ticket-verification.ts
│   │   │   └── routes/custom.ts     # GET verifyByCode, PUT markAsUsed
│   │   ├── ticket-send-history/
│   │   │   └── content-types/ticket-send-history/schema.json
│   │   ├── user-event-type/
│   │   │   └── content-types/user-event-type/schema.json
│   │   └── vendor-balance/
│   │       ├── content-types/vendor-balance/schema.json  # (empty — service-only)
│   │       └── controllers/vendor-balance.ts  # PUT update balance
│   │
│   ├── extensions/
│   │   └── users-permissions/
│   │       ├── content-types/user/
│   │       │   ├── schema.json      # Extended user model (+18 custom fields)
│   │       │   └── lifecycles.ts    # Email on saldo_refund changes
│   │       └── strapi-server.ts     # Custom: me, callback, register, customRegister, update
│   │
│   └── components/
│   │   └── variant-product.json     # Reusable: name, image, price, quota, purchase_deadline, active
│   │
│   └── global.d.ts                  # Type declarations
│
├── .env.example                     # Template environment
├── package.json                     # base-strapi-5 v0.1.0
└── ...
```

### 4.2 Content Types — Detail

#### 4.2.1 Banner
| Field | Type | Keterangan |
|-------|------|------------|
| `title` | String (required) | Judul banner |
| `image` | Media | Gambar banner |
| `url` | String | Link tujuan |
| `order` | Integer (unique) | Urutan tampil |

#### 4.2.2 Blog
| Field | Type | Keterangan |
|-------|------|------------|
| `title` | String (required) | Judul artikel |
| `category` | Relation → Category | Kategori blog |
| `image` | Media | Gambar sampul |
| `content` | CKEditor5 | Konten rich text |
| `products` | M2M → Product | Produk terkait |
| `tickets` | M2M → Ticket | Tiket terkait |

#### 4.2.3 Category
| Field | Type | Keterangan |
|-------|------|------------|
| `title` | String (required) | Nama kategori |
| `image` | Media | Icon/gambar |
| `user_event_types` | M2M → User-Event-Type | Tipe event |
| `blogs` | 1:M → Blog | Blog dalam kategori |

#### 4.2.4 Product (Equipment/Event Services)
| Field | Type | Keterangan |
|-------|------|------------|
| `users_permissions_user` | 1:1 → User | Vendor pemilik |
| `title` | String | Nama produk |
| `category` | 1:1 → Category | Kategori |
| `variant` | Component (repeatable) | Varian (name, price, quota, etc.) |
| `user_event_type` | M2O → User-Event-Type | Tipe event |
| `main_image` | Media (multiple) | Gambar produk |
| `description` | CKEditor5 | Deskripsi |
| `terms_conditions` | CKEditor5 | Syarat & ketentuan |
| `rate` | Integer (0-5) | Rating |
| `kabupaten` | String | Kabupaten |
| `region` | String | Region/daerah |
| `lokasi_event` | String | Lokasi event |
| `kota_event` | String | Kota event |
| `event_date` | String | Tanggal event |
| `waktu_event` | String | Waktu event |
| `end_date` | String | Tanggal selesai |
| `end_time` | String | Waktu selesai |
| `sold_count` | Integer | Jumlah terjual |
| `escrow` | Boolean | Status escrow |
| `state` | Enum: pending/rejected/approved | Status approval |
| `is_active` | Boolean | Aktif/nonaktif |

**Lifecycle:** Kirim email ke vendor saat `state` berubah ke `approved` atau `rejected`.

#### 4.2.5 Ticket (Ticket Products)
| Field | Type | Keterangan |
|-------|------|------------|
| `users_permissions_user` | M2O → User (required) | Vendor pemilik |
| `user_event_type` | M2O → User-Event-Type | Tipe event |
| `title` | String (3-255 chars, required) | Nama tiket |
| `description` | CKEditor5 | Deskripsi |
| `terms_conditions` | CKEditor5 | Syarat |
| `main_image` | Media (multiple, required) | Gambar |
| `variant` | Component (repeatable, required) | Varian |
| `event_date` | String (required) | Tanggal event |
| `waktu_event` | String (regex validated) | Waktu |
| `end_date` | String | Tanggal selesai |
| `end_time` | String | Waktu selesai |
| `lokasi_event` | String | Lokasi |
| `kota_event` | String | Kota |
| `rate` | Integer (0-5) | Rating |
| `sold_count` | Integer | Terjual |
| `escrow` | Boolean | Escrow |
| `state` | Enum: pending/rejected/approved | Status |
| `is_active` | Boolean | Aktif |

**Controller Customization:**
- `create` → Auto-assign `users_permissions_user` dari `ctx.state.user.id`
- `find`/`findOne` → Scoped to authenticated user (hanya lihat punya sendiri)

#### 4.2.6 Equipment
| Field | Type | Keterangan |
|-------|------|------------|
| Mirip Product | — | Tambahan: `minimal_order`, `minimal_order_date`, `main_price`, `price_min`, `price_max`, `maximal_order_date` |

#### 4.2.7 Transaction (Equipment Orders)
| Field | Type | Keterangan |
|-------|------|------------|
| `payment_status` | String (required) | Status pembayaran |
| `product_id` | String | ID produk |
| `variant_id` | String | ID varian |
| `variant` | String | Nama varian (snapshot) |
| `quantity` | Integer | Jumlah |
| `shipping_location` | Text | Alamat pengiriman |
| `event_date` | String | Tanggal event |
| `loading_date` | String | Tanggal loading |
| `customer_name` | String | Nama pelanggan |
| `telp` | String | Telepon |
| `note` | Text | Catatan |
| `loading_time` | String | Waktu loading |
| `products` | JSON | Data produk lengkap |
| `order_id` | String | Order ID |
| `email` | String | Email |
| `event_type` | String | Tipe event |
| `verification` | Boolean | Status verifikasi |
| `vendor_doc_id` | String | ID vendor |
| `ticket_recipients` | JSON | Recipients (opsional) |
| `total_quantity` | Integer | Total quantity |
| `total_price` | String | Total harga |
| `product` | M2O → Product | Relasi produk |

**Lifecycle:**
- `beforeCreate`: Validasi produk ada & aktif, ketersediaan varian, deadline pembelian, end_date
- `afterCreate`: Untuk event tipe ticket — generate PDF e-ticket & email dengan attachment
- `afterUpdate`: Saat `payment_status=settlement` — kirim invoice PDF via email

#### 4.2.8 Transaction-Ticket (Ticket Orders — Legacy)
| Field | Type | Keterangan |
|-------|------|------------|
| `product_id` | String | ID produk |
| `product_name` | String | Nama produk (snapshot) |
| `variant_id` | String | ID varian |
| `variant` | String | Nama varian |
| `price` | String | Harga |
| `quantity` | String | Jumlah |
| `customer_name` | String | Nama pelanggan |
| `telp` | String | Telepon |
| `total_price` | String | Total harga |
| `payment_status` | String | Status bayar |
| `event_date` | String | Tanggal event |
| `event_type` | String | Tipe event |
| `note` | Text | Catatan |
| `order_id` | String | Order ID |
| `customer_mail` | String | Email pelanggan |
| `verification` | Boolean | Status verifikasi |
| `vendor_doc_id` | String | ID vendor |
| `recipients` | JSON | Data recipients |
| `products` | JSON | Produk data |
| `ticket_details` | 1:M → Ticket-Detail | Detail tiket |

**Lifecycle — Business Logic Utama:**
- `beforeCreate`: Validasi produk/tiket aktif, end_date, varian availability
- `afterUpdate` (saat `payment_status=settlement`):
  1. Generate `ticket-detail` records (E-Ticket code, QR code, barcode) per quantity
  2. Kurangi stock (quota varian) di produk terkait
  3. Update saldo vendor (`saldo_active`) setelah potong fee:
     - `Midtrans fee: Rp 5.000 × qty`
     - `Celeparty fee: 2.5% × total_price`
     - `Vendor payout: total_price - (5000 × qty + 2.5% × total_price)`
  4. Kirim email konfirmasi ke vendor (equipment orders)
  5. Kirim invoice PDF ke customer
  6. Kirim PDF tiket individual ke setiap recipient

**Custom Controller Methods:**
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `sendTickets()` | `POST /api/transaction-tickets/sendTickets` | Kirim bypass tickets ke multiple recipients dengan PDF & email |
| `verifyQR()` | `POST /api/transaction-tickets/verifyQR` | Verifikasi tiket via barcode |
| `generateInvoice()` | `GET /api/transaction-tickets/generateInvoice/:id` | Download invoice PDF |

#### 4.2.9 Ticket-Detail
**28 fields** — Detail tiket individual:

| Field | Type | Keterangan |
|-------|------|------------|
| `ticket` | M2O → Ticket | Tiket induk |
| `product` | M2O → Product | Produk |
| `variant` | String | Nama varian |
| `ticket_code` | String (unique) | Kode e-ticket: `CTix-YYYYMMDD-XXXXXXXX` |
| `unique_token` | String (unique) | Token untuk QR (32-byte random hex) |
| `qr_code` | Text (base64) | Gambar QR code |
| `qr_code_encrypted` | Text | Token terenkripsi |
| `verification_status` | Enum: unused/verified/invalid/duplicate | Status verifikasi |
| `payment_status` | Enum: pending/paid/refunded/cancelled | Status bayar |
| `buyer_email` | Email (required) | Email pembeli |
| `buyer_phone` | String (required) | No telepon pembeli |
| `buyer_name` | String (required) | Nama pembeli |
| `verified_at` | Datetime | Waktu verifikasi |
| `verified_by` | M2O → User | Petugas verifikasi |
| `notes` | Text | Catatan tambahan |
| `is_bypass` | Boolean | Tiket bypass (undangan) |
| `recipient_name` | String (required) | Nama penerima tiket |
| `identity_type` | Enum: KTP/SIM/Lainnya | Jenis identitas |
| `identity_number` | String (required) | No identitas |
| `whatsapp_number` | String (required) | No WhatsApp |
| `recipient_email` | Email (required) | Email penerima |
| `barcode` | String (unique, required) | Barcode unik |
| `status` | Enum: active/used/cancelled | Status tiket |
| `transaction_ticket` | M2O → Transaction-Ticket | Transaksi induk |
| `user` | M2O → User | User terkait |

#### 4.2.10 Ticket-Verification
| Field | Type | Keterangan |
|-------|------|------------|
| `ticket_detail` | M2O → Ticket-Detail | Tiket diverifikasi |
| `ticket_code` | String | Kode tiket |
| `verification_type` | Enum: scanned/manual/bulk_verify | Metode verifikasi |
| `verified_by` | M2O → User | Petugas |
| `verified_at` | Datetime | Waktu |
| `result` | Enum: success/failed/duplicate/invalid | Hasil |
| `failure_reason` | Text | Alasan gagal |
| `ip_address` | String | IP verifikator |
| `device_info` | String | Info device |
| `notes` | Text | Catatan |

**Custom Routes:**
- `GET /api/ticket-verifications/verifyByCode/:code` — Cari tiket by code
- `PUT /api/ticket-verifications/markAsUsed/:id` — Tandai tiket used

#### 4.2.11 Ticket-Send-History
| Field | Type | Keterangan |
|-------|------|------------|
| `ticket` | M2O → Ticket | Tiket |
| `product` | M2O → Product | Produk |
| `variant` | String | Varian |
| `sent_by` | M2O → User | Pengirim |
| `recipient_count` | Integer | Jumlah penerima |
| `successful_count` | Integer | Berhasil terkirim |
| `failed_count` | Integer | Gagal |
| `recipients` | JSON | Data penerima |
| `message` | Text | Pesan |
| `sent_at` | Datetime | Waktu kirim |
| `email_template` | String | Template email |
| `status` | Enum: pending/sent/partially_sent/failed | Status |
| `error_log` | Text | Log error |

#### 4.2.12 User-Event-Type
| Field | Type | Keterangan |
|-------|------|------------|
| `name` | String | Nama tipe event (Wedding, Birthday, Corporate, dll) |
| `image` | Media | Icon |
| `categories` | M2M → Category | Kategori terkait |
| `products` | 1:M → Product | Produk dalam tipe ini |
| `tickets` | 1:M → Ticket | Tiket dalam tipe ini |
| `application_fee` | Integer | Fee aplikasi untuk tipe ini |
| `is_ticket` | Boolean | Apakah ini tipe tiket? |

### 4.3 Component: Variant-Product

Digunakan oleh Product, Ticket, dan Equipment.

| Field | Type | Keterangan |
|-------|------|------------|
| `name` | String | Nama varian (VIP, Reguler, Ekonomi) |
| `image` | Media | Gambar varian |
| `price` | Integer | Harga |
| `quota` | String | Kuota/stok (disimpan sebagai string) |
| `purchase_deadline` | String | Deadline pembelian |
| `active` | Boolean (default: true) | Status aktif |

### 4.4 Bootstrap - Cron Job

Di `src/index.js`, periodic job berjalan setiap **60 detik** yang:

1. Fetch semua **Products** aktif dengan variants
2. Disable varian yang `purchase_deadline`-nya sudah lewat
3. Mark produk sebagai inactive jika `end_date` + `end_time` sudah lewat
4. Logika yang sama untuk **Tickets**
5. Auto-save perubahan via `entityService.update`

### 4.5 Extensions — Users-Permissions

**Extended User Model** (18 custom fields di luar default):

| Field | Type | Keterangan |
|-------|------|------------|
| `phone` | String | No telepon |
| `address` | Text | Alamat |
| `name` | String | Nama lengkap |
| `birthplace` | String | Tempat lahir |
| `birthdate` | Date | Tanggal lahir |
| `nik` | String | NIK |
| `companyName` | String | Nama perusahaan |
| `bankName` | String | Nama bank |
| `accountNumber` | String | No rekening |
| `accountName` | String | Nama pemilik rekening |
| `serviceLocation` | JSON | Lokasi layanan |
| `image` | Media | Foto profil |
| `transactions` | JSON | Data transaksi |
| `saldo_active` | String | Saldo aktif |
| `saldo_refund` | String | Saldo refund |

**Custom Controllers (strapi-server.js):**

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `GET /api/users/me` | Override | Fetch user with role populate |
| `POST /api/auth/local` | Override | Callback → populate role, return user |
| `POST /api/auth/register` | Override | Register with role assignment |
| `POST /api/auth/custom-register` | New | Register with duplicate validation (username & email) |
| `PUT /api/users/:id` | Override | Update with logging |

**Lifecycle:**
- `saldo_refund` change → kirim email ke user DAN admin (`celeparty.id@gmail.com`)

---

## 5. ALIRAN DATA END-TO-END

### 5.1 Alur Pembelian Tiket

```
[CUSTOMER]                              [NEXT.JS]                           [STRAPI]                      [MIDTRANS]
    │                                       │                                  │                             │
    │  Browse Products                      │                                  │                             │
    │───────────────────────────────────────► GET /api/products                │                             │
    │                                       │─────────────────────────────────► │                             │
    │                                       │◄─────────────────────────────────│                             │
    │◄───────────────────────────────────────│                                  │                             │
    │                                       │                                  │                             │
    │  Add to Cart                          │                                  │                             │
    │───────────────────────────────────────► Zustand: cart store              │                             │
    │                                       │ (sessionStorage persist)         │                             │
    │                                       │                                  │                             │
    │  Fill Recipient Details               │                                  │                             │
    │───────────────────────────────────────► Zustand: updateRecipients()      │                             │
    │                                       │                                  │                             │
    │  Checkout (Order Summary)             │                                  │                             │
    │───────────────────────────────────────► POST /api/transaction-proxy      │                             │
    │                                       │─────────────────────────────────► POST /api/transactions      │
    │                                       │◄─────────────────────────────────│ (created: pending)          │
    │                                       │                                  │                             │
    │                                       │ POST /api/payment                │                             │
    │                                       │────────────────────────────────────────────────────────────► Snap Transaction
    │                                       │◄──────────────────────────────────────────────────────────── Snap Token + URL
    │                                       │                                  │                             │
    │  Midtrans Snap Popup                  │                                  │                             │
    │◄───────────────────────────────────────│ redirect/embed                  │                             │
    │                                       │                                  │                             │
    │  Customer Pays                        │                                  │                             │
    │──────────────────────────────────────────────────────────────────────────────────────────────► Payment Process
    │                                       │                                  │                             │
    │                                       │◄──────────────────────────────────────────────────────────── Webhook POST
    │                                       │  /api/midtrans-webhook           │                             │
    │                                       │  Verify Signature                │                             │
    │                                       │                                  │                             │
    │                                       │  Update Transaction              │                             │
    │                                       │─────────────────────────────────► PUT /api/transactions      │
    │                                       │                                  │ (payment_status=settlement) │
    │                                       │                                  │                             │
    │                                       │  Webhook triggers lifecycle:     │                             │
    │                                       │  - Generate ticket-detail records│                             │
    │                                       │  - Generate QR & Barcode         │                             │
    │                                       │  - Generate PDF E-Ticket         │                             │
    │                                       │  - Reduce variant quota          │                             │
    │                                       │  - Update vendor saldo_active    │                             │
    │                                       │  - Send email (PDF to recipients)│                             │
    │                                       │                                  │                             │
    │  Redirect to Success Page             │                                  │                             │
    │◄───────────────────────────────────────│                                  │                             │
```

### 5.2 Alur Verifikasi Tiket (QR Scan)

```
[VENDOR STAFF]                        [FRONTEND]                         [STRAPI]
    │                                      │                                │
    │  Open QR Scanner                     │                                │
    │─────────────────────────────────────► /user/vendor/tickets            │
    │                                      │                                │
    │  Scan QR Code                        │                                │
    │─────────────────────────────────────► Camera (zxing library)          │
    │                                      │                                │
    │  Extract Barcode                     │                                │
    │                                      │                                │
    │                                      │ POST /api/qr-verify            │
    │                                      │───────────────────────────────► POST /api/transaction-tickets/verifyQR
    │                                      │                                │
    │                                      │                                │  Find ticket-detail by barcode
    │                                      │                                │  Check verification_status
    │                                      │                                │  Check event date validity
    │                                      │                                │  Update status → 'verified'
    │                                      │                                │  Update transaction → verification=true
    │                                      │◄─────────────────────────────── { valid, message, ticket }
    │                                      │                                │
    │  Display Result                      │                                │
    │◄─────────────────────────────────────│                                │
    │  (Valid/Invalid/Already Used)        │                                │
```

---

## 6. SISTEM AUTENTIKASI & OTORISASI

### 6.1 Flow Autentikasi

```
[Browser]                              [Next.js]                           [Strapi]
    │                                      │                                │
    │  Login (email + password)            │                                │
    │─────────────────────────────────────► POST /api/auth/[...nextauth]    │
    │                                      │                                │
    │                                      │ POST /api/auth/local           │
    │                                      │───────────────────────────────► { identifier, password }
    │                                      │                                │
    │                                      │◄─────────────────────────────── { jwt, user }
    │                                      │                                │
    │                                      │ NextAuth JWT Callback          │
    │                                      │ token.accessToken = user.jwt   │
    │                                      │ token.user = user.user         │
    │                                      │ token.user.role = user.role    │
    │                                      │                                │
    │  Session Cookie                      │                                │
    │◄─────────────────────────────────────│ next-auth.session.token        │
    │                                      │                                │
    │  API Call dengan Auth                │                                │
    │─────────────────────────────────────► Axios interceptor               │
    │                                      │ Authorization: Bearer <jwt>   │
    │                                      │───────────────────────────────►│
```

### 6.2 Konfigurasi NextAuth

| Parameter | Value |
|-----------|-------|
| **Strategy** | JWT |
| **Max Age** | 24 jam |
| **Providers** | Credentials (Strapi local), GitHub OAuth |
| **Pages** | signIn: `/auth/login`, signOut: `/` |

### 6.3 Token & Session

```typescript
// Token (JWT Callback)
interface Token {
  accessToken: string;    // JWT dari Strapi
  user: {
    id: string;
    documentId: string;
    email: string;
    username: string;
    role: { id: number; name: string; type: string; description: string };
    // + custom fields
  };
  documentId: string;
  iat: number;
  exp: number;
}

// Session (Session Callback)
interface Session {
  jwt: string;
  user: Token['user'];
  documentId: string;
  expires: string;
}
```

### 6.4 Middleware (`middleware.ts`)

| Path Pattern | Action |
|-------------|--------|
| `/user/*` | Protected — redirect to login if unauthenticated |
| `/cart/*` | Protected — redirect to login if unauthenticated |
| `/auth/login` | Reverse-protected — redirect to `/user/home` if already logged in |

**Config matcher:** Semua path kecuali `api`, `_next/static`, `_next/image`, `.png`

### 6.5 Role-Based Access

| Role | ID | Akses |
|------|----|-------|
| **Customer (User)** | 4 (default) | View produk, beli, riwayat pesanan |
| **Vendor (Mitra)** | 3 | Kelola produk, tiket, pesanan, saldo |
| **Admin** | — | Full akses via Strapi Admin Panel |

Registrasi:
- Regular user → `POST /api/auth/local/register`
- Vendor custom → `POST /api/auth/custom-register` dengan `role=3`

---

## 7. SISTEM PEMBAYARAN

### 7.1 Midtrans Integration

| Komponen | Lokasi | Fungsi |
|----------|--------|--------|
| **Init Payment** | `app/api/payment/route.ts` | Buat Snap transaction |
| **Webhook Handler** | `app/api/midtrans-webhook/route.ts` (521 baris) | Process payment callback |
| **Client Library** | `midtrans-client` (npm) | Midtrans Snap SDK |

### 7.2 Flow Pembayaran Detail

```
1. [Order Summary] Group items by vendor
2. [Transaction Proxy] POST ke Strapi → create transaction (status: pending)
3. [Payment Init] POST /api/payment
   → MidtransClient.Snap.createTransaction({ transaction_details, item_details, customer_details })
   → Return { token, redirect_url }
4. [Midtrans Snap] Embed/redirect ke Midtrans Snap popup
5. [User Pays] Melalui channel: bank transfer, CC, e-wallet, dll
6. [Webhook] Midtrans POST ke /api/midtrans-webhook:
   - Verify signature_key
   - Map status: capture/settlement → settlement, pending → pending, deny/expire → failed
   - Update transaction di Strapi
   - Jika settlement:
     a. Update payment_status → settlement
     b. Baca order_id dari external_id
     c. Update transaction-ticket terkait
     d. Generate ticket-details
     e. Send email notifications
7. [Redirect] User diarahkan ke /cart/success
```

### 7.3 Midtrans Status Mapping

| Midtrans Status | Internal Status | Action |
|-----------------|----------------|--------|
| `capture` | `settlement` | Sukses — generate tiket, kirim email |
| `settlement` | `settlement` | Sukses — generate tiket, kirim email |
| `pending` | `pending` | Menunggu pembayaran |
| `deny` | `failed` | Pembayaran ditolak |
| `expire` | `failed` | Pembayaran expired |
| `cancel` | `failed` | Pembayaran dibatalkan |

---

## 8. SISTEM E-TICKET & VERIFIKASI

### 8.1 E-Ticket Code Generation

Format: `CTix-YYYYMMDD-XXXXXXXX`

- `CTix` → Prefix identifier
- `YYYYMMDD` → Tanggal generate
- `XXXXXXXX` → 8 digit random hex (crypto.randomBytes(4))

Contoh: `CTix-20240315-A8F2E1C9`

### 8.2 Barcode Generation

Format numerik: `8 digit timestamp + 8 digit random hex + 1 digit checksum`

Digunakan untuk scanning dan verifikasi QR.

### 8.3 QR Code Generation

- Library: `qrcode` npm
- Level: `H` (highest error correction)
- Warna: `#3E2882` (Celeparty blue) on white
- Format: Base64 PNG data URL
- Konten: URL verifikasi `{frontend_url}/qr?code={ticketCode}`

### 8.4 PDF E-Ticket

Dihasilkan oleh `generateProfessionalTicketPDF.js` menggunakan **PDFKit**.

**Isi PDF:**
- Header: Logo & branding Celeparty (purple theme)
- Event details: Nama, tanggal, lokasi
- Recipient info: Nama, email, WhatsApp
- Barcode (numeric) — dirender sebagai teks
- QR Code — gambar QR
- Status badge: Active/Used/Cancelled

### 8.5 Verifikasi Tiket

**Via Frontend QR Scanner:**
1. Staff vendor buka `/user/vendor/tickets` → tab Verification
2. Scan QR code via camera (zxing library)
3. POST barcode ke `/api/qr-verify`
4. Backend cari `ticket-detail` by barcode
5. Validasi: status, event_date
6. Update `status → verified`, `verification_status → verified`
7. Tampilkan result

**Via Manual Code:**
1. Staff input kode tiket manual
2. POST ke `/api/transaction-tickets/verifyQR`
3. Flow sama seperti QR scan

**Audit Trail:** Setiap verifikasi tercatat di `ticket-verification` dengan detail:
- Petugas, waktu, tipe verifikasi, hasil, IP address, device info

---

## 9. SISTEM SALDO VENDOR & FEE

### 9.1 Skema Fee

Ketika transaksi tiket settlement:

| Fee | Jumlah | Penerima |
|-----|--------|----------|
| **Midtrans Fee** | Rp 5.000 × qty | Midtrans |
| **Celeparty Fee** | `application_fee` (dari user-event-type) + 2.5% × total_price | Platform |
| **Vendor Payout** | `total_price - (5000 × qty) - (2.5% × total_price)` | Vendor |

### 9.2 Update Balance

```
1. Webhook Midtrans trigger settlement
2. Lifecycle transaction-ticket.afterUpdate
3. Hitung: payout = total_price - (5000 × qty + 2.5% × total_price)
4. Cari vendor berdasarkan vendor_doc_id
5. currentBalance = parseInt(vendor.saldo_active || '0')
6. newBalance = currentBalance + payout
7. Update user.saldo_active = newBalance.toString()
```

### 9.3 Vendor Balance Endpoint

| Endpoint | Method | Deskripsi |
|----------|--------|-----------|
| `/api/vendor-balance/update` | PUT | Update saldo vendor (dipanggil dari webhook) |

Body request: `{ vendorId, amount, transactionId }`

---

## 10. SISTEM EMAIL & NOTIFIKASI

### 10.1 Email Provider

**Primary:** `strapi-provider-email-resend` (Resend API)
**Default from:** `noreply@celeparty.com`
**Fallback:** `@strapi/provider-email-nodemailer`

### 10.2 Trigger Email

| Skenario | Trigger | Penerima | Lampiran |
|----------|---------|----------|----------|
| **Product Approved** | Lifecycle product.state update | Vendor | — |
| **Product Rejected** | Lifecycle product.state update | Vendor | — |
| **Ticket Approved** | Lifecycle ticket.state update | Vendor | — |
| **Ticket Rejected** | Lifecycle ticket.state update | Vendor | — |
| **Order Settlement (Equipment)** | Transaction afterUpdate | Customer | Invoice PDF |
| **Order Settlement (Ticket)** | Transaction-Ticket afterUpdate | Customer | Invoice PDF + Ticket PDF |
| **Ticket Purchase** | Transaction-Ticket afterUpdate | Recipients | Individual Ticket PDF (per recipient) |
| **Refund Notification** | User lifecycle saldo_refund change | User + Admin | — |
| **Send Invitation** | sendTickets controller | Recipients | Ticket PDF |

### 10.3 Format Email

**Template Email Tiket:**
```
Halo {recipient_name},

Anda telah menerima tiket untuk acara {product_name}.

Detail Tiket:
- Nama Event: {product_name}
- Tanggal Acara: {event_date}
- Varian: {variant}
- Barcode: {barcode}
- Status Tiket: {status}

Tiket Anda terlampir dalam bentuk PDF dengan QR code unik.

Terima kasih telah menggunakan Celeparty!
```

---

## 11. SISTEM MANAJEMEN PRODUK

### 11.1 Tipe Produk

Ada tiga tipe produk yang dikelola:

| Tipe | Content Type | Channel | Pembayaran |
|------|-------------|---------|------------|
| **Equipment** (Perlengkapan) | `equipment` | Direct | Midtrans | 
| **Product** (Jasa Event) | `product` | Direct | Midtrans |
| **Ticket** (Tiket Event) | `ticket` | Per Recipient | Midtrans |

### 11.2 Approval Workflow

```
[Vendor Submit] → state: pending
       │
       ▼
[Admin Review di Strapi CMS]
       │
       ├── Approve → state: approved → is_active: true
       │              └── Email notification ke vendor
       │
       └── Reject → state: rejected → is_active: false
                     └── Email notification ke vendor (dengan alasan)
```

### 11.3 Expiry Management (Cron Job — tiap 60 detik)

1. **Variant level:** Jika `purchase_deadline` sudah lewat → `variant.active = false`
2. **Product/Ticket level:** Jika `end_date` + `end_time` sudah lewat → `is_active = false`, semua varian dinonaktifkan

### 11.4 Frontend Product Form (ProductForm.tsx — 577 baris)

Fitur form:
- Upload multiple images (main_image)
- CKEditor untuk description & terms_conditions
- Dynamic variant rows (name, image, price, quota, purchase_deadline)
- Region/subregion selector
- Event type selector (user-event-type)
- Category dropdown
- State management: pending → submit for review

---

## 12. STRUKTUR BASIS DATA & RELASI

### 12.1 Entity Relationship Diagram

```
┌──────────────┐       ┌─────────────────┐       ┌──────────────────┐
│    User      │1─────N│    Product       │1─────N│   Transaction    │
│ (extended)   │       │ (Equipment/      │       │ (Equipment Order)│
│              │1─────N│   Service)       │       └──────────────────┘
│ role:        │       └─────────────────┘
│  - customer  │       ┌─────────────────┐       ┌──────────────────┐
│  - vendor    │1─────N│    Ticket        │1─────N│ Transaction-Ticket│
│  - admin     │       │ (Event Ticket)   │       │ (Ticket Order)   │
│              │       └─────────────────┘       └────────┬─────────┘
│              │                                          │1
│ saldo_active │                                          │
│ saldo_refund │                                          │
└──────────────┘                                          │
        │                                                 ▼
        │1                                     ┌──────────────────┐
        │                                      │  Ticket-Detail   │
        │                                      │ (Individual      │
        │                                      │  E-Ticket)       │
        │                                      └────────┬─────────┘
        │1                                              │1
        │                                               │
        │                                      ┌────────┴─────────┐
        │                                      │Ticket-Verification│
        │                                      │ (Audit Trail)    │
        │                                      └──────────────────┘
        │
        │1──────┐
        │       │
        ▼       ▼
┌──────────────┐       ┌─────────────────┐
│ User-Event-  │N─────M│   Category      │
│ Type         │       └─────────────────┘
│ (Wedding,    │1─────N┌─────────────────┐
│ Birthday...) │       │     Blog        │
│              │       │ (CKEditor)      │
│ application_ │       └─────────────────┘
│ fee, is_ticket│
└──────────────┘
```

### 12.2 Shared Component: Variant-Product

Digunakan oleh: `Product`, `Ticket`, `Equipment`

```
Variant-Product (repeatable component)
├── name: String
├── image: Media
├── price: Integer
├── quota: String (numeric disimpan sebagai string)
├── purchase_deadline: String (date)
└── active: Boolean (default: true)
```

### 12.3 Dual Transaction System

Sistem memiliki dua content type transaksi yang tumpang tindih:

| Content Type | Untuk | Status |
|-------------|-------|--------|
| `transaction` | Equipment orders + Unified | **Active** — digunakan oleh equipment & ticket (unified) |
| `transaction-ticket` | Ticket orders (legacy) | **Legacy** — masih digunakan untuk flow tiket |

Webhook Midtrans mengupdate **kedua** content type untuk memastikan konsistensi data selama migrasi.

---

## 13. ROUTING & MIDDLEWARE

### 13.1 Frontend API Routes (Proxy ke Strapi)

Semua API route di `app/api/` bertindak sebagai proxy yang:

1. Menerima request dari client
2. Menambahkan server-side credentials (API Key, JWT)
3. Forward ke Strapi backend
4. Return response ke client

**Daftar API Routes:**

| Path | Method | Fungsi Proxy |
|------|--------|--------------|
| `/api/auth/[...nextauth]` | * | NextAuth handler |
| `/api/products` | GET, POST | Products CRUD |
| `/api/tickets` | GET, POST | Tickets CRUD |
| `/api/banners` | GET | Banners |
| `/api/blogs` | GET | Blogs |
| `/api/payment` | POST | Init Midtrans Snap |
| `/api/transaction-proxy` | * | Transaction CRUD |
| `/api/transaction-tickets-proxy` | * | Transaction-Ticket CRUD |
| `/api/midtrans-webhook` | POST | Midtrans callback |
| `/api/send-*-email` | POST | Send emails |
| `/api/qr-verify` | POST | QR verification |
| `/api/my` | GET | Current user data |

### 13.2 Backend Custom Routes

| Method | Path | Handler | Auth |
|--------|------|---------|------|
| POST | `/api/transaction-tickets/sendTickets` | `transaction-ticket.sendTickets` | isAuthenticated |
| POST | `/api/transaction-tickets/verifyQR` | `transaction-ticket.verifyQR` | isAuthenticated |
| GET | `/api/transaction-tickets/generateInvoice/:id` | `transaction-ticket.generateInvoice` | isAuthenticated |
| GET | `/api/ticket-verifications/verifyByCode/:code` | `custom.verifyByCode` | isAuthenticated |
| PUT | `/api/ticket-verifications/markAsUsed/:id` | `custom.markAsUsed` | isAuthenticated |
| PUT | `/api/vendor-balance/update` | `vendor-balance.updateBalance` | internal-webhook-secret |
| POST | `/api/emails/send` | `emails.send` | isAuthenticated |
| POST | `/api/email/send` | `email.send` | isAuthenticated |
| POST | `/api/auth/custom-register` | `user.customRegister` | Public |

---

## 14. ENVIRONMENT VARIABLES

### 14.1 Frontend (celeparty-fe)

| Variable | Deskripsi |
|----------|-----------|
| `BASE_API` | URL Strapi backend |
| `URL_API` | Alternative API URL |
| `KEY_API` | Strapi API Key (server-side) |
| `URL_MEDIA` | Base URL untuk file media |
| `BASE_API_REGION` | API data wilayah Indonesia |
| `KEY_REGION` | API key untuk region API |
| `NEXTAUTH_SECRET` | Secret untuk NextAuth JWT |
| `NEXTAUTH_URL` | Public URL aplikasi |
| `JWT_SECRET` | Additional JWT secret |
| `MIDTRANS_SERVER_KEY` | Midtrans server key |
| `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` | Midtrans client key (public) |
| `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION` | Environment Midtrans |
| `PRODUCTION_MODE` | Flag production |
| `GITHUB_ID` / `GITHUB_SECRET` | GitHub OAuth credentials |

### 14.2 Backend (celeparty-strapi)

| Variable | Deskripsi |
|----------|-----------|
| `HOST` | Server host (default: 0.0.0.0) |
| `PORT` | Server port (default: 1337) |
| `SERVER_URL` | Public URL (staging: `sub.typestaging.my.id`) |
| `APP_KEYS` | Strapi app keys |
| `API_TOKEN_SALT` | Salt untuk API tokens |
| `ADMIN_JWT_SECRET` | Secret untuk admin JWT |
| `TRANSFER_TOKEN_SALT` | Salt untuk transfer tokens |
| `JWT_SECRET` | Secret untuk user JWT |
| `RESEND_API_KEY` | API key untuk Resend email |
| `DATABASE_CLIENT` | Database engine (postgres) |
| `DATABASE_HOST` / `PORT` / `NAME` / `USERNAME` / `PASSWORD` | Database credentials |
| `DATABASE_SSL` | SSL flag |
| `FRONTEND_URL` | Frontend URL (untuk QR link) |

---

## 15. DEPLOYMENT & INFRASTRUKTUR

### 15.1 Frontend Deployment

| Tool | Konfigurasi |
|------|------------|
| **Build** | `next build` → standalone output |
| **Process Manager** | PM2 (`ecosystem.config.js`) |
| **Start Command** | `node .next/standalone/server.js` |

**next.config.js key settings:**
- `output: 'standalone'` — untuk self-hosted deployment
- Image domains dikonfigurasi
- Environment variables dibundel saat build

### 15.2 Backend Deployment

| Tool | Konfigurasi |
|------|------------|
| **Build** | `strapi build` |
| **Start** | `strapi start` atau `strapi develop` |
| **Port** | 1337 (default) |
| **Database** | PostgreSQL 17+ (Dev & Production) |

### 15.3 Production Checklist

Berdasarkan file `verify-production-env.sh` dan `test-deployment.sh`:
- Verifikasi environment variables
- Test koneksi database
- Test koneksi Midtrans
- Test koneksi email (Resend)
- Build verification

---

## 16. KEAMANAN

### 16.1 Implementasi Keamanan Saat Ini

| Aspek | Implementasi |
|-------|-------------|
| **API Key** | Server-side KEY_API untuk akses Strapi — tidak bocor ke client |
| **JWT Auth** | NextAuth JWT dengan maxAge 24 jam |
| **Strapi JWT** | Expiry 7 hari |
| **Password** | Di-handle oleh Strapi users-permissions |
| **Midtrans** | Server-side signature verification untuk webhook |
| **CORS** | Strapi middleware CORS configuration |
| **QR Security** | Unique barcode (random 32-byte hex), unique token untuk QR |
| **Middleware** | Proteksi route `/user` dan `/cart` |
| **File Validation** | Upload file hanya untuk gambar |

### 16.2 Rekomendasi Keamanan Tambahan

| Area | Rekomendasi |
|------|-------------|
| **Rate Limiting** | Implement rate limiting untuk API endpoints publik |
| **Input Sanitization** | Validasi Zod di frontend sudah baik, pastikan juga di backend |
| **HTTPS Only** | Pastikan semua traffic via HTTPS di production |
| **Webhook Security** | Verify Midtrans signature di webhook (sudah diimplementasi) |
| **SQL Injection** | Terproteksi oleh Strapi ORM/query builder |
| **Session Management** | JWT token di session cookie, HttpOnly |
| **Environment Secrets** | Jangan commit .env file ke repository |

---

## 17. CATATAN ARSITEKTURAL & POTENSI PENGEMBANGAN

### 17.1 Arsitektur Saat Ini

**Kekuatan:**
- Next.js App Router untuk SSR/CSR hybrid yang optimal untuk SEO
- Zustand untuk client state yang lightweight + persisted ke sessionStorage
- React Query untuk server state caching dan auto-refetch
- Strapi 5 sebagai headless CMS yang fleksibel
- Dual transaction system memungkinkan migrasi bertahap
- Rich feature set (QR, PDF, email, payment)

**Catatan:**
- `transaction-ticket` dan `transaction` memiliki overlap — ini adalah interim state selama migrasi dari sistem legacy ke unified transaction system
- Beberapa komponen cukup besar (dataContent.tsx: 626 baris, ProductContent.tsx: 639 baris) — bisa dipecah lebih lanjut
- Cart store menyimpan data ke sessionStorage yang berarti hilang saat tab ditutup — desain ini disengaja untuk mencegah stale data

### 17.2 Potensi Pengembangan

| Area | Deskripsi |
|------|-----------|
| **Unified Transaction** | Selesaikan migrasi ke single transaction system |
| **Admin Dashboard** | Kembangkan admin panel di luar Strapi CMS |
| **Mobile App** | API sudah siap untuk dikonsumsi oleh mobile app |
| **Real-time Updates** | WebSocket untuk notifikasi real-time pesanan baru |
| **Analytics** | Integrasi Google Analytics atau custom analytics |
| **Multi-language** | Siapkan i18n untuk internasionalisasi |
| **Performance** | Implement ISR (Incremental Static Regeneration) untuk halaman publik |
| **Testing** | Tambahkan unit tests & integration tests (saat ini belum ada) |
| **CI/CD Pipeline** | Automated testing & deployment |
| **Monitoring** | Error tracking (Sentry) & performance monitoring |
| **Search** | Elasticsearch atau Algolia untuk product search |

---

> **Dokumentasi ini disusun berdasarkan analisis kode sumber Celeparty per Juni 2026.**  
> *Celeparty — Marketplace Event Platform*
