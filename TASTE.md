# Command Code Taste Profile — Celeparty Frontend

This file contains the learned code preferences, design constraints, and engineering patterns for the Celeparty Frontend project. It acts as the core guide for the AI agent (Command Code) to maintain visual, architectural, and behavioral consistency across the codebase.

---

## Metadata
- Project: Celeparty Frontend
- Stack: Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Radix UI
- Version: 1.0
- Validation Status: Ready

---

## 1. Identity & Core Principles
### [Learning] Clarity Over Cleverness
- Description: Transaksi event melibatkan uang dan tanggal — dua hal yang tidak boleh ambigu. Setiap elemen harus jelas tujuannya. Jika sebuah tombol butuh tooltip untuk dipahami, desainnya salah.
- Confidence: 1.0
- Context: Global UI/UX

### [Learning] Hierarchy That Earns Its Place
- Description: Terapkan hierarki visual yang jujur — besar dan kontras untuk yang penting (harga, tanggal event), kecil dan redup untuk yang sekunder. Harga lebih penting dari deskripsi. Tanggal event lebih penting dari nama vendor.
- Confidence: 1.0
- Context: Global UI/UX

### [Learning] Mobile-First Layouts
- Description: Semua komponen harus didesain mulai dari mobile viewport (375px) kemudian di-expand ke desktop (1280px). Touch targets di mobile harus selalu ≥ 44x44px.
- Confidence: 1.0
- Context: Global Responsive Design

---

