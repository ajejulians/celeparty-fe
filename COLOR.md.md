---
name: Celeparty
colors:
  surface: '#fdf7ff'
  surface-dim: '#ddd8e1'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f2fa'
  surface-container: '#f1ecf5'
  surface-container-high: '#ece6ef'
  surface-container-highest: '#e6e1e9'
  on-surface: '#1c1b21'
  on-surface-variant: '#484551'
  inverse-surface: '#312f36'
  inverse-on-surface: '#f4eff7'
  outline: '#797582'
  outline-variant: '#cac4d3'
  surface-tint: '#6450aa'
  primary: '#280a6c'
  on-primary: '#ffffff'
  primary-container: '#3e2882'
  on-primary-container: '#aa95f5'
  inverse-primary: '#ccbdff'
  secondary: '#606200'
  on-secondary: '#ffffff'
  secondary-container: '#e6eb30'
  on-secondary-container: '#666800'
  tertiary: '#3a1d00'
  on-tertiary: '#ffffff'
  tertiary-container: '#583000'
  on-tertiary-container: '#ec8d1a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e7deff'
  primary-fixed-dim: '#ccbdff'
  on-primary-fixed: '#1f005f'
  on-primary-fixed-variant: '#4c3790'
  secondary-fixed: '#e6eb30'
  secondary-fixed-dim: '#c9ce00'
  on-secondary-fixed: '#1c1d00'
  on-secondary-fixed-variant: '#484a00'
  tertiary-fixed: '#ffdcc0'
  tertiary-fixed-dim: '#ffb875'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6b3b00'
  background: '#fdf7ff'
  on-background: '#1c1b21'
  surface-variant: '#e6e1e9'
  c-red: '#d41f31'
  c-blue-50: '#F0EDF9'
  c-blue-100: '#DDD7F2'
  c-green-50: '#F7FAD0'
  c-red-50: '#FDECEA'
  status-pending: '#F59E0B'
  status-success: '#10B981'
  status-info: '#3B82F6'
  status-error: '#EF4444'
  status-neutral: '#6B7280'
typography:
  page-title:
    fontFamily: Quicksand
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 36px
  section-title:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  card-title:
    fontFamily: Quicksand
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 28px
  subheading:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  badge:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
  price:
    fontFamily: Quicksand
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  button:
    fontFamily: Quicksand
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  code:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  base: 16px
  lg: 24px
  xl: 32px
  section-mobile: 40px
  section-desktop: 48px
---

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

---

*Celeparty Design System v1.0*
