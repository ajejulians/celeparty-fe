# CELEPARTY — Implementation Plan (PRD)

> **Kontrak:** Pengembangan Website Celeparty  
> **Periode:** 1 Juli 2026 – 30 Oktober 2026 (4 bulan)  
> **Klien:** Rizky Fadillah Hermawan  
> **Developer:** Arief Maulana  
> **Tech Stack:** Next.js 14 (*App Router*) + Strapi 5 (*TypeScript*) + PostgreSQL 17 + Midtrans + Resend  
> **Versi Dokumen:** 2.1 — Terakhir diperbarui 5 Juli 2026  
> **Cross-Ref:** [development-guide.md](../architecture/development-guide.md) (v2.1), [todos.md](./todos.md), [contract-scope.md](./contract-scope.md)

---

## Problem Statement

Celeparty adalah platform marketplace event yang sudah berjalan (production) dengan dua bisnis utama: **penyewaan perlengkapan event** dan **penjualan tiket event**. Platform ini memerlukan penyempurnaan fitur existing, penambahan modul baru (Escrow Payment, Custom Quotation, Vendor Order Management), dan perbaikan kualitas UI/UX — semua dalam scope kontrak 4 bulan.

**Pain points utama:**
1. Struktur kategori produk tidak bersih (kategori "Event" seharusnya dihapus)
2. Tampilan belum sepenuhnya responsif dan konsisten
3. Tidak ada filter produk berdasarkan wilayah/lokasi vendor
4. Vendor belum bisa approve/reject pesanan non-tiket
5. Tidak ada mekanisme pembayaran bertahap (escrow DP 30% + pelunasan 70%)
6. Admin tidak bisa membuat custom quotation untuk negosiasi offline
7. Fitur Rating & Review belum relevan untuk fase ini
8. Foto produk tidak dikompresi otomatis sebelum upload
9. Pembelian tiket memerlukan registrasi akun — perlu opsi guest checkout untuk konversi lebih tinggi
10. Struktur URL/slug belum SEO-friendly, tidak ada meta tags per halaman
11. Performa sistem belum diaudit — potensi bottleneck di data fetching dan rendering

---

## Solution

Implementasi 5 modul (21 sub-items) sesuai kontrak **ditambah Modul F (4 items) sebagai bonus service dari developer**, menggunakan arsitektur existing (Next.js 14 + Strapi 5) tanpa migrasi unified transaction. Pendekatan: **vertical-slice delivery** per fase, mulai dari quick wins (cleanup) menuju fitur kompleks (escrow + quotation), diakhiri dengan bonus service (guest checkout, SEO, performance).

> [!NOTE]
> **Modul F — Bonus Service:** Poin-poin ini **tidak termasuk dalam scope kontrak** (Modul A–E), namun dikerjakan dan didokumentasikan secara profesional sebagai **layanan tambahan gratis** dari developer. Poin-poin ini bersumber dari MoM rapat 18 Juni 2026 (§4.3, §6.2, §6.3, §7 No.4) dan dikerjakan demi kualitas platform yang lebih tinggi serta kepuasan klien.

---

## User Stories

### Modul A — Perbaikan Struktur Website
1. As a **customer**, I want product listings without the "Event" category, so that I see a clean and relevant product taxonomy
2. As a **customer on mobile**, I want all pages to be responsive and consistent, so that I can browse comfortably on any device
3. As a **customer**, I want to filter products by vendor location/region, so that I can find vendors who serve my area

### Modul B — Produk Tiket (Ticketing)
4. As a **customer**, I want to see a clear listing of ticket products with event details (date, location, price), so that I can choose the right event
5. As a **customer**, I want to complete the ticket purchase flow end-to-end (browse → cart → pay → receive e-ticket), so that I get my tickets seamlessly
6. As a **customer**, I want to fill in individual recipient data for each ticket, so that each attendee gets a personalized e-ticket
7. As a **customer**, I want each ticket to have a unique barcode, so that event verification is secure
8. As a **vendor**, I want to manage ticket orders and export them as CSV, so that I have records for my event operations
9. As a **vendor staff**, I want to verify tickets using camera scan, USB barcode scanner, or manual code entry, so that I can validate tickets at the venue efficiently
10. As a **customer/recipient**, I want to receive my e-ticket PDF via email with a scannable QR code, so that I have proof of entry

### Modul C — Produk Non-Tiket
11. As a **customer**, I want to see detailed listings of equipment/service products, so that I can make informed rental decisions
12. As a **customer**, I want to complete the non-ticket purchase flow with loading date and location details, so that my event logistics are arranged
13. As a **vendor**, I want to approve or reject incoming orders, so that I can manage my availability
14. As a **customer**, I want to pay 30% DP upfront and the remaining 70% before loading date (escrow), so that I have flexible payment terms
15. As a **vendor**, I want comprehensive order management with transaction history, so that I track all my business
16. As a **vendor**, I want to export order data as .xlsx, so that I can process it in Excel
17. As a **customer/vendor**, I want email notifications for every order status change, so that I stay informed

