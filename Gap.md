# Celeparty — Gap Analysis Report

**Tanggal:** 2026-07-11
**Versi:** 1.0

---

## Ringkasan

**Celeparty** adalah marketplace event platform (frontend only) dengan Next.js 16, TypeScript, Tailwind CSS v4, dan shadcn/ui. Menggunakan mock data — belum ada backend.

| Kategori | Jumlah |
|---|---|
| Bug Kritis | 5 |
| Bug Moderat | 12 |
| Bug Low | 8 |
| Deviasi Design System (High) | 3 |
| Deviasi Design System (Medium) | 5 |
| Deviasi Design System (Low) | 2 |
| Masalah Arsitektur | 9 |
| **Total** | **44** |

---

## 1. BUG KRITIS

### 1.1 `params` Type Salah — Next.js 14 Pattern di Next.js 16

- **File:** `app/(public)/products/[slug]/page.tsx:14`, `app/(public)/pay/[code]/page.tsx:11`
- **Masalah:** Menggunakan `params: { slug: string }` — di Next.js 15+, params adalah `Promise`. `params.slug` akan `undefined`.
- **Dampak:** Halaman product detail dan payment link **pasti gagal** di Next.js 16.
- **Perbaikan:** Gunakan `params: Promise<{ slug: string }>` + `await params` seperti di `events/[slug]`.

### 1.2 `createPaymentLink` Selalu Return `null`

- **File:** `lib/checkout-data.ts:144-157`
- **Masalah:** Branch `else` (non-escrow) membuat `PaymentLink` dan simpan di Map, tapi **tidak push ke array `links`**. `return links[0] ?? null` selalu `null`.
- **Dampak:** Checkout produk non-escrow tidak pernah menghasilkan payment link.
- **Perbaikan:** Tambahkan `links.push(fullLink)` setelah `mockPaymentLinks.set(fullLink.code, fullLink)` di baris ~156.

### 1.3 VA Number Berubah Setiap Re-render

- **File:** `components/checkout/PaymentSimulator.tsx:39-41`
- **Masalah:** `Math.random()` dipanggil saat render — nomor VA berubah setiap kali component re-render (misal saat `isProcessing` berubah).
- **Dampak:** User melihat nomor VA berubah di tengah transaksi.
- **Perbaikan:** Simpan VA number di `useRef` atau `useState` dengan lazy initializer.

### 1.4 Tanpa Autentikasi/Autorisasi

- **Masalah:** Seluruh route (admin dashboard, vendor wallet, profile) bisa diakses oleh tamu. Tidak ada middleware, session check, atau role guard.
- **Dampak:** Security vulnerability — semua data dan halaman admin/vendor terbuka.
- **Perbaikan:** Implementasi Next.js middleware dengan session validation + role-based route guards.

### 1.5 Data Isolation Vendor Tidak Ada

- **File:** Semua halaman vendor (`/user/vendor/*`)
- **Masalah:** Vendor melihat **SEMUA data platform**, bukan hanya data mereka. `orders`, `products`, `tickets` tidak difilter per vendor.
- **Dampak:** Privacy violation — vendor bisa melihat data vendor lain.
- **Perbaikan:** Filter data berdasarkan vendor ID yang sedang login.

---

## 2. BUG MODERAT

### 2.1 Escrow Remaining Payment Link Tidak Disimpan

- **File:** `lib/checkout-data.ts:135-143`
- **Masalah:** Escrow "remaining" payment link di-push ke array `links` tapi tidak disimpan di `mockPaymentLinks` map. `getPaymentLinkByCode` tidak akan menemukannya.
- **Perbaikan:** Tambahkan `mockPaymentLinks.set(...)` untuk remaining link.

### 2.2 Blog Detail Missing untuk 3 dari 6 Slug

- **File:** `lib/blog-data.ts`
- **Masalah:** `blogList` mendefinisikan 6 slug, tapi `blogDetails` hanya ada untuk 3 slug pertama. 3 slug berikutnya (`fotografi-event-yang-instagrammable`, `checklist-event-pertama`, `lighting-panggung-pemula`) tidak ada data detailnya.
- **Dampak:** Halaman detail blog untuk 3 slug tersebut akan blank atau error.
- **Perbaikan:** Tambahkan data `blogDetails` untuk 3 slug yang missing.