## 2. Design Tokens & Styling Preferences
### [Learning] Color Token Constraints
- Description: Selalu gunakan brand tokens dari `tailwind.config.ts`. Dilarang keras menggunakan warna hex arbitrary (hardcoded) seperti `bg-[#3E2882]` di dalam komponen UI.
- Confidence: 1.0
- Tokens:
  - Primary: `c-blue` (#3E2882) — digunakan untuk header/navbar background, tombol primary, active nav state, link penting.
  - Accent / CTA: `c-green` (#CBD002) — digunakan untuk tombol "Beli Sekarang", "Checkout", "Bayar", dan status "Tersedia".
  - Secondary Accent: `c-orange` (#DA7E01) — digunakan untuk harga promo/diskon dan badge "Escrow".
  - Danger: `c-red` (#d41f31) — digunakan untuk pesan error, validasi form gagal, tombol "Hapus"/"Tolak".
- Context: Tailwind Colors

### [Learning] Green Token Text Contrast Rule
- Description: Brand token `c-green` (#CBD002) memiliki kontras rendah dengan teks putih. Selalu pasangkan `c-green` dengan teks gelap/hitam (`text-neutral-900`). **JANGAN PERNAH** menggunakan `text-white` di atas background `c-green`.
- Confidence: 1.0
- Context: Accessibility & Contrast

### [Learning] Typography Family Mapping
- Description: Patuhi pemetaan font berikut secara ketat:
  - Gunakan `font-quick` (Quicksand) untuk semua heading, judul, harga, tombol, dan menu navigasi.
  - Gunakan `font-sans` (Inter) untuk semua body text, deskripsi, paragraf, label form, dan data tabel.
  - Gunakan `font-mono` (JetBrains Mono) untuk kode tiket (`CTix-...`), nomor identitas, dan barcode string.
- Confidence: 1.0
- Context: Typography

### [Learning] Font Size Constraints
- Description: Batas font size minimum untuk konten yang dibaca adalah `text-sm` (14px) dan input field adalah 16px (mencegah auto-zoom di iOS safari). Penggunaan `text-xs` (12px) hanya diperbolehkan untuk caption, footnote, helper text, dan status badge.
- Confidence: 1.0
- Context: Typography Accessibility

### [Learning] Spacing Scale Preferences
- Description: JANGAN gunakan arbitrary spacing seperti `p-[13px]` atau `mt-[7px]`. Semua padding, margin, dan gap wajib menggunakan skala kelipatan 4px bawaan Tailwind:
  - `p-1` (4px): padding badge, gap ikon-teks kecil.
  - `p-2` (8px): padding chip/badge normal.
  - `p-3` (12px): padding input, button sm.
  - `p-4` (16px): padding card default, section padding kecil.
  - `p-5` (20px): gap antar field dalam form.
  - `p-6` (24px): padding card besar, section padding desktop mobile.
- Confidence: 1.0
- Context: Layout Spacing

---

## 3. Component Architecture & Patterns
### [Learning] Status Badge Pattern
- Description: JANGAN membuat status badge inline menggunakan style lokal atau border/color kustom. Selalu gunakan komponen terpusat `<StatusBadge status="..." />` yang dikonfigurasi menggunakan `STATUS_CONFIG` terpadu.
- Confidence: 1.0
- Valid States:
  - Payment: `pending`, `pending_dp`, `settlement`, `failed`, `cancelled`, `expired`
  - Vendor: `approved`, `rejected`
  - Escrow: `dp_pending`, `dp_paid`, `fully_paid`, `dp_refunded`
  - Ticket/Product: `active`, `used`, `invalid`, `sold_out`, `escrow_badge`
- Context: Reusable Components

### [Learning] Semantic Status Colors Mapping
- Description: Implementasi warna status harus mengikuti standar berikut:
  - Pending / Menunggu → Amber/Kuning (`bg-amber-50 text-amber-700 border-amber-200`)
  - Settlement / Lunas → Emerald/Hijau (`bg-emerald-50 text-emerald-700 border-emerald-200`)
  - Approved / Aktif → Biru (`bg-blue-50 text-blue-700 border-blue-200`)
  - Failed / Ditolak → Merah (`bg-red-50 text-red-700 border-red-200`)
  - Cancelled / Expired → Abu-abu (`bg-neutral-100 text-neutral-600 border-neutral-200`)
  - Escrow DP Paid → Ungu Muda (`bg-c-blue-50 text-c-blue border-c-blue-100`)
- Confidence: 1.0
- Context: Semantic Badges

### [Learning] Feedback State Mandate (Skeleton, Error, Empty)
- Description: Setiap halaman atau komponen yang melakukan fetch data ke API wajib memiliki penanganan 3 status feedback:
  - Loading State: Gunakan skeleton card/row shimmer, JANGAN menggunakan global fullscreen spinner.
  - Error State: Gunakan komponen `<ErrorState />` yang menampilkan deskripsi error dalam Bahasa Indonesia dan tombol retry yang dapat diklik untuk memicu refetch.
  - Empty State: Gunakan komponen `<EmptyState />` yang informatif dengan ikon/emoji, deskripsi tindakan berikutnya, dan tombol CTA alternatif jika relevan.
- Confidence: 1.0
- Context: Data Fetching UI

---

## 4. Forms, Validation & Tables
### [Learning] Form Validation UX Preferences
- Description: Selalu gunakan React Hook Form + Zod untuk skema form panjang. Konfigurasikan mode validasi pada `onBlur` (validasi dipicu saat pengguna berpindah field, bukan `onChange` yang mengganggu saat mengetik). Pastikan pesan error merah berukuran `text-xs` muncul tepat di bawah input field yang bermasalah.
- Confidence: 1.0
- Context: Forms

### [Learning] Form Layout Structure
- Description: Label form harus selalu berada di atas input field secara visual, bukan hanya mengandalkan placeholder. Tandai field wajib diisi menggunakan tanda bintang merah `*` di sebelah kanan label text. Saat form dalam kondisi submit (`isSubmitting`), tombol submit harus dinonaktifkan (`disabled`) dan menampilkan loading spinner kecil di dalam tombol tanpa mengunci elemen input form lain.
- Confidence: 1.0
- Context: Forms

### [Learning] Responsive Data Table Layout
- Description: Semua data table (terutama untuk order vendor dan manajemen tiket) wajib dibungkus dengan container responsive horizontal scroll (`overflow-x-auto`) dan memiliki batas `min-w-[640px]` untuk mencegah kepandakan kolom di mobile screen viewports. Terapkan zebra striping ringan (`bg-white` bergantian dengan `bg-neutral-50/50`) dan efek hover pada row.
- Confidence: 1.0
- Context: Tables

---

## 5. Copywriting & Data Formatting Standards
### [Learning] Voice and Language Constraints
- Description: Selalu tulis teks antarmuka (copywriting), label, toast notification, dan pesan error menggunakan Bahasa Indonesia yang ramah, jelas, profesional, dan actionable. Istilah Bahasa Inggris hanya boleh digunakan untuk kata teknis yang sudah umum di industri marketplace (seperti checkout, vendor, e-ticket, wallet). Gunakan kata kerja spesifik pada tombol aksi (contoh: "Unduh Invoice" bukan "Download"; "Simpan Perubahan" bukan "Update").
- Confidence: 1.0
- Context: Copywriting

### [Learning] Data Formatting Strict Functions
- Description: Format data di UI harus seragam menggunakan fungsi utility yang konsisten:
  - Currency/Harga: Selalu gunakan awalan `Rp ` dan pemisah ribuan berupa titik. Contoh: `Rp 1.500.000` (bukan Rp1500000 atau IDR 1,500,000).
  - Tanggal: Selalu format nama bulan secara penuh dalam Bahasa Indonesia. Contoh: `12 Agustus 2026`.
  - Waktu: Gunakan format jam 24 jam dengan zona waktu. Contoh: `12 Agustus 2026, 14:30 WIB`.
  - Barcode String: Berikan spasi setiap 4 karakter untuk mempermudah pembacaan manual. Contoh: `1234 5678 9012 AB7`.
- Confidence: 1.0
- Context: Formatting Utilities

---

## 6. Anti-Patterns & Code Safeguards (Strict Enforcement)
### [Anti-Pattern] Hardcoded Styling Avoidance
- Description: Dilarang keras menulis string hex warna atau spacing arbitrary sewenang-wenang di class name components. Jika warna baru atau ukuran kustom dibutuhkan, wajib ditambahkan ke `tailwind.config.ts` terlebih dahulu.
- Confidence: 1.0

### [Anti-Pattern] Form UX Violations
- Description: Dilarang menggunakan fungsi `alert()` atau `confirm()` bawaan browser (native browser prompts). Semua modal interaksi konfirmasi atau peringatan wajib menggunakan Dialog/Modal berbasis Radix UI/shadcn. Jangan pernah mengaktifkan validasi error secara realtime (`onChange`) saat pengguna pertama kali mengetik.
- Confidence: 1.0

### [Anti-Pattern] Animation and Accessibility Failure
- Description: Jangan pernah menggunakan loop animation terus-menerus pada elemen penting yang dapat mengalihkan fokus pengguna. Selalu tambahkan utilitas `motion-reduce:transition-none` dan `motion-reduce:animate-none` untuk menghormati pengguna dengan preferensi reduced-motion sistem.
- Confidence: 1.0