### Modul D — Custom Quotation
18. As an **admin**, I want to generate a custom quotation with a unique payment link, so that offline-negotiated deals can be completed online
19. As a **customer**, I want to pay via a shared payment link, so that I can complete negotiated purchases easily

### Modul E — Penyederhanaan Sistem
20. As a **customer**, I want no rating/review elements visible, so that the interface is clean (feature deferred)
21. As a **vendor**, I want my product photos auto-compressed before upload, so that images load faster and save storage

### Modul F — Bonus Service (Layanan Tambahan Gratis)

> *Catatan: User stories berikut merupakan kebutuhan yang teridentifikasi dari MoM 18 Juni 2026, dikerjakan sebagai bonus service di luar scope kontrak.*

22. As a **customer**, I want to purchase tickets without creating an account (guest checkout), so that I can buy tickets quickly without registration friction
23. As a **customer**, I want SEO-friendly URLs with proper slugs, so that I can find events and products via search engines
24. As an **admin**, I want proper meta tags and Open Graph data on all public pages, so that the platform ranks well on Google and looks professional when shared on social media
25. As a **customer**, I want the platform to load quickly and feel responsive, so that I have a smooth browsing experience without lag

---

## Implementation Decisions

### Architecture
- **Dual transaction system preserved** — `transaction` (equipment) and `transaction-ticket` (ticket) remain parallel. No unified migration in scope
- **Strapi 5 schema changes** — 16 new fields on `transaction`, 1 new content type (`custom-quotation`)
- **Next.js API proxy pattern** — all Strapi calls proxied through `app/api/` routes (existing pattern maintained)
- **Webhook routing** — `order_id` suffix-based routing: `-DP` for escrow DP, `-REMAINING` for escrow pelunasan, `QT-` prefix for quotation payments

### Key Technical Decisions
- **Escrow state machine**: `dp_pending → dp_paid → fully_paid` with vendor gate (approve/reject between DP and pelunasan)
- **Scheduler**: Strapi cron `0 8 * * *` for H-1 pelunasan reminders + existing 60s variant expiry cron
- **Barcode uniqueness**: 17-char barcode with checksum + DB unique constraint + retry logic
- **Scanner modes**: Camera (zxing), USB (keyboard emulation + Enter detection), Manual input
- **Image compression**: Client-side via `browser-image-compression` (max 1MB, max 1920px, WebWorker)
- **Export**: CSV (tickets) via `file-saver` with UTF-8 BOM; XLSX (equipment) via `SheetJS`

### Modul F Technical Decisions (Bonus Service)
- **Guest checkout**: Session-based cart using `sessionStorage` + temporary guest token. Guest order creates transaction with `guest_email` field; no user account created. Post-purchase email includes link to "claim" the order to a registered account (optional)
- **SEO slug generation**: `next/dynamic` slug for products/tickets using `generateStaticParams`. Format: `/products/{slugified-name}-{documentId}`. `generateMetadata` for per-page `<title>`, `<meta description>`, Open Graph tags
- **Performance audit**: React Query `staleTime` optimization (10s → 30s for listings, 5min for static data). `next/image` enforcement for all product images. Bundle analysis via `@next/bundle-analyzer`. Lazy loading for below-fold components

### Security Hardening & API Stabilization (COMPLETED)
- **Vendor Balance Protection:** secured `/api/vendor-balance/update` using `global::internal-webhook-secret` policy to ensure internal lifecycle execution or server-to-server webhook requests with secret headers.
- **Plural and Singular Email Protection:** secured `/api/email/send` and `/api/emails/send` using the `global::isAuthenticated` policy to prevent unauthorized email relays.
- **Custom Transaction Vendor Action Protection:** secured `/transactions/:id/vendor-action` with the `global::isAuthenticated` policy.
- **Ticket Verification Endpoints:** secured both `/ticket-verifications/verifyByCode/:code` and `/ticket-verifications/markAsUsed/:id` with the `global::isAuthenticated` policy.
- **Core CRUD Protection:** secured all core `transaction-ticket` CRUD endpoints (`create`, `find`, `findOne`, `update`, `delete`) with `global::isAuthenticated` to prevent public data extraction.
- **Frontend Alignment:** refactored frontend scan and verification components (`TicketScan`, `TicketScanTab`, `TicketVerification`) to utilize session JWT tokens from next-auth and call the correct authenticated endpoints.

---

## Testing Decisions

### Strategy
- **Primary seam**: Next.js API proxy routes (integration point between FE and Strapi)
- **Backend validation**: Lifecycle hooks (`beforeCreate`, `afterUpdate`) are the critical business logic gates
- **Frontend validation**: Zod schemas for all forms (recipient, checkout, quotation)
- **Payment integration**: Midtrans Sandbox for all payment flows before production switch