### 2.3 ProgressSteps `currentStep` Hardcoded

- **File:** `components/checkout/CheckoutFormWrapper.tsx:158`
- **Masalah:** `currentStep={0}` tidak pernah berubah meskipun user sudah ke step berikutnya.
- **Perbaikan:** Tambahkan state `currentStep` yang berubah sesuai alur checkout.

### 2.4 `setTimeout` Tidak di-cleanup (PaymentSimulator)

- **File:** `components/checkout/PaymentSimulator.tsx:46-52`
- **Masalah:** `setTimeout` tidak di-cleanup saat component unmount. Jika user navigasi selama proses pembayaran, callback akan fire ke unmounted component.
- **Dampak:** Memory leak dan React console warnings.
- **Perbaikan:** Simpan timeout IDs dan cleanup di `useEffect` return function.

### 2.5 Modal State Persist

- **File:** `components/checkout/PaymentSimulator.tsx:37`
- **Masalah:** Saat modal ditutup (`open=false`), component return `null` tapi React preserve state. Saat dibuka lagi, state lama (selected bank, processing status) masih ada.
- **Perbaikan:** Reset state saat `open` berubah ke `true`.

### 2.6 Navbar Dropdown Tidak Ada Outside-Click-to-Close

- **File:** `components/layout/Navbar.tsx:117-143`
- **Masalah:** Dropdown user menu toggle on click tapi tidak ada `useEffect` atau `onBlur` untuk close saat click di luar.
- **Perbaikan:** Tambahkan `useEffect` dengan `mousedown` event listener untuk detect outside clicks.

### 2.7 Path Matching False Positive

- **File:** `components/layout/ErpSidebar.tsx:68-70`, `components/layout/ErpMobileNav.tsx:21-23`
- **Masalah:** Menggunakan `startsWith` — href `/products` akan match `/products-list`, `/products/123`, dll.
- **Perbaikan:** Tambahkan segment boundary check (cek karakter setelah path adalah `/` atau end-of-string).

### 2.8 OtpInput Tidak Ada Paste Handler

- **File:** `components/auth/OtpInput.tsx`
- **Masalah:** Jika user copy OTP 4 digit dan paste, hanya digit pertama yang masuk ke input pertama. Sisanya hilang.
- **Perbaikan:** Tambahkan `onPaste` handler yang mendistribusikan digit ke semua input fields.

### 2.9 Gambar Produk Tidak Ditampilkan

- **File:** `app/(public)/products/[slug]/page.tsx:64-67`
- **Masalah:** Container gambar hanya berupa colored `<div>` dengan `<StatusBadge>`. Tidak ada komponen `<Image>` yang me-render `product.imageUrl`.
- **Dampak:** User melihat placeholder kosong di halaman detail produk.
- **Perbaikan:** Tambahkan komponen `<Image>` dari `next/image` dengan `product.imageUrl`.

### 2.10 Slug Produk Direkonstruksi Salah

- **File:** `app/(public)/checkout/success/page.tsx:39`
- **Masalah:** `order.product.toLowerCase().replace(/\s+/g, "-")` menghasilkan slug yang berbeda dari slug asli. Misal "Sound System Profesional 5000W" → "sound-system-profesional-5000w" padahal slug asli "sound-system-profesional".
- **Dampak:** Product lookup gagal — escrow breakdown tidak render untuk escrow orders.
- **Perbaikan:** Simpan `productSlug` di order data, jangan rekonstruksi dari nama.

### 2.11 Admin/Vendor Buttons Tidak Berfungsi

- **File:** `app/(admin)/user/admin/vendors/page.tsx:78-83`
- **Masalah:** Approve/Reject buttons tidak ada `onClick` handler.
- **Perbaikan:** Implementasi handler atau tandai sebagai placeholder dengan disabled state.

### 2.12 Vendor Profile Save Tidak Berfungsi

- **File:** `app/(vendor)/user/vendor/profile/page.tsx`
- **Masalah:** "Simpan Perubahan" tidak ada handler, form fields uncontrolled (`defaultValue` tanpa `onChange`).
- **Perbaikan:** Implementasi controlled form dengan state management dan submit handler.

