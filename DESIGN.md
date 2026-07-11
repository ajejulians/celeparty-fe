# CELEPARTY — Design System & Frontend Guidelines

> **Versi:** 1.0  
> **Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Radix UI  
> **Audience:** Frontend developer yang mengerjakan celeparty-fe  

Dokumen ini adalah satu-satunya sumber kebenaran untuk semua keputusan desain dan UI.
Setiap komponen, halaman, dan interaksi harus mengacu ke sini sebelum dikerjakan.

---

## DAFTAR ISI

1. [Identitas & Filosofi Desain](#1-identitas--filosofi-desain)
2. [Design Tokens](#2-design-tokens)
3. [Tipografi](#3-tipografi)
4. [Sistem Warna](#4-sistem-warna)
5. [Sistem Spacing & Sizing](#5-sistem-spacing--sizing)
6. [Komponen Dasar](#6-komponen-dasar)
7. [Pola Feedback (Loading, Error, Empty)](#7-pola-feedback-loading-error-empty)
8. [Pola Layout per Konteks](#8-pola-layout-per-konteks)
9. [Pola Komponen Kustom](#9-pola-komponen-kustom)
10. [Pola Form & Validasi](#10-pola-form--validasi)
11. [Pola Data Table](#11-pola-data-table)
12. [Pola Navigasi](#12-pola-navigasi)
13. [Interaksi & Animasi](#13-interaksi--animasi)
14. [Penulisan Teks (Copywriting)](#14-penulisan-teks-copywriting)
15. [Aksesibilitas](#15-aksesibilitas)
16. [Responsive Breakpoints](#16-responsive-breakpoints)
17. [Anti-Pattern (Jangan Dilakukan)](#17-anti-pattern-jangan-dilakukan)

---

## 1. IDENTITAS & FILOSOFI DESAIN

### 1.1 Apa Itu Celeparty

Celeparty adalah **marketplace event platform** — tempat customer menemukan
dan membeli jasa/produk untuk keperluan event, sekaligus tempat vendor
mengelola bisnis event mereka. Ada tiga persona yang dilayani secara
bersamaan: **Customer**, **Vendor**, dan **Admin**.

Platform ini bukan toko online generik. Ia hidup di dunia event — perayaan,
pertunjukan, gathering. UI-nya harus mencerminkan itu: **bersemangat tapi
dapat dipercaya**, **festive tapi profesional**.

### 1.2 Tiga Prinsip Desain

**1. Clarity Over Cleverness**  
Transaksi event melibatkan uang dan tanggal — dua hal yang tidak boleh
ambigu. Setiap elemen harus jelas tujuannya. Jika sebuah tombol butuh
tooltip untuk dipahami, desainnya salah.

**2. Hierarchy That Earns Its Place**  
Tidak semua informasi sama pentingnya. Harga lebih penting dari deskripsi.
Tanggal event lebih penting dari nama vendor. Terapkan hierarki visual yang
jujur — besar dan kontras untuk yang penting, kecil dan redup untuk yang
sekunder.

**3. Mobile-First, Always**  
Customer beli tiket dari HP. Vendor scan tiket dengan HP di lapangan.
Desain selalu dimulai dari 375px, kemudian di-expand ke desktop — bukan
sebaliknya.

### 1.3 Karakter Visual

| Dimensi | Pilihan | Alasan |
|---|---|---|
| **Tone warna** | Ungu tua + kuning-hijau | Kontras tinggi, kesan premium event |
| **Shape** | Rounded (radius sedang, 8–12px) | Friendly tapi tidak childish |
| **Density** | Medium | Data kompleks butuh ruang, tapi tidak boleh sesak |
| **Motion** | Subtle + purposeful | Feedback interaksi, bukan dekorasi |
| **Typography** | Quicksand (display) + Inter/system (body) | Quicksand berkarakter, Inter terbaca di semua ukuran |

---

## 2. DESIGN TOKENS

Semua token ini **wajib didefinisikan di `tailwind.config.ts`** dan tidak boleh
ada nilai hardcoded di komponen. Jika butuh warna atau ukuran yang tidak ada
di sini, tambahkan ke config terlebih dahulu — jangan tulis inline.

### 2.1 Konfigurasi Tailwind

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // === BRAND COLORS ===
        'c-blue':   '#3E2882',   // Primary — ungu tua, warna dominan
        'c-green':  '#CBD002',   // Accent — kuning-hijau, CTA utama
        'c-orange': '#DA7E01',   // Secondary accent — warning, harga promo
        'c-red':    '#d41f31',   // Danger — error, hapus, tolak

        // === BRAND TINTS (untuk background ringan) ===
        'c-blue-50':  '#F0EDF9',  // Background highlight, active nav
        'c-blue-100': '#DDD7F2',  // Hover state ringan
        'c-green-50': '#F7FAD0',  // Background success ringan
        'c-red-50':   '#FDECEA',  // Background error ringan

        // === NEUTRALS ===
        'neutral-50':  '#FAFAFA',
        'neutral-100': '#F5F5F5',
        'neutral-200': '#E5E5E5',
        'neutral-300': '#D4D4D4',
        'neutral-400': '#A3A3A3',
        'neutral-500': '#737373',
        'neutral-600': '#525252',
        'neutral-700': '#404040',
        'neutral-800': '#262626',
        'neutral-900': '#171717',

        // === STATUS COLORS (semantic) ===
        'status-pending':    '#F59E0B',  // Amber — menunggu
        'status-success':    '#10B981',  // Emerald — sukses/lunas
        'status-info':       '#3B82F6',  // Blue — informasi/approved
        'status-error':      '#EF4444',  // Red — gagal/ditolak
        'status-neutral':    '#6B7280',  // Gray — cancelled/expired
      },

      fontFamily: {
        'quick': ['Quicksand', 'sans-serif'],  // Display, heading, logo
        'sans':  ['Inter', 'system-ui', 'sans-serif'],  // Body, label, data
        'mono':  ['JetBrains Mono', 'monospace'],  // Kode tiket, barcode
      },

      fontSize: {
        // Mobile-first type scale
        'xs':   ['12px', { lineHeight: '16px' }],
        'sm':   ['14px', { lineHeight: '20px' }],
        'base': ['16px', { lineHeight: '24px' }],
        'lg':   ['18px', { lineHeight: '28px' }],
        'xl':   ['20px', { lineHeight: '28px' }],
        '2xl':  ['24px', { lineHeight: '32px' }],
        '3xl':  ['30px', { lineHeight: '36px' }],
        '4xl':  ['36px', { lineHeight: '40px' }],
      },

      borderRadius: {
        'sm':  '4px',
        'md':  '8px',   // Default untuk card, input
        'lg':  '12px',  // Card produk, modal
        'xl':  '16px',  // Panel besar
        '2xl': '24px',  // Badge besar, pill
        'full': '9999px',  // Badge status, avatar
      },

      boxShadow: {
        'card':   '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px 0 rgba(62,40,130,0.12)',  // Pakai c-blue tint
        'modal':  '0 20px 60px 0 rgba(0,0,0,0.15)',
        'input':  '0 0 0 3px rgba(62,40,130,0.15)',  // Focus ring c-blue
        'scanner-valid':  '0 0 0 4px rgba(16,185,129,0.4)',   // Hijau untuk valid
        'scanner-invalid': '0 0 0 4px rgba(239,68,68,0.4)',  // Merah untuk invalid
      },

      animation: {
        'fade-in':    'fadeIn 200ms ease-out',
        'slide-up':   'slideUp 250ms ease-out',
        'slide-down': 'slideDown 250ms ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'scan-line':  'scanLine 2s linear infinite',  // Untuk scanner UI
      },

      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { from: { opacity: '0', transform: 'translateY(-8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
        scanLine:  { '0%': { top: '0%' }, '100%': { top: '100%' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
```

---

## 3. TIPOGRAFI

### 3.1 Font Loading (di `app/layout.tsx`)

```typescript
import { Quicksand, Inter } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quick',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

// Di <html>: className={`${quicksand.variable} ${inter.variable}`}
```

### 3.2 Hierarki Tipografi

| Peran | Font | Size | Weight | Digunakan Untuk |
|---|---|---|---|---|
| **Page Title** | Quicksand | 30px / 3xl | 700 | Judul halaman utama |
| **Section Title** | Quicksand | 24px / 2xl | 700 | Judul section, card header |
| **Card Title** | Quicksand | 18px / lg | 600 | Nama produk/tiket di card |
| **Subheading** | Quicksand | 16px / base | 600 | Label section sekunder |
| **Body** | Inter | 16px / base | 400 | Deskripsi, paragraf |
| **Body Small** | Inter | 14px / sm | 400 | Meta info, lokasi, tanggal |
| **Label** | Inter | 14px / sm | 500 | Form label, kolom tabel |
| **Caption** | Inter | 12px / xs | 400 | Helper text, footnote |
| **Badge** | Inter | 12px / xs | 600 | Status badge, tag |
| **Price** | Quicksand | 20–24px | 700 | Harga produk — selalu bold |
| **Code/Barcode** | JetBrains Mono | 14–16px | 400 | Kode tiket, barcode string |
| **Button** | Quicksand | 14–16px | 600 | Semua tombol |
| **Nav Item** | Quicksand | 14px / sm | 600 | Menu navigasi |

### 3.3 Aturan Tipografi

```
✅ Gunakan font-quick untuk semua heading, judul, harga, dan tombol
✅ Gunakan font-sans (Inter) untuk semua body text, label, dan data
✅ Gunakan font-mono untuk kode tiket (CTix-...) dan barcode
✅ Minimum font size 14px untuk body, 16px untuk input (hindari zoom di iOS)
✅ Line height 1.5 untuk paragraf panjang
✅ Letter spacing normal untuk body; tracking-wide untuk badge/label uppercase

❌ Jangan gunakan Quicksand untuk paragraf panjang (>2 baris) — kurang readable
❌ Jangan gunakan text-xs (12px) untuk konten utama — hanya untuk caption
❌ Jangan mix dua font di satu kalimat kecuali ada alasan visual yang kuat
```

---

## 4. SISTEM WARNA

### 4.1 Panduan Penggunaan Warna Brand

#### `c-blue` (#3E2882) — Primary / Brand
```
Digunakan untuk:
  ✅ Header/navbar background
  ✅ Tombol primary
  ✅ Active nav state
  ✅ Link text penting
  ✅ Icon primary
  ✅ Border focus
  ✅ Heading halaman penting

Jangan untuk:
  ❌ Background seluruh halaman — terlalu berat
  ❌ Teks kecil di atas background gelap lain
  ❌ Error state (gunakan c-red)
```

#### `c-green` (#CBD002) — Accent / CTA
```
Digunakan untuk:
  ✅ Tombol "Beli Sekarang", "Checkout", "Bayar"
  ✅ Badge "Tersedia", "Aktif"
  ✅ Highlight harga promo
  ✅ Tombol aksi positif utama

Jangan untuk:
  ❌ Teks di atas background putih — kontras buruk untuk teks kecil
  ❌ Error atau warning
  ❌ Elemen dekoratif yang tidak clickable
```

> ⚠️ **Penting:** `c-green` (#CBD002) memiliki kontras rendah dengan teks putih.
> Gunakan **teks hitam (`neutral-900`)** di atas background `c-green`.

#### `c-orange` (#DA7E01) — Secondary Accent
```
Digunakan untuk:
  ✅ Harga promo / diskon
  ✅ Badge "Escrow" / "Terbatas"
  ✅ Warning non-kritis
  ✅ Highlight informasi penting tapi bukan error

Jangan untuk:
  ❌ CTA utama (gunakan c-green)
  ❌ Error (gunakan c-red)
```

#### `c-red` (#d41f31) — Danger
```
Digunakan untuk:
  ✅ Pesan error
  ✅ Tombol "Hapus", "Tolak", "Batalkan"
  ✅ Badge "Rejected", "Failed", "Sold Out"
  ✅ Validasi form gagal

Jangan untuk:
  ❌ Elemen yang tidak berbahaya
  ❌ Dekorasi atau accent non-kritis
```

### 4.2 Semantik Warna Status

Selalu gunakan warna status semantik ini secara konsisten:

```
Pending / Menunggu   → bg-status-pending/10  text-amber-700   border-status-pending/30
                        (Amber/kuning)

Settlement / Lunas   → bg-status-success/10  text-emerald-700  border-status-success/30
                        (Emerald/hijau)

Approved / Aktif     → bg-status-info/10     text-blue-700    border-status-info/30
                        (Biru — vendor approved, tiket aktif)

Failed / Ditolak     → bg-status-error/10    text-red-700     border-status-error/30
                        (Merah)

Cancelled / Expired  → bg-status-neutral/10  text-neutral-600  border-status-neutral/30
                        (Abu-abu)

DP Paid (Escrow)     → bg-c-blue-50          text-c-blue       border-c-blue-100
                        (Ungu muda — state khusus escrow)
```

### 4.3 Kontras Warna — Panduan Cepat

| Teks | Background | Kontras | Status |
|---|---|---|---|
| `neutral-900` | `c-green` (#CBD002) | 7.2:1 | ✅ AA Pass |
| `white` | `c-blue` (#3E2882) | 9.1:1 | ✅ AA Pass |
| `white` | `c-red` (#d41f31) | 5.4:1 | ✅ AA Pass |
| `white` | `c-green` (#CBD002) | 1.4:1 | ❌ FAIL — jangan |
| `white` | `c-orange` (#DA7E01) | 2.9:1 | ❌ FAIL — jangan |

---

## 5. SISTEM SPACING & SIZING

### 5.1 Spacing Scale

Gunakan **kelipatan 4px** dari Tailwind default. Jangan gunakan nilai arbitrary
seperti `p-[13px]` atau `mt-[7px]`.

```
4px  = p-1   → Padding badge, gap ikon-teks dalam satu komponen
8px  = p-2   → Padding komponen kecil (badge, chip)
12px = p-3   → Padding input, button sm
16px = p-4   → Padding card, button default, section padding kecil
20px = p-5   → Gap antar field dalam form
24px = p-6   → Padding card besar, section padding
32px = p-8   → Padding halaman (mobile)
40px = p-10  → Gap antar section (mobile)
48px = p-12  → Gap antar section (desktop)
64px = p-16  → Section padding besar (desktop)
```

### 5.2 Touch Target

```
Minimum touch target: 44×44px (wajib untuk semua interaktif di mobile)
Tombol icon:          44×44px minimum
Tombol text:          min-h-[44px] atau py-3 px-4
Input field:          min-h-[44px] atau h-11
Checkbox/Radio:       24×24px visual, 44×44px hit area
```

### 5.3 Lebar Container

```typescript
// Gunakan className berikut secara konsisten
const containerClass = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";

// Untuk halaman dengan sidebar (vendor dashboard):
const mainContentClass = "max-w-5xl mx-auto px-4 sm:px-6";

// Untuk halaman payment/quotation (centered, narrow):
const narrowContentClass = "max-w-lg mx-auto px-4";

// Untuk halaman checkout:
const checkoutContentClass = "max-w-2xl mx-auto px-4";
```

---

## 6. KOMPONEN DASAR

### 6.1 Button

Ada tiga varian utama. **Jangan buat varian baru** tanpa kebutuhan jelas.

```tsx
// PRIMARY — CTA utama, satu per halaman idealnya
<button className="
  inline-flex items-center justify-center gap-2
  bg-c-green text-neutral-900
  font-quick font-semibold text-sm
  px-6 py-3 rounded-lg
  min-h-[44px]
  transition-all duration-200
  hover:brightness-95 hover:shadow-md
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue
">
  Beli Sekarang
</button>

// SECONDARY — aksi penting kedua
<button className="
  inline-flex items-center justify-center gap-2
  bg-c-blue text-white
  font-quick font-semibold text-sm
  px-6 py-3 rounded-lg min-h-[44px]
  transition-all duration-200
  hover:bg-c-blue/90
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue
">
  Tambah ke Keranjang
</button>

// OUTLINE — aksi sekunder atau tombol cancel
<button className="
  inline-flex items-center justify-center gap-2
  border border-c-blue text-c-blue bg-transparent
  font-quick font-semibold text-sm
  px-6 py-3 rounded-lg min-h-[44px]
  transition-all duration-200
  hover:bg-c-blue-50
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue
">
  Kembali
</button>

// DANGER — hapus, tolak, batalkan
<button className="
  inline-flex items-center justify-center gap-2
  bg-c-red text-white
  font-quick font-semibold text-sm
  px-6 py-3 rounded-lg min-h-[44px]
  transition-all duration-200
  hover:bg-c-red/90
  active:scale-[0.98]
  disabled:opacity-50 disabled:cursor-not-allowed
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-red
">
  Tolak Pesanan
</button>
```

**Ukuran button:**
```
Button SM:  px-4 py-2 text-xs min-h-[36px]   → export, action minor
Button MD:  px-6 py-3 text-sm min-h-[44px]   → DEFAULT, semua CTA normal
Button LG:  px-8 py-4 text-base min-h-[52px] → CTA hero, checkout utama
Button Icon: p-2.5 w-11 h-11                  → icon-only action
```

### 6.2 Input Field

```tsx
// Label + Input + Helper text — selalu gunakan pola ini
<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium font-sans text-neutral-700">
    Nama Lengkap <span className="text-c-red">*</span>
  </label>
  <input
    className="
      w-full px-3 py-2.5 h-11
      border border-neutral-200 rounded-lg
      bg-white text-neutral-900
      font-sans text-base
      transition-all duration-150
      placeholder:text-neutral-400
      hover:border-neutral-300
      focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15
      disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed
      aria-invalid:border-c-red aria-invalid:ring-2 aria-invalid:ring-c-red/15
    "
    placeholder="Masukkan nama lengkap"
  />
  {/* Helper text — gunakan jika ada instruksi tambahan */}
  <p className="text-xs font-sans text-neutral-500">
    Nama sesuai KTP penerima tiket
  </p>
  {/* Error message */}
  <p className="text-xs font-sans text-c-red flex items-center gap-1">
    <span>⚠</span> Nama wajib diisi, minimal 3 karakter
  </p>
</div>
```

### 6.3 Card

```tsx
// Card produk/tiket — base style
<div className="
  bg-white rounded-lg shadow-card
  border border-neutral-100
  overflow-hidden
  transition-all duration-200
  hover:shadow-card-hover hover:-translate-y-0.5
  cursor-pointer
">
  {/* Gambar */}
  <div className="relative aspect-[4/3] bg-neutral-100">
    <Image fill className="object-cover" />
    {/* Badge overlay — Sold Out, Escrow, dll */}
    <div className="absolute top-2 left-2 flex gap-1.5">
      <StatusBadge status="sold_out" />
    </div>
  </div>

  {/* Konten */}
  <div className="p-4">
    <p className="text-xs font-sans text-neutral-500 mb-1">Kategori · Kota</p>
    <h3 className="font-quick font-semibold text-neutral-900 text-base leading-snug line-clamp-2">
      Nama Produk / Event
    </h3>
    <p className="text-xs font-sans text-neutral-500 mt-1.5">
      📅 12 Agustus 2026
    </p>
    <div className="mt-3 flex items-center justify-between">
      <div>
        <p className="text-xs text-neutral-500">Mulai dari</p>
        <p className="font-quick font-bold text-lg text-c-blue">
          Rp 150.000
        </p>
      </div>
      <button className="bg-c-green text-neutral-900 font-quick font-semibold text-sm px-4 py-2 rounded-lg">
        Lihat
      </button>
    </div>
  </div>
</div>
```

### 6.4 Modal / Dialog

Gunakan Radix UI `Dialog` dari shadcn/ui. Tambahkan animasi:

```tsx
// Overlay
<DialogOverlay className="
  fixed inset-0 bg-black/50 backdrop-blur-sm
  data-[state=open]:animate-fade-in
  data-[state=closed]:animate-fade-out
" />

// Content
<DialogContent className="
  fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
  w-full max-w-md bg-white rounded-xl shadow-modal
  p-6 z-50
  data-[state=open]:animate-slide-up
  data-[state=closed]:animate-slide-down
  max-h-[90vh] overflow-y-auto
">
```

### 6.5 Badge Status

**Satu komponen untuk semua status** — jangan buat badge inline:

```tsx
// components/feedback/StatusBadge.tsx

type StatusKey =
  // Payment
  | 'pending' | 'pending_dp' | 'settlement' | 'failed' | 'cancelled' | 'expired'
  // Vendor
  | 'approved' | 'rejected'
  // Escrow
  | 'dp_pending' | 'dp_paid' | 'fully_paid' | 'dp_refunded'
  // Ticket
  | 'active' | 'used' | 'invalid'
  // Product
  | 'sold_out' | 'escrow_badge';

const STATUS_CONFIG: Record<StatusKey, { label: string; className: string }> = {
  // Payment
  pending:      { label: 'Menunggu Bayar',    className: 'bg-amber-50    text-amber-700    border-amber-200' },
  pending_dp:   { label: 'Menunggu DP',       className: 'bg-amber-50    text-amber-700    border-amber-200' },
  settlement:   { label: 'Lunas',             className: 'bg-emerald-50  text-emerald-700  border-emerald-200' },
  failed:       { label: 'Gagal',             className: 'bg-red-50      text-red-700      border-red-200' },
  cancelled:    { label: 'Dibatalkan',        className: 'bg-neutral-100 text-neutral-600  border-neutral-200' },
  expired:      { label: 'Kadaluarsa',        className: 'bg-neutral-100 text-neutral-500  border-neutral-200' },

  // Vendor
  approved:     { label: 'Dikonfirmasi',      className: 'bg-blue-50     text-blue-700     border-blue-200' },
  rejected:     { label: 'Ditolak',           className: 'bg-red-50      text-red-700      border-red-200' },

  // Escrow
  dp_pending:   { label: 'DP Belum Dibayar',  className: 'bg-amber-50    text-amber-700    border-amber-200' },
  dp_paid:      { label: 'DP Diterima',       className: 'bg-c-blue-50   text-c-blue       border-c-blue-100' },
  fully_paid:   { label: 'Lunas Penuh',       className: 'bg-emerald-50  text-emerald-700  border-emerald-200' },
  dp_refunded:  { label: 'DP Direfund',       className: 'bg-orange-50   text-orange-700   border-orange-200' },

  // Ticket
  active:       { label: 'Aktif',             className: 'bg-emerald-50  text-emerald-700  border-emerald-200' },
  used:         { label: 'Sudah Digunakan',   className: 'bg-neutral-100 text-neutral-600  border-neutral-200' },
  invalid:      { label: 'Tidak Valid',       className: 'bg-red-50      text-red-700      border-red-200' },

  // Product
  sold_out:     { label: 'Habis',             className: 'bg-neutral-800 text-white        border-neutral-800' },
  escrow_badge: { label: '🔒 Escrow',         className: 'bg-c-blue-50   text-c-blue       border-c-blue-100' },
};

export function StatusBadge({ status }: { status: StatusKey }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`
      inline-flex items-center
      px-2 py-0.5 rounded-full
      text-xs font-sans font-semibold
      border
      ${config.className}
    `}>
      {config.label}
    </span>
  );
}
```

---

## 7. POLA FEEDBACK (LOADING, ERROR, EMPTY)

Setiap halaman yang fetch data **wajib** menangani tiga state ini. Tidak ada
pengecualian.

### 7.1 Loading Skeleton

```tsx
// components/feedback/ProductCardSkeleton.tsx
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-neutral-100 overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-neutral-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-neutral-200 rounded w-1/3" />
        <div className="h-4 bg-neutral-200 rounded w-4/5" />
        <div className="h-4 bg-neutral-200 rounded w-3/5" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-6 bg-neutral-200 rounded w-1/3" />
          <div className="h-9 bg-neutral-200 rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

// Gunakan dalam grid:
{isLoading && Array.from({ length: 8 }).map((_, i) => (
  <ProductCardSkeleton key={i} />
))}
```

### 7.2 Error State

```tsx
// components/feedback/ErrorState.tsx
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Gagal memuat data',
  message = 'Terjadi kesalahan saat memuat halaman ini.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-c-red-50 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">⚠️</span>
      </div>
      <h3 className="font-quick font-semibold text-neutral-900 text-lg mb-1">{title}</h3>
      <p className="font-sans text-sm text-neutral-500 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2.5 bg-c-blue text-white font-quick font-semibold text-sm rounded-lg hover:bg-c-blue/90 transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}

// Penggunaan:
{isError && (
  <ErrorState
    message="Produk tidak dapat dimuat saat ini."
    onRetry={() => refetch()}
  />
)}
```

### 7.3 Empty State

```tsx
// components/feedback/EmptyState.tsx
interface EmptyStateProps {
  icon: string;        // Emoji atau icon
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">{icon}</span>
      </div>
      <h3 className="font-quick font-semibold text-neutral-900 text-lg mb-1">{title}</h3>
      <p className="font-sans text-sm text-neutral-500 max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-6 py-2.5 bg-c-green text-neutral-900 font-quick font-semibold text-sm rounded-lg hover:brightness-95 transition-all"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// Contoh penggunaan:
<EmptyState
  icon="🎟️"
  title="Belum ada pesanan tiket"
  description="Pesanan tiket dari customer akan muncul di sini setelah pembayaran berhasil."
  action={{ label: 'Lihat Katalog Tiket', onClick: () => router.push('/products') }}
/>
```

### 7.4 Toast Notifications

Gunakan `sonner` atau shadcn `Toast`. Pola pesan:

```typescript
// ✅ Pesan yang jelas dan actionable
toast.success('Pesanan dikonfirmasi. Email notifikasi dikirim ke customer.');
toast.error('Gagal menolak pesanan. Silakan coba lagi.');
toast.info('Tiket dikirim ke 3 penerima. Cek email masing-masing.');

// ❌ Pesan yang ambigu
toast.success('Berhasil!');
toast.error('Error');
toast.info('Done');
```

---

## 8. POLA LAYOUT PER KONTEKS

### 8.1 Public Marketplace (`/products`)

```
DESKTOP (≥1024px):
┌─────────────────────────────────────────────────────┐
│                     NAVBAR                          │
├──────────────┬──────────────────────────────────────┤
│              │  Filter Sort Bar                     │
│  FILTER      │  ─────────────────────────────────── │
│  SIDEBAR     │  [Card] [Card] [Card] [Card]          │
│              │  [Card] [Card] [Card] [Card]          │
│  (240px)     │  [Card] [Card] [Card] [Card]          │
│              │  ─────────────────────────────────── │
│  • Kategori  │                Pagination             │
│  • Wilayah   │                                      │
│  • Harga     │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘

MOBILE (<768px):
┌────────────────────────────────┐
│           NAVBAR               │
├────────────────────────────────┤
│  [Filter] [Sort]  ← pill btns │
├────────────────────────────────┤
│  [Card]         [Card]         │
│  [Card]         [Card]         │
│  [Card]         [Card]         │
│        Pagination              │
└────────────────────────────────┘
```

**Spesifikasi Grid:**
```typescript
// Grid produk
const gridClass = "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4";

// Filter sidebar — hidden di mobile, tampil sebagai bottom sheet
const filterSidebarClass = "hidden lg:block w-60 shrink-0 sticky top-4 self-start";
const filterMobileClass = "lg:hidden"; // Bottom sheet / drawer
```

### 8.2 Detail Produk/Tiket (`/products/[slug]`)

```
DESKTOP:
┌───────────────────────────────────────────────────────┐
│                NAVBAR                                 │
├───────────────────────────┬───────────────────────────┤
│                           │  Nama Produk              │
│    GAMBAR UTAMA           │  Kategori · Lokasi        │
│    (aspect-[4/3])         │  ─────────────────────    │
│                           │  Rp 500.000 / Mulai dari  │
│    [Thumbnail Gallery]    │  ─────────────────────    │
│                           │  Varian:                  │
│                           │  ○ Reguler  ○ VIP         │
│                           │  ─────────────────────    │
│                           │  Qty: [−] 1 [+]           │
│                           │  [BELI SEKARANG]          │
│                           │  [Tambah ke Keranjang]    │
├───────────────────────────┴───────────────────────────┤
│  Deskripsi | Syarat & Ketentuan | Informasi Vendor    │
└───────────────────────────────────────────────────────┘

MOBILE: Stack vertical — gambar → info harga → CTA → detail
CTA di mobile: Fixed bottom bar berisi [Beli] [Keranjang]
```

### 8.3 Checkout Flow

```
Step 1: Keranjang        → /cart
Step 2: Isi Data         → /cart/checkout  (form customer/recipient)
Step 3: Ringkasan        → /cart/order-summary
Step 4: Midtrans Snap    → popup overlay
Step 5: Sukses           → /cart/success

Progress indicator di atas form:
┌─────────────────────────────────────────────────────┐
│  ① Keranjang  →  ② Data Diri  →  ③ Konfirmasi      │
│  [✓ done]        [● active]       [○ next]          │
└─────────────────────────────────────────────────────┘
```

### 8.4 Vendor Dashboard (`/user/vendor/*`)

```
DESKTOP:
┌──────────────────────────────────────────────────────┐
│                    NAVBAR                            │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│  SIDEBAR     │   CONTENT AREA                        │
│              │                                       │
│  • Profil    │   ┌──────────────────────────────┐   │
│  • Produk    │   │   [Stat Card] [Stat Card]    │   │
│  • Tiket     │   └──────────────────────────────┘   │
│  • Pesanan   │                                       │
│  • Wallet    │   [Data Table]                        │
│              │                                       │
│  (220px)     │                                       │
└──────────────┴───────────────────────────────────────┘

MOBILE:
- Sidebar → bottom navigation (5 tab max)
- Content area → full width
- Tabel → horizontal scroll dengan kolom yang bisa sembunyi
```

**Bottom nav mobile untuk vendor:**
```tsx
const vendorNavItems = [
  { href: '/user/vendor/profile',  icon: '👤', label: 'Profil' },
  { href: '/user/vendor/products', icon: '📦', label: 'Produk' },
  { href: '/user/vendor/tickets',  icon: '🎟️', label: 'Tiket' },
  { href: '/user/vendor/orders',   icon: '📋', label: 'Pesanan' },
  { href: '/user/vendor/wallet',   icon: '💰', label: 'Wallet' },
];
```

### 8.5 Halaman Payment Publik (`/pay/[code]`)

Layout minimal — user datang dari link email, mungkin pertama kali ke Celeparty:

```
┌───────────────────────────────┐
│   Logo Celeparty              │
│   (centered, prominent)       │
├───────────────────────────────┤
│   🎉 Penawaran untuk Anda     │
│                               │
│   ┌─────────────────────────┐ │
│   │  Nama Produk            │ │
│   │  Rp 2.500.000           │ │  ← Card putih dengan shadow
│   │  Berlaku hingga: ...    │ │
│   └─────────────────────────┘ │
│                               │
│   [BAYAR SEKARANG]            │  ← CTA besar, c-green
│                               │
│   🔒 Dibayar via Midtrans     │  ← Trust signal
└───────────────────────────────┘
```

---

## 9. POLA KOMPONEN KUSTOM

### 9.1 Escrow Breakdown

Komponen ini muncul di halaman detail produk escrow dan ringkasan checkout.

```tsx
// components/payment/EscrowBreakdown.tsx
interface EscrowBreakdownProps {
  totalPrice: number;
  compact?: boolean; // true = versi kecil untuk card, false = versi penuh
}

export function EscrowBreakdown({ totalPrice, compact }: EscrowBreakdownProps) {
  const dp = Math.ceil(totalPrice * 0.3);
  const remaining = Math.floor(totalPrice * 0.7);

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1.5 bg-c-blue-50 text-c-blue text-xs font-sans font-medium px-2.5 py-1 rounded-full border border-c-blue-100">
        🔒 Escrow — DP {formatCurrency(dp)}
      </div>
    );
  }

  return (
    <div className="bg-c-blue-50 border border-c-blue-100 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span>🔒</span>
        <h4 className="font-quick font-semibold text-c-blue text-sm">
          Sistem Pembayaran Escrow
        </h4>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-sans text-neutral-600">Bayar sekarang (DP 30%)</span>
          <span className="font-quick font-bold text-c-blue">{formatCurrency(dp)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-sans text-neutral-400">Pelunasan H-1 sebelum loading (70%)</span>
          <span className="font-sans text-neutral-400 text-sm">{formatCurrency(remaining)}</span>
        </div>
        <div className="pt-2 border-t border-c-blue-100 flex justify-between items-center">
          <span className="text-sm font-sans font-medium text-neutral-700">Total</span>
          <span className="font-quick font-bold text-neutral-900">{formatCurrency(totalPrice)}</span>
        </div>
      </div>
      <p className="mt-3 text-xs font-sans text-neutral-500">
        Pelunasan akan ditagihkan via email H-1 sebelum tanggal loading.
      </p>
    </div>
  );
}
```

### 9.2 Recipient Form (Form Penerima Tiket)

Muncul di cart checkout untuk setiap quantity tiket yang dibeli.

```tsx
// components/ticket/RecipientForm.tsx
// Dirender N kali sesuai quantity tiket

interface RecipientFormProps {
  index: number;          // 1-based untuk display ("Penerima ke-1")
  onChange: (data: Recipient) => void;
  value: Partial<Recipient>;
  errors: FieldErrors<Recipient>;
}

export function RecipientForm({ index, onChange, value, errors }: RecipientFormProps) {
  return (
    <div className="border border-neutral-200 rounded-xl p-4 space-y-4">
      {/* Header dengan nomor */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-c-blue flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-quick font-bold">{index}</span>
        </div>
        <h4 className="font-quick font-semibold text-neutral-900 text-sm">
          Penerima ke-{index}
        </h4>
      </div>

      {/* Field-field form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <FormField label="Nama Lengkap" required error={errors.recipient_name?.message}>
          <Input placeholder="Sesuai identitas" />
        </FormField>
        <FormField label="Email" required error={errors.recipient_email?.message}>
          <Input type="email" placeholder="email@contoh.com" />
        </FormField>
        <FormField label="No. WhatsApp" required error={errors.whatsapp_number?.message}>
          <Input placeholder="08xxxxxxxxxx" />
        </FormField>
        <FormField label="Jenis Identitas" required error={errors.identity_type?.message}>
          <Select options={['KTP', 'SIM', 'Lainnya']} />
        </FormField>
        <FormField
          label="Nomor Identitas"
          required
          error={errors.identity_number?.message}
          className="sm:col-span-2"
        >
          <Input placeholder="Nomor KTP / SIM" />
        </FormField>
      </div>
    </div>
  );
}
```

### 9.3 Ticket Scanner UI

Komponen paling unik di Celeparty — prioritaskan clarity dan speed.

```tsx
// Tampilan hasil verifikasi — besar dan jelas

// ✅ VALID
<div className="
  rounded-2xl p-6 text-center
  bg-emerald-50 border-2 border-emerald-400
  shadow-scanner-valid
  animate-fade-in
">
  <div className="text-6xl mb-2">✅</div>
  <h2 className="font-quick font-bold text-2xl text-emerald-700 mb-1">VALID</h2>
  <p className="font-sans font-semibold text-neutral-900">{ticketHolder.recipient_name}</p>
  <p className="font-sans text-sm text-neutral-600">{ticketHolder.variant} · {ticketHolder.event}</p>
  <p className="font-mono text-xs text-neutral-400 mt-2">{ticketHolder.ticket_code}</p>
</div>

// ⚠️ ALREADY USED
<div className="
  rounded-2xl p-6 text-center
  bg-amber-50 border-2 border-amber-400
  animate-fade-in
">
  <div className="text-6xl mb-2">⚠️</div>
  <h2 className="font-quick font-bold text-2xl text-amber-700 mb-1">SUDAH DIPAKAI</h2>
  <p className="font-sans text-sm text-neutral-600">
    Digunakan pada: {formatDateTime(usedAt)}
  </p>
</div>

// ❌ NOT VALID / NOT FOUND
<div className="
  rounded-2xl p-6 text-center
  bg-red-50 border-2 border-red-400
  shadow-scanner-invalid
  animate-fade-in
">
  <div className="text-6xl mb-2">❌</div>
  <h2 className="font-quick font-bold text-2xl text-red-700 mb-1">TIDAK VALID</h2>
  <p className="font-sans text-sm text-neutral-500">Tiket tidak ditemukan di sistem</p>
</div>
```

**Tampilan input USB Scanner:**
```tsx
// Area scan USB — harus terlihat "siap menerima input"
<div className={`
  relative p-8 rounded-2xl border-2 border-dashed
  transition-all duration-300
  ${isFocused ? 'border-c-blue bg-c-blue-50' : 'border-neutral-300 bg-neutral-50'}
`}>
  {/* Animated scan indicator */}
  <div className={`
    absolute left-0 right-0 h-0.5 bg-c-blue/40 rounded-full
    ${isFocused ? 'animate-scan-line' : 'hidden'}
  `} />

  <p className="text-center text-sm font-sans text-neutral-500 mb-3">
    {isFocused ? '🟢 Scanner siap — arahkan ke barcode' : '⚪ Klik di sini lalu scan barcode'}
  </p>

  <input
    ref={inputRef}
    className="
      w-full text-center text-2xl font-mono font-semibold
      tracking-[0.3em] bg-transparent border-none outline-none
      caret-c-blue text-neutral-900
      placeholder:text-neutral-300
    "
    placeholder="· · · · · · · · · · · · ·"
    onFocus={() => setIsFocused(true)}
    onBlur={() => setIsFocused(false)}
  />
</div>
```

### 9.4 Vendor Action Buttons (Approve / Reject)

```tsx
// Tampil hanya jika vendor_status === 'pending'
{order.vendor_status === 'pending' && (
  <div className="flex gap-2 flex-wrap">
    <button
      onClick={() => handleApprove(order.id)}
      disabled={isPending}
      className="
        flex items-center gap-2
        bg-emerald-600 hover:bg-emerald-700 text-white
        font-quick font-semibold text-sm
        px-4 py-2.5 rounded-lg min-h-[44px]
        transition-colors disabled:opacity-50
      "
    >
      <span>✓</span> Terima Pesanan
    </button>
    <button
      onClick={() => setShowRejectModal(true)}
      disabled={isPending}
      className="
        flex items-center gap-2
        border border-c-red text-c-red bg-white hover:bg-c-red-50
        font-quick font-semibold text-sm
        px-4 py-2.5 rounded-lg min-h-[44px]
        transition-colors disabled:opacity-50
      "
    >
      <span>✗</span> Tolak Pesanan
    </button>
  </div>
)}

// Modal reject — wajib ada field alasan penolakan
<Dialog open={showRejectModal}>
  <DialogContent>
    <h3 className="font-quick font-bold text-lg text-neutral-900">Tolak Pesanan</h3>
    <p className="text-sm font-sans text-neutral-500">
      Masukkan alasan penolakan. Alasan ini akan dikirimkan ke customer via email.
    </p>
    <textarea
      className="w-full h-32 p-3 border border-neutral-200 rounded-lg text-sm font-sans resize-none focus:outline-none focus:border-c-blue"
      placeholder="Contoh: Stok tidak tersedia untuk tanggal yang diminta..."
    />
    <div className="flex gap-2 justify-end mt-2">
      <button onClick={() => setShowRejectModal(false)} className="...outline button...">
        Batal
      </button>
      <button onClick={handleReject} className="...danger button...">
        Tolak Pesanan
      </button>
    </div>
  </DialogContent>
</Dialog>
```

---

## 10. POLA FORM & VALIDASI

### 10.1 Aturan Umum Form

```
✅ Validasi: gunakan mode: 'onBlur' — validasi saat user pindah field
✅ Error message: muncul di bawah field yang bermasalah, teks merah xs
✅ Label: selalu di atas field, bukan placeholder-only
✅ Required: tandai dengan * merah di sebelah label
✅ Helper text: gunakan untuk instruksi tambahan (bukan error)
✅ Submit button: disable saat form submitting, tampilkan loading spinner
✅ Success: navigasi atau tampilkan toast — jangan biarkan user bingung

❌ Jangan validasi saat user masih mengetik (onChange) — mengganggu
❌ Jangan hilangkan field error saat user mulai ketik ulang
❌ Jangan gunakan alert() atau confirm() browser native
❌ Jangan disable seluruh form saat loading — hanya button submit
```

### 10.2 Reusable FormField Wrapper

```tsx
// components/ui/FormField.tsx
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
  children: React.ReactNode;
}

export function FormField({
  label, required, error, helperText, className, children
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-sm font-sans font-medium text-neutral-700">
        {label}
        {required && <span className="text-c-red ml-0.5">*</span>}
      </label>
      {children}
      {helperText && !error && (
        <p className="text-xs font-sans text-neutral-500">{helperText}</p>
      )}
      {error && (
        <p className="text-xs font-sans text-c-red flex items-start gap-1">
          <span className="mt-0.5 shrink-0">⚠</span>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
```

### 10.3 Pattern untuk Form Panjang (Multi-section)

Untuk form produk vendor atau form checkout non-tiket yang panjang:

```tsx
// Pecah menjadi section dengan visual separator
<form>
  {/* Section 1 */}
  <div className="space-y-4">
    <h3 className="font-quick font-semibold text-neutral-900">Informasi Dasar</h3>
    {/* fields */}
  </div>

  <hr className="border-neutral-100 my-6" />

  {/* Section 2 */}
  <div className="space-y-4">
    <h3 className="font-quick font-semibold text-neutral-900">Detail Event</h3>
    {/* fields */}
  </div>

  <hr className="border-neutral-100 my-6" />

  {/* CTA — sticky di mobile */}
  <div className="
    flex gap-3
    sticky bottom-0 bg-white pt-4 pb-safe
    border-t border-neutral-100 mt-6
    lg:static lg:border-none lg:pt-0
  ">
    <button type="button" className="...outline...">Batal</button>
    <button type="submit" disabled={isSubmitting} className="...primary... flex-1">
      {isSubmitting ? (
        <span className="flex items-center gap-2">
          <Spinner size="sm" /> Menyimpan...
        </span>
      ) : 'Simpan Produk'}
    </button>
  </div>
</form>
```

---

## 11. POLA DATA TABLE

### 11.1 Struktur Tabel Vendor Orders

```tsx
// Tabel pesanan — wajib responsive horizontal scroll di mobile
<div className="overflow-x-auto rounded-xl border border-neutral-200">
  <table className="w-full min-w-[640px] border-collapse">
    <thead>
      <tr className="bg-neutral-50 border-b border-neutral-200">
        <th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
          No. Order
        </th>
        {/* ... kolom lain */}
      </tr>
    </thead>
    <tbody>
      {orders.map((order, i) => (
        <tr
          key={order.id}
          className={`
            border-b border-neutral-100 last:border-0
            hover:bg-neutral-50 transition-colors
            ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'}
          `}
        >
          <td className="px-4 py-3 font-mono text-xs text-neutral-600">
            {order.order_id}
          </td>
          {/* ... */}
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

### 11.2 Kolom Wajib per Tabel

**Tabel Pesanan Tiket:**
```
No. Order | Customer | Produk | Varian | Qty | Total | Status Bayar | Tgl Pesanan | Tgl Event | Aksi
```

**Tabel Pesanan Non-Tiket:**
```
No. Order | Customer | Produk | Qty | Total | Status Bayar | Status Vendor | Tgl Loading | Aksi
```

### 11.3 Toolbar Tabel

```tsx
// Di atas setiap tabel: search + filter + export
<div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center justify-between">
  <div className="flex gap-2 flex-wrap">
    {/* Search */}
    <div className="relative">
      <input
        placeholder="Cari nama / no. order..."
        className="pl-9 pr-3 py-2 text-sm border border-neutral-200 rounded-lg w-56 focus:outline-none focus:border-c-blue"
      />
      <span className="absolute left-3 top-2.5 text-neutral-400 text-sm">🔍</span>
    </div>
    {/* Filter status */}
    <select className="text-sm border border-neutral-200 rounded-lg px-3 py-2 focus:outline-none focus:border-c-blue">
      <option value="">Semua Status</option>
      <option value="settlement">Lunas</option>
      <option value="pending">Menunggu</option>
    </select>
  </div>

  {/* Export buttons */}
  <div className="flex gap-2">
    <button className="flex items-center gap-1.5 text-sm font-sans font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-lg px-3 py-2 hover:bg-neutral-50 transition-colors">
      📥 Export CSV
    </button>
    <button className="flex items-center gap-1.5 text-sm font-sans font-medium text-neutral-600 hover:text-neutral-900 border border-neutral-200 rounded-lg px-3 py-2 hover:bg-neutral-50 transition-colors">
      📊 Export XLSX
    </button>
  </div>
</div>
```

---

## 12. POLA NAVIGASI

### 12.1 Navbar Utama (Public)

```
[Logo Celeparty]                         [Login] [Daftar]
```
- Background: `bg-c-blue`
- Teks & ikon: `text-white`
- Scroll: `shadow-md` muncul setelah scroll 50px
- Mobile: hamburger → drawer dari kiri

### 12.2 Navbar Authenticated

```
[Logo]   [Produk] [Tentang]     [🔔 3] [Avatar ▼]
                                         ↳ Dropdown: Profil | Pesanan | Logout
```

### 12.3 Sidebar Vendor (Desktop)

```tsx
const VENDOR_NAV = [
  { href: '/user/vendor/profile',  icon: '👤', label: 'Profil Toko' },
  { href: '/user/vendor/products', icon: '📦', label: 'Produk & Jasa' },
  { href: '/user/vendor/tickets',  icon: '🎟️', label: 'Tiket Event' },
  { href: '/user/vendor/orders',   icon: '📋', label: 'Pesanan Masuk' },
  { href: '/user/vendor/wallet',   icon: '💰', label: 'Wallet & Saldo' },
];

// Active state:
const activeClass  = "bg-c-blue-50 text-c-blue font-semibold";
const inactiveClass = "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900";
```

---

## 13. INTERAKSI & ANIMASI

### 13.1 Prinsip Animasi

```
GUNAKAN untuk:
✅ Feedback state change (tombol click, form submit, scan result)
✅ Page transition (fade masuk halaman baru)
✅ Modal open/close (slide up / fade)
✅ Toast notification (slide in)
✅ Skeleton shimmer (loading state)
✅ Scanner result (muncul dengan animasi)

JANGAN gunakan untuk:
❌ Dekorasi murni tanpa fungsi
❌ Animasi yang delay interaksi > 200ms
❌ Loop animation terus-menerus pada elemen penting
❌ Animasi kompleks yang tidak ada di preferensi reduced-motion
```

### 13.2 Durasi & Easing

```typescript
// Gunakan nilai ini konsisten — jangan buat timing baru
const TRANSITIONS = {
  instant:  '100ms',  // Hover color change
  fast:     '150ms',  // Button press, badge show
  normal:   '200ms',  // Fade in, most transitions
  medium:   '250ms',  // Modal, drawer
  slow:     '350ms',  // Page transition
} as const;

const EASINGS = {
  default: 'ease-out',    // Sebagian besar transisi
  spring:  'cubic-bezier(0.34, 1.56, 0.64, 1)',  // Bounce untuk feedback positif
  sharp:   'cubic-bezier(0.4, 0, 0.6, 1)',         // Dismiss, close
} as const;
```

### 13.3 Reduced Motion

```tsx
// Wajib direspek — user yang sensitif terhadap gerak
// Gunakan class Tailwind: motion-reduce:transition-none motion-reduce:animate-none

<div className="animate-fade-in motion-reduce:animate-none">
  {/* content */}
</div>
```

### 13.4 Loading States per Konteks

```
Fetch data (list/tabel)  → Skeleton cards/rows — JANGAN spinner penuh halaman
Tombol submit form       → Disable + spinner kecil di dalam tombol
Upload gambar/compress   → Progress bar dengan persentase
Payment Midtrans         → Loading overlay saat membuka Snap popup
Approve/Reject action    → Optimistic update + spinner pada baris tabel
Scanner verifikasi       → Immediate feedback — tidak perlu loading (< 300ms)
```

---

## 14. PENULISAN TEKS (COPYWRITING)

### 14.1 Prinsip Teks Celeparty

**Bahasa:** Indonesia. Tidak ada Inggris kecuali istilah teknis yang sudah
umum (checkout, vendor, e-ticket).

**Tone:** Ramah tapi profesional. Bayangkan karyawan toko yang helpful —
bukan marketing hype, bukan pula birokrasi kaku.

**Voice:**
```
✅ "Pesanan kamu sudah dikonfirmasi vendor. Silakan cek email."
✅ "Tiket berhasil discan — Budi Santoso boleh masuk."
✅ "Link ini sudah kadaluarsa. Hubungi penyelenggara untuk link baru."

❌ "Transaksi Anda telah berhasil diproses oleh sistem kami!"
❌ "Error 404: Resource not found"
❌ "Please wait while we process your request..."
```

### 14.2 Teks untuk State Spesifik

**Empty states:**
```
Belum ada produk      → "Belum ada produk yang ditambahkan. Mulai tambah produk pertamamu."
Belum ada pesanan     → "Pesanan dari customer akan muncul di sini setelah pembayaran berhasil."
Filter tidak ada hasil → "Tidak ada produk yang cocok. Coba ubah filter pencarian."
Tiket habis           → "Semua tiket sudah terjual. Pantau terus untuk restok."
```

**Konfirmasi aksi destruktif:**
```
Hapus produk   → "Hapus produk ini? Tindakan ini tidak bisa dibatalkan."
Tolak pesanan  → "Tolak pesanan ini? Customer akan mendapat notifikasi email beserta alasanmu."
```

**Error:**
```
Koneksi gagal    → "Koneksi terputus. Pastikan internet kamu aktif, lalu coba lagi."
Server error     → "Terjadi kesalahan di server. Coba beberapa saat lagi."
Stok habis       → "Maaf, stok tiket ini baru saja habis. Pilih varian lain."
```

**Label tombol — gunakan verb yang spesifik:**
```
✅ "Konfirmasi Pesanan"  bukan  "Submit"
✅ "Kirim Ulang Tiket"   bukan  "Resend"
✅ "Bayar Sekarang"      bukan  "Continue"
✅ "Unduh Invoice"       bukan  "Download"
✅ "Simpan Perubahan"    bukan  "Update"
```

### 14.3 Format Data

```typescript
// Gunakan fungsi ini KONSISTEN di seluruh aplikasi

// Harga: Rp 1.500.000 (bukan Rp1500000 atau IDR 1,500,000)
formatCurrency(1500000) → "Rp 1.500.000"

// Tanggal: 12 Agustus 2026 (bukan 12/08/2026)
formatDate('2026-08-12') → "12 Agustus 2026"

// Tanggal + waktu: 12 Agustus 2026, 14:30 WIB
formatDateTime('2026-08-12T14:30:00') → "12 Agustus 2026, 14:30 WIB"

// Kode tiket: tampilkan apa adanya, font mono
"CTix-20260812-A8F2E1C9"

// Barcode: tampilkan dengan font mono, spasi setiap 4 karakter untuk readability
"1234 5678 9012 AB7"
```

---

## 15. AKSESIBILITAS

Karena menggunakan Radix UI dan shadcn/ui, banyak aksesibilitas sudah built-in.
Fokus pada hal-hal yang masih perlu dilakukan manual:

### 15.1 Checklist Minimum

```
✅ Semua input punya <label> yang ter-associate (htmlFor atau wrapper)
✅ Error message ter-connect ke input via aria-describedby
✅ Tombol icon-only punya aria-label yang deskriptif
✅ Image non-dekoratif punya alt text yang bermakna
✅ Image dekoratif punya alt="" (empty string)
✅ Focus visible di semua interaktif element (ring-2 ring-c-blue)
✅ Urutan tab yang logis — tidak melompat-lompat
✅ Warna tidak satu-satunya pembeda informasi penting
✅ Heading hierarchy H1 → H2 → H3 (tidak loncat dari H1 ke H3)
✅ motion-reduce dihormati di semua animasi
```

### 15.2 ARIA untuk Komponen Kustom

```tsx
// Scanner result — announce ke screen reader
<div
  role="alert"
  aria-live="assertive"
  aria-atomic="true"
>
  {/* Konten hasil scan — akan dibacakan otomatis */}
</div>

// Loading state
<div aria-busy="true" aria-label="Memuat daftar produk...">
  <ProductCardSkeleton />
</div>

// Status badge
<span
  role="status"
  aria-label={`Status pesanan: ${statusLabel}`}
>
  <StatusBadge status={status} />
</span>
```

---

## 16. RESPONSIVE BREAKPOINTS

### 16.1 Breakpoint System

```
xs:  < 375px   → Batas minimum — tidak perlu support lebih kecil
sm:  ≥ 640px   → Tablet portrait, HP besar
md:  ≥ 768px   → Tablet landscape
lg:  ≥ 1024px  → Desktop/Laptop
xl:  ≥ 1280px  → Desktop wide
2xl: ≥ 1536px  → Monitor besar
```

### 16.2 Pattern per Breakpoint

```typescript
// Grid produk
"grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4"

// Sidebar — hidden mobile, visible desktop
"hidden lg:flex lg:flex-col lg:w-56 lg:shrink-0"

// Konten utama dengan sidebar
"flex-1 min-w-0"  // min-w-0 mencegah overflow

// Tabel — horizontal scroll mobile
"overflow-x-auto" → table dengan "min-w-[640px]"

// Form grid — 1 kolom mobile, 2 kolom desktop
"grid grid-cols-1 sm:grid-cols-2 gap-4"

// Padding halaman
"px-4 sm:px-6 lg:px-8"

// Bottom CTA sticky mobile
"fixed bottom-0 left-0 right-0 bg-white border-t p-4 lg:static lg:border-none"
```

### 16.3 Testing Wajib

Sebelum PR/commit setiap komponen:

| Viewport | Device | Pengujian |
|---|---|---|
| 375px | iPhone SE | Tidak ada horizontal scroll |
| 414px | iPhone 14 | Touch target cukup besar |
| 768px | iPad Portrait | Layout tidak rusak |
| 1024px | iPad Landscape / Laptop | Sidebar muncul |
| 1280px | Desktop | Full layout |

---

## 17. ANTI-PATTERN (JANGAN DILAKUKAN)

### 17.1 Warna

```
❌ Menulis warna hex langsung di komponen: className="bg-[#3E2882]"
   → Gunakan: className="bg-c-blue"

❌ Teks putih di atas c-green: className="bg-c-green text-white"
   → Gunakan: className="bg-c-green text-neutral-900"

❌ Membuat warna baru tanpa tambah ke tailwind.config
   → Selalu tambah ke config dulu

❌ Gunakan warna status sembarangan (merah untuk pending, hijau untuk rejected)
   → Ikuti STATUS_CONFIG di StatusBadge
```

### 17.2 Tipografi

```
❌ Font size di bawah 14px untuk konten yang dibaca: className="text-[11px]"
   → Minimum text-xs (12px) hanya untuk caption/footnote

❌ Quicksand untuk paragraf panjang
   → Quicksand: heading, harga, tombol, nav saja

❌ Tidak memakai font-mono untuk kode tiket/barcode
   → Selalu font-mono untuk kode "CTix-..." dan barcode numerik
```

### 17.3 Spacing

```
❌ Arbitrary spacing: className="mt-[13px] pb-[7px]"
   → Gunakan kelipatan 4: mt-3 (12px) atau mt-4 (16px)

❌ Touch target terlalu kecil: tombol 32px tinggi
   → Minimum min-h-[44px] untuk semua interaktif di mobile
```

### 17.4 State Handling

```
❌ Tidak ada skeleton saat loading: halaman kosong / berkedip
   → Setiap fetch wajib punya skeleton

❌ Tidak ada error state: halaman diam saat API gagal
   → Setiap fetch wajib punya ErrorState dengan tombol retry

❌ Tidak ada empty state: tabel kosong tanpa keterangan
   → Setiap list wajib punya EmptyState yang informatif

❌ Langsung navigate setelah submit tanpa feedback
   → Selalu tampilkan toast sukses sebelum/sesudah navigate
```

### 17.5 Form

```
❌ Validasi onChange yang langsung menampilkan error saat mengetik
   → Gunakan mode: 'onBlur'

❌ Alert() atau confirm() native browser
   → Gunakan Dialog/Modal dari shadcn/ui

❌ Form submit tanpa loading state pada tombol
   → Disable + spinner saat isSubmitting

❌ Placeholder sebagai satu-satunya label
   → Selalu ada <label> yang terlihat di atas input
```

### 17.6 Komponen

```
❌ Membuat badge status baru inline: className="bg-green-100 text-green-700"
   → Selalu gunakan <StatusBadge status="..." />

❌ Hardcode teks status dalam komponen
   → Status label ada di STATUS_CONFIG, bukan tersebar di mana-mana

❌ Duplikasi komponen yang sudah ada
   → Cek components/ terlebih dahulu sebelum membuat baru
```

---

## QUICK REFERENCE

### Checklist Sebelum Commit Komponen Baru

```
□ Tidak ada warna hardcoded — semua dari design tokens
□ Font: Quicksand untuk heading/harga/tombol, Inter untuk body/label
□ Touch target ≥ 44px di semua interaktif
□ Loading skeleton tersedia
□ Error state dengan tombol retry tersedia
□ Empty state (jika komponen menampilkan list)
□ Responsif di 375px dan 1280px
□ StatusBadge digunakan (bukan inline badge)
□ Teks error/label dalam Bahasa Indonesia
□ Focus visible ring tersedia
□ motion-reduce dihormati (jika ada animasi)
□ Tidak ada TypeScript error atau any yang tidak disengaja
```

### Cheatsheet Warna

| Kegunaan | Class |
|---|---|
| Primary button | `bg-c-blue text-white` |
| CTA / Beli | `bg-c-green text-neutral-900` |
| Danger / Tolak | `bg-c-red text-white` |
| Warning / Highlight | `bg-c-orange text-white` |
| Background highlight | `bg-c-blue-50` |
| Border aktif | `border-c-blue` |
| Focus ring | `ring-c-blue` |

### Cheatsheet Status Badge

| Kondisi | `<StatusBadge status="..."/>` |
|---|---|
| Menunggu pembayaran | `pending` |
| Menunggu DP | `pending_dp` |
| Sudah lunas | `settlement` |
| Pembayaran gagal | `failed` |
| Dibatalkan | `cancelled` |
| Dikonfirmasi vendor | `approved` |
| Ditolak vendor | `rejected` |
| DP diterima | `dp_paid` |
| Lunas penuh (escrow) | `fully_paid` |
| Tiket aktif | `active` |
| Tiket sudah dipakai | `used` |
| Tiket habis | `sold_out` |

---

*Celeparty Design System v1.0 — Diperbarui sesuai perkembangan proyek*  
*Setiap perubahan design system wajib diupdate di dokumen ini sebelum diimplementasi*