### What Makes a Good Test
- Tests should verify **external behavior** (API response, email sent, status changed), not internal implementation
- Each vertical slice should be independently verifiable (demoable)
- Edge cases explicitly tested: expired variants, sold-out tickets, vendor reject after DP, quotation expiry

### Test Areas per Module
| Module | Test Focus |
|--------|-----------|
| A | Category cleanup → no broken relations; filter returns correct products by region |
| B | E2E ticket purchase → ticket-details created; barcode uniqueness; scanner all 3 modes |
| C | Escrow state transitions; vendor action authorization; webhook routing DP vs REMAINING |
| D | Quotation code uniqueness; payment link expiry; webhook routing QT- prefix |
| E | Rating elements absent from all pages; compression reduces file size > threshold |
| F | Guest checkout E2E without login; SEO meta tags rendered correctly; Lighthouse scores ≥ 70 |

---

## Out of Scope

> [!IMPORTANT]
> These items are explicitly **NOT** part of this contract or bonus service. Any work here requires a written change request with separate costing.

- Unified transaction system migration (dual `transaction` / `transaction-ticket` preserved)
- Admin dashboard outside Strapi CMS (except Custom Quotation page)
- Mobile app development
- Real-time WebSocket notifications
- Analytics / Google Analytics integration
- Multi-language / i18n
- ISR (Incremental Static Regeneration) optimization
- Unit tests / integration tests framework setup
- CI/CD pipeline
- Error tracking (Sentry) / performance monitoring
- Elasticsearch / Algolia search
- Automated refund processing (manual admin process for escrow rejection refunds)

> [!NOTE]
> **Items yang sebelumnya Out of Scope, kini dikerjakan sebagai Modul F (Bonus Service):**
> - ~~Guest checkout untuk pembelian tiket~~ → **TASK-500** (Modul F)
> - ~~Konfigurasi SEO per filter produk dan per kota~~ → **TASK-501** (Modul F)
> - ~~Penataan slug dan URL~~ → **TASK-501** (Modul F)
> - ~~Optimisasi performa sistem secara menyeluruh~~ → **TASK-502** (Modul F)

---

## Further Notes

### Milestone & Payment Schedule

```
JULI 2026           AGUSTUS 2026        SEPTEMBER 2026      OKTOBER 2026
│                   │                   │                   │
├───────────────────┼───────────────────┼───────────────────┤
│ FASE 1            │ FASE 2            │ FASE 3            │ FASE 4       │
│ Quick Wins &      │ Modul Tiket       │ Non-Tiket &       │ QA, Bonus    │
│ Perbaikan         │ Lengkap           │ Advanced          │ & Handover   │
│                   │                   │                   │              │
│ E.a E.b A.a       │ B.a B.b B.c       │ C.c C.d C.g       │ UAT          │
│ A.b A.c           │ B.d B.e B.f       │ D.a D.b           │ Bug Fix      │
│                   │ B.g C.a C.b       │ C.f               │ F.a F.b F.c  │
│                   │ C.e               │                   │ Deploy       │
▼                   ▼                   ▼                   ▼
DP                  Termin 2            —                   Pelunasan
(1 Juli)            (≈ Akhir Agustus)                       (30 Oktober)
```

> **Modul F (Bonus Service)** dijadwalkan di Fase 4 setelah seluruh deliverable kontrak selesai, agar tidak mengganggu timeline utama.

### Risk Register

| Risk | Impact | Mitigation |
|------|--------|------------|
| Midtrans webhook routing complexity (4 payment types) | High — incorrect routing breaks payments | Comprehensive order_id pattern matching with fallback logging |
| Escrow state machine edge cases | High — stuck transactions | Scheduler for auto-expiry + admin notification + manual override capability |
| Strapi schema migration on production | Medium — data loss | Backup DB before migration; test on staging first |
| Email deliverability (Resend) | Medium — tickets not received | Verify domain; test all templates; implement send-history audit |
| vendor-balance endpoint security gap | Critical — anyone can modify vendor balance | Fix in Phase 1 as prerequisite |
| Guest checkout session hijacking | Medium — unauthorized order access | Session-scoped tokens, email verification, rate limiting on checkout endpoint |
| SEO slug collision | Low — 404 on duplicate names | Append documentId to slug for uniqueness guarantee |
| Performance regression from new features | Medium — degraded UX | Lighthouse CI baseline before/after comparison; staleTime tuning |

### Dependencies (New Packages)

**Frontend:**
```bash
npm install browser-image-compression   # E.b
npm install file-saver                   # B.e, C.f
npm install @types/file-saver --save-dev
```

**Backend:** All dependencies already exist (PDFKit, qrcode, crypto, date-fns, Resend plugin, Midtrans client).