---

## 3. BUG LOW

### 3.1 Dead Links di Login/Register

- **File:** `app/(public)/auth/login/page.tsx:158`, `app/(public)/auth/register/page.tsx:280-285`
- **Masalah:** "Lupa Kata Sandi?", "Syarat & Ketentuan", "Kebijakan Privasi" semuanya `href="#"`.
- **Perbaikan:** Hubungkan ke route yang sesuai (`/forgot-password`, `/legal`, `/privacy`).

### 3.2 `<a href>` Bukan `<Link>` di Login/Register

- **File:** `app/(public)/auth/login/page.tsx`, `app/(public)/auth/register/page.tsx`
- **Masalah:** Menggunakan `<a href>` untuk navigasi internal — menyebabkan full page reload di Next.js App Router.
- **Perbaikan:** Ganti dengan komponen `<Link>` dari `next/link`.

### 3.3 Password Strength Display Identik untuk Strength 0 dan 1

- **File:** `components/auth/PasswordStrength.tsx:21`
- **Masalah:** `Math.max(0, strength - 1)` membuat strength 0 dan 1 menghasilkan index yang sama → output "Sangat Lemah" untuk keduanya.
- **Perbaikan:** Adjust mapping index agar strength 1 menampilkan "Lemah" (bukan "Sangat Lemah").

### 3.4 Artificial Loading Delay

- **File:** `app/(public)/blog/page.tsx:18`, `app/(public)/blog/[slug]/page.tsx:25-37`
- **Masalah:** Menggunakan `setTimeout` untuk mensimulasikan loading 1.2 detik — anti-pattern.
- **Perbaikan:** Gunakan server-side data fetching dengan Suspense atau real async data fetching.

### 3.5 `e.target.reset()` dalam setTimeout

- **File:** `app/(public)/contact/page.tsx:21`
- **Masalah:** `reset()` dipanggil di dalam `setTimeout` 1500ms — synthetic event mungkin sudah recycled.
- **Perbaikan:** Simpan reference form sebelum timeout atau gunakan controlled form pattern.

### 3.6 Vendor Name Hardcoded di Admin Dashboard

- **File:** `app/(admin)/user/admin/dashboard/page.tsx:295`, `app/(admin)/user/admin/orders/page.tsx:25`
- **Masalah:** Semua order menampilkan "Jakarta Audio Pro" sebagai vendor — seharusnya dari data order.
- **Perbaikan:** Ambil vendor name dari data order yang sesuai.

### 3.7 Semua Ticket Hardcoded Status "active"

- **File:** `app/(vendor)/user/vendor/tickets/page.tsx:29`
- **Masalah:** `<StatusBadge status="active"/>` di-render untuk semua ticket, tanpa memperhatikan status pembayaran aktual.
- **Perbaikan:** Gunakan `order.paymentStatus` atau field status yang sesuai.

### 3.8 Login State Hardcoded

- **File:** `components/layout/Navbar.tsx:12`
- **Masalah:** `isLoggedIn` di-set `true` secara hardcoded. Logout hanya mengubah local state.
- **Perbaikan:** Implementasi auth context/state management yang proper.

---

## 4. DEVIASI DESIGN SYSTEM

### HIGH Severity

#### 4.1 Button Touch Target di Bawah Minimum

- **File:** `components/ui/button.tsx:7`
- **Masalah:** Default button min-height 36px — DESIGN.md mewajibkan minimal 44px untuk mobile touch targets.
- **Spec:** MD button → `min-h-[44px]`
- **Implementasi:** `min-h-[36px]`

#### 4.2 Zero `motion-reduce` Support

- **Lokasi:** Seluruh codebase
- **Masalah:** Tidak ada satu pun komponen yang menggunakan `motion-reduce:animate-none`. DESIGN.md secara eksplisit mewajibkan respect terhadap `prefers-reduced-motion`.
- **Dampak:** Accessibility violation untuk user dengan motion sensitivity.

#### 4.3 Footer Duplikat

- **File:** `components/layout/Footer.tsx` + `components/blog/Footer.tsx`
- **Masalah:** Dua file ~154 baris yang hampir identik. Perbedaan hanya beberapa link dan struktur kolom Perusahaan.
- **Perbaikan:** Consolidate menjadi satu komponen `Footer` dengan props untuk kustomisasi links.

### MEDIUM Severity

#### 4.4 COLOR.md.md Border Radius Naming Tidak Konsisten

- **File:** `COLOR.md.md:123-128`
- **Masalah:** COLOR.md.md menggunakan `md=12px, lg=16px, xl=24px` sedangkan DESIGN.md + globals.css menggunakan `md=8px, lg=12px, xl=16px, 2xl=24px`.
- **Dampak:** Siapapun yang merujuk COLOR.md.md akan menerapkan nilai radius yang salah.

#### 4.5 Input/Select Height 40px vs 44px

- **File:** `components/ui/input.tsx:10`, `components/ui/select.tsx:17`
- **Masalah:** Menggunakan `h-10` (40px) — DESIGN.md menspesifikasikan `h-11` (44px).

#### 4.6 Button Sizes Deviasi dari Spec

- **File:** `components/ui/button.tsx:20-24`
- **Masalah:** Semua ukuran button deviasi dari DESIGN.md:

  | Size | Spec | Implementasi |
  |---|---|---|
  | SM | px-4 py-2 text-xs min-h-[36px] | h-9 px-3 text-xs |
  | MD | px-6 py-3 text-sm min-h-[44px] | h-10 px-4 py-2 |
  | LG | px-8 py-4 text-base min-h-[52px] | h-11 px-8 text-base |
  | Icon | p-2.5 w-11 h-11 | h-9 w-9 p-0 |

#### 4.7 `text-[10px]` di Bawah Minimum

- **Lokasi:** `BlogCard.tsx:17`, `ErpHeader.tsx:56,72`, `ErpMobileNav.tsx:34`, `ErpSidebar.tsx:92`, `TicketCard.tsx:51,74`
- **Masalah:** DESIGN.md menyatakan "Jangan gunakan text-xs (12px) untuk konten utama — hanya untuk caption." `text-[10px]` berada di bawah minimum absolut.

#### 4.8 Chart Hardcoded Hex Values

- **File:** `components/ui/chart.tsx:21-24`
- **Masalah:** Menggunakan hardcoded `#E5E5E5` dan `#F0EDF9` bukan design tokens. Violates TASTE.md anti-pattern "No hardcoded styling."

### LOW Severity

#### 4.9 Missing CSS Animations

- **File:** `app/globals.css`
- **Masalah:** `--animate-scan-line` dan `--shadow-scanner-*` didefinisikan di DESIGN.md tapi tidak ada di globals.css.

#### 4.10 Input Disabled Text Color

- **File:** `components/ui/input.tsx:10`
- **Masalah:** Menggunakan `text-neutral-500` — DESIGN.md spec `text-neutral-400`.

---

## 5. MASALAH ARSITEKTUR

### 5.1 Tidak Ada Error Boundary

- Tidak ada file `error.tsx` di route manapun.
- Runtime error di satu halaman akan crash entire layout.
- **Rekomendasi:** Tambahkan `error.tsx` di setiap route group (`(public)`, `(admin)`, `(vendor)`).

### 5.2 Tidak Ada Suspense Boundary

- Tidak ada `<Suspense>` atau `loading.tsx` untuk async server components.
- Tidak ada fallback UI saat data sedang dimuat.
- **Rekomendasi:** Tambahkan `loading.tsx` atau bungkus `{children}` dengan `<Suspense>`.

### 5.3 Tidak Ada SEO Metadata Per-Halaman

- Hanya root layout yang export `metadata`.
- Halaman produk, event, dan blog tidak memiliki page-specific metadata (title, description, OpenGraph).
- **Rekomendasi:** Export `metadata` atau `generateMetadata` di setiap page component.

### 5.4 Directory Kosong

- `hooks/` — custom hooks belum diimplementasi.
- `app/(admin)/user/admin/dashboard_v2/` — placeholder belum dibangun.
- `app/(vendor)/user/vendor/dashboard_v2/` — placeholder belum dibangun.
- **Rekomendasi:** Hapus atau implementasi. Directory kosong membingungkan.

### 5.5 Tidak Ada Test

- Zero test coverage — tidak ada file test sama sekali.
- **Rekomendasi:** Minimal tambahkan unit test untuk `lib/` utilities dan integration test untuk critical flows (checkout, payment).

### 5.6 Search/Filter/Pagination Non-Fungsi

- Hampir semua halaman admin dan vendor memiliki search input, filter, dan pagination yang **tidak berfungsi** — state di-set tapi tidak digunakan untuk memfilter data.
- **Rekomendasi:** Implementasi atau hapus element yang tidak berfungsi untuk menghindari misleading UX.

### 5.7 Hardcoded Data di Dashboard Vendor/Admin

- Vendor identity "Jakarta Audio Pro" / "JA" di-hardcoded di layout dan header.
- Total pengguna menggunakan magic number `users.length + 3`.
- Semua statistik di admin reports hardcoded.
- **Rekomendasi:** Ambil dari auth context atau data model.

### 5.8 Vendor Identity Hardcoded

- **File:** `components/layout/ErpHeader.tsx:63-72`, `app/(vendor)/user/vendor/layout.tsx:21`
- **Masalah:** Store name, initials, dan role di-hardcoded. Props interface sudah ada tapi tidak digunakan untuk section ini.
- **Rekomendasi:** Ambil dari auth context atau props.

### 5.9 Duplikasi Footer

- **File:** `components/layout/Footer.tsx` + `components/blog/Footer.tsx`
- **Masalah:** ~154 baris kode duplikat.
- **Rekomendasi:** Consolidate menjadi satu komponen dengan props untuk kustomisasi links.

---

## 6. REKOMENDASI PRIORITAS

### Prioritas 1 — Critical (Segera)

| # | Tindakan | File |
|---|---|---|
| 1 | Fix `params` type ke Promise pattern | `products/[slug]/page.tsx`, `pay/[code]/page.tsx` |
| 2 | Fix `createPaymentLink` → tambahkan `links.push` | `lib/checkout-data.ts` |
| 3 | Fix VA number → lazy initializer/ref | `PaymentSimulator.tsx` |
| 4 | Tambahkan auth middleware + role guards | Middleware baru |
| 5 | Filter data vendor per vendor ID | Semua halaman vendor |

### Prioritas 2 — High

| # | Tindakan | File |
|---|---|---|
| 6 | Fix ProgressSteps state | `CheckoutFormWrapper.tsx` |
| 7 | Fix setTimeout cleanup | `PaymentSimulator.tsx` |
| 8 | Fix button touch target ke 44px | `components/ui/button.tsx` |
| 9 | Tambahkan `motion-reduce:animate-none` global | `app/globals.css` + semua component |
| 10 | Consolidate Footer components | `components/layout/Footer.tsx` |

### Prioritas 3 — Medium

| # | Tindakan | File |
|---|---|---|
| 11 | Tambahkan paste handler OTP | `OtpInput.tsx` |
| 12 | Fix Navbar dropdown outside-click | `Navbar.tsx` |
| 13 | Fix path matching segment boundary | `ErpSidebar.tsx`, `ErpMobileNav.tsx` |
| 14 | Tambahkan `error.tsx` untuk semua route groups | Route groups |
| 15 | Tambahkan `<Suspense>` boundaries | Layouts |
| 16 | Fix input/select height ke 44px | `input.tsx`, `select.tsx` |
| 17 | Tambahkan page-level SEO metadata | Semua page components |
| 18 | Tambahkan blog detail yang missing | `lib/blog-data.ts` |

### Prioritas 4 — Low

| # | Tindakan | File |
|---|---|---|
| 19 | Fix dead links | `login/page.tsx`, `register/page.tsx` |
| 20 | Ganti `<a href>` dengan `<Link>` | `login/page.tsx`, `register/page.tsx` |
| 21 | Fix password strength display | `PasswordStrength.tsx` |
| 22 | Implementasi fungsi interactive | Admin/vendor pages |

---

## 7. STATISTIK

```
Total Bug:          25 (5 Critical + 12 Moderate + 8 Low)
Design System Gap:  10 (3 High + 5 Medium + 2 Low)
Arsitektur:          9
─────────────────────────────────
Total Temuan:       44
```
