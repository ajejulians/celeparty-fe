# CELEPARTY — TODOS.md (Master Task List)

> **Proyek:** Pengembangan Website Celeparty
> **Periode:** 1 Juli – 30 Oktober 2026
> **Tracking:** Vertical-slice issues, dependency-ordered
> **Versi:** 2.0 — Terakhir diperbarui 4 Juli 2026
> **Legend:** 🟢 Easy | 🟡 Medium | 🟠 Hard | 🔴 Very Hard | ⬛ Critical/Security | 💎 Bonus Service

---

## GLOBAL ACCEPTANCE STANDARDS

> [!IMPORTANT]
> Per kontrak §14.1, **setiap task** dianggap selesai hanya jika memenuhi **semua** kriteria universal berikut:

| # | Kriteria Universal | Keterangan |
|---|---|---|
| 1 | Berfungsi sesuai deskripsi kontrak & dokumentasi | Sesuai [development-guide.md](../architecture/development-guide.md) |
| 2 | Responsif di mobile (min 375px) dan desktop (min 1280px) | Breakpoints: 375, 414, 768, 1280, 1440 |
| 3 | Tidak ada error JS/TS console yang tidak ditangani | Zero unhandled exceptions |
| 4 | Data tersimpan & terbaca dengan benar dari/ke Strapi | CRUD verified |
| 5 | Email notifikasi terkirim jika fitur memerlukan | Via Resend API |
| 6 | Tidak ada regresi pada fitur yang sebelumnya berjalan | Zero regression policy |

---

## FASE 0 — PREREQUISITES (Security & Setup)

> [!CAUTION]
> These must be completed BEFORE any feature work begins. The vendor-balance endpoint is a critical security vulnerability.

### TASK-000: Secure vendor-balance endpoint ⬛
- **Layer:** Backend
- **Estimate:** 1–2 hours
- **Blocked by:** None — can start immediately
- **User stories:** N/A (security fix)

**What to build:**
The endpoint `PUT /api/vendor-balance/update` is currently **Public** — anyone can modify vendor balance without authentication. This must be secured.

**Acceptance criteria:**
- [x] Endpoint requires authentication (`isAuthenticated` policy)
- [x] Only internal lifecycle calls or authenticated admin/system can update balance
- [x] Existing webhook flow still works (balance updated after ticket settlement)
- [x] No regression in vendor wallet display
- [x] **Architectural note:** Full migration to lifecycle-internal access deferred; `isAuthenticated` policy is Phase 1 fix

---

### TASK-000B: Security hardening audit — public endpoints ⬛ (COMPLETED)
- **Layer:** Backend
- **Estimate:** 2–3 hours
- **Blocked by:** TASK-000
- **User stories:** N/A (security audit)
- **Source:** [system-architecture.md](../architecture/system-architecture.md) §13.2, [development-guide.md](../architecture/development-guide.md) §10.2

**What to build:**
Audit and secure all Strapi custom endpoints currently set to `Public` that should require authentication. Reference: [system-architecture.md](../architecture/system-architecture.md) line 1300-1307.

**Acceptance criteria:**
- [x] `PUT /api/ticket-verifications/markAsUsed/:id` → requires `isAuthenticated` (COMPLETED)
- [x] `POST /api/emails/send` and `/api/email/send` → requires `isAuthenticated` (COMPLETED)
- [x] `POST /api/transaction-tickets/verifyQR` → secured with `isAuthenticated` (COMPLETED)
- [x] `GET /api/transaction-tickets/generateInvoice/:id` → secured with `isAuthenticated` (COMPLETED)
- [x] `GET /api/ticket-verifications/verifyByCode/:code` → secured with `isAuthenticated` (COMPLETED)
- [x] All decisions documented in ADR or inline code comments (COMPLETED)

---

### TASK-001: Setup development environment & verify builds 🟢
- **Layer:** Both
- **Estimate:** 2–3 hours
- **Blocked by:** None — can start immediately
- **User stories:** N/A (infrastructure)

**What to build:**
Ensure both `celeparty-strapi` and `celeparty-fe` build and run cleanly in development. Verify all existing flows work before modifying anything.

**Acceptance criteria:**
- [x] `npm run develop` (Strapi) starts without errors
- [x] `yarn dev` (Next.js) starts without errors
- [x] `yarn build` (Next.js) compiles 100% without type errors (verified: exit code 0, 85.88s)
- [x] Existing ticket purchase flow works end-to-end in dev
- [x] Existing equipment purchase flow works end-to-end in dev
- [x] All environment variables documented and verified (`BASE_API`, `KEY_API`, `MIDTRANS_SERVER_KEY`, etc.)

---

## FASE 1 — Quick Wins & Structural Cleanup (Juli 2026)

> [!NOTE]
> Start with the easiest, highest-impact tasks. These clear technical debt and improve the base quality before building new features.

### TASK-100: Remove Rating & Review from UI [E.a] 🟢
- **Layer:** Frontend (primary), Backend (optional)
- **Estimate:** 1–2 hours
- **Blocked by:** TASK-001
- **User stories:** #20

**What to build:**
Hide all rating/review elements from the entire application. The `rate` field stays in DB schema for backward compatibility but is not rendered anywhere.

**Acceptance criteria:**
- [x] No star ratings visible on product cards (`ItemProduct.tsx`)
- [x] No rating display on product detail pages (`/products/[slug]`)
- [x] No `rate` input field in product/ticket creation forms (`ProductForm.tsx`, `TicketForm.tsx`)
- [x] No rating column in vendor product management tables
- [x] `rate` field made optional in TypeScript interfaces (`iProduct.ts`)
- [x] Zero TypeScript errors after changes
- [x] Zero console errors in browser

---

### TASK-101: Remove "Event" category from system [A.a] 🟢
- **Layer:** Both (data cleanup + frontend)
- **Estimate:** 1–2 hours
- **Blocked by:** TASK-001
- **User stories:** #1

**What to build:**
Delete the "Event" category from Strapi and remove all frontend references, leaving only product categories.

**Acceptance criteria:**
- [x] "Event" category entry deleted from Strapi Content Manager
- [x] Products/tickets previously linked to "Event" reassigned to correct categories
- [x] "Event" option removed from `lib/static/categories.tsx`
- [x] "Event" option removed from filter dropdowns on `/products` page
- [x] `EventList.tsx` component updated if it renders "Event" as a distinct type
- [x] No broken relation errors in Strapi after deletion
- [x] No UI errors or missing data in product listings

---

### TASK-102: Auto-compress product photos on upload [E.b] 🟢
- **Layer:** Frontend only
- **Estimate:** 2–3 hours
- **Blocked by:** TASK-001
- **User stories:** #21

**What to build:**
Integrate `browser-image-compression` into `FileUploader.tsx` to automatically compress images > 500KB before uploading to Strapi. Apply to all upload points: product form, ticket form, profile photo.

**Acceptance criteria:**
- [x] `browser-image-compression` package installed
- [x] Images > 500KB compressed to max 1MB / max 1920px dimension
- [x] Compression runs in WebWorker (non-blocking)
- [x] Loading indicator shows "Mengompresi gambar..." during compression
- [x] Before/after file size displayed to user
- [x] Compression applied in `ProductForm.tsx`, `TicketForm.tsx`, `profile-image-form.tsx`
- [x] Upload flow unchanged from user perspective (seamless)

---

### TASK-103: Responsive UI polish [A.b] 🟢
- **Layer:** Frontend only
- **Estimate:** 3–4 hours
- **Blocked by:** TASK-100, TASK-101 (clean UI first)
- **User stories:** #2

**What to build:**
Audit and fix all responsive breakpoints across the application. Ensure design system consistency (brand colors, typography, spacing).

**Acceptance criteria:**
- [x] No unintentional horizontal scroll on any page at 375px viewport
- [x] Product listing grid: 1 col (mobile), 2 col (tablet), 3-4 col (desktop)
- [x] Product detail: 2-column layout collapses to single column on mobile
- [x] Cart & checkout forms comfortable on mobile (min 16px input text)
- [x] Vendor dashboard tables horizontally scrollable on mobile
- [x] Registration forms don't overflow on small screens
- [x] All touch targets minimum 44×44px on mobile
- [x] Brand colors consistent: `#3E2882` (primary), `#CBD002` (accent), `#DA7E01` (secondary), `#d41f31` (danger)
- [x] Typography consistent: Inter (body), Quicksand (headings)

---

### TASK-104: Product filter by vendor location/region [A.c] 🟢
- **Layer:** Both
- **Estimate:** 6–8 hours
- **Blocked by:** TASK-103 (filter UI needs responsive layout)
- **User stories:** #3

**What to build:**
Add a location/region dropdown filter to the product listing page. The filter queries Strapi using `$containsi` across `kabupaten`, `region`, and `kota_event` fields. Data source: existing `indonesian-regions.ts`.

**Acceptance criteria:**
- [x] Location/region dropdown appears in `ProductFilters.tsx` sidebar
- [x] Selecting a region filters products in real-time via React Query
- [x] Filter works with `$or` across `kabupaten`, `region`, `kota_event` fields
- [x] Location filter combinable with category filter and price range filter
- [x] "Reset Filter" button clears all filters including location
- [x] Same filter applied to ticket listings (if shared listing page)
- [x] Backend Strapi permissions allow filtered queries on these fields

---

## FASE 2 — Modul Tiket Lengkap (Agustus 2026)

> [!IMPORTANT]
> Completion of this phase triggers **Termin 2 payment**. All ticket-related features (B.a–B.g) plus basic non-ticket listing (C.a, C.b, C.e) must be delivered and tested.

### TASK-200: Ticket & product listing polish [B.a + C.a] 🟢
- **Layer:** Both
- **Estimate:** 4–6 hours
- **Blocked by:** TASK-104 (filter infrastructure)
- **User stories:** #4, #11

**What to build:**
Ensure ticket and non-ticket product listings display all required information with proper handling of edge cases (sold out, expired, inactive).

**Acceptance criteria:**
- [x] **Ticket cards show:** thumbnail, event name, date+time, location (city), starting price (cheapest active variant), "Sold Out" badge when all variant quotas = 0
- [x] **Non-ticket cards show:** thumbnail, product name, category, price range (min-max variant), vendor location, escrow badge if `escrow=true`
- [x] Expired products/tickets (`end_date` passed) do NOT appear in listing
- [x] Inactive products (`is_active=false`) do NOT appear in listing
- [x] Only `state=approved` products/tickets appear in public listing
- [x] Pagination works correctly
- [x] Click navigates to correct detail page (`/products/[slug]`)
- [x] API queries include correct `populate` for variants, images, category, user_event_type

---

### TASK-201: Ticket purchase flow end-to-end [B.b + B.c] 🟢
- **Layer:** Both
- **Estimate:** 10–14 hours
- **Blocked by:** TASK-200
- **User stories:** #5, #6

**What to build:**
Complete the ticket purchase flow: browse → add to cart → fill recipient data per ticket → checkout → Midtrans payment → success page. Ensure backend lifecycle validates ticket availability, variant quota, purchase deadlines.

**Acceptance criteria:**
- [x] Recipient form appears for each ticket quantity (e.g., qty=3 → 3 recipient forms)
- [x] Recipient fields: `recipient_name`, `recipient_email`, `whatsapp_number`, `identity_type`, `identity_number` — all required
- [x] Zod validation with clear error messages per field
- [x] Cannot proceed to checkout with incomplete recipient data
- [x] Backend `beforeCreate` validates: ticket active, state=approved, end_date not passed, variant active, quota sufficient, purchase_deadline not passed
- [x] After payment settlement: `ticket-detail` records created per quantity with unique barcode/QR
- [x] Each ticket-detail gets correct recipient data
- [x] Variant quota decremented by purchase quantity
- [x] Vendor `saldo_active` updated with correct fee calculation
- [x] Success page shows order confirmation

---

### TASK-202: Barcode uniqueness & scanner verification [B.d + B.f] 🟢
- **Layer:** Both
- **Estimate:** 10–14 hours
- **Blocked by:** TASK-201 (needs ticket-details to exist)
- **User stories:** #7, #9

**What to build:**
Harden barcode generation (17-char with checksum, retry on collision, DB unique constraint). Build triple-mode verification UI: camera (zxing), USB scanner (keyboard emulation), manual input.

**Acceptance criteria:**
- [x] Barcode format: 8-digit timestamp + 8-hex random + 1 checksum digit = 17 chars
- [x] `barcode` field has `unique: true` constraint in Strapi schema
- [x] Generation uses retry logic (max 3 attempts) to avoid collisions
- [x] **Camera mode:** zxing library detects QR/barcode from video stream → triggers verification
- [x] **USB mode:** auto-focused input field; Enter key from scanner triggers verification
- [x] **Manual mode:** text input + "Verify" button
- [x] Verification result shows: ✅ VALID (ticket holder info), ⚠️ ALREADY USED (first scan time), ❌ INVALID, ❌ NOT FOUND
- [x] Audio feedback: success beep / error buzz
- [x] Every verification recorded in `ticket-verification` table (audit trail: who, when, how, result, IP, device)

---

### TASK-203: Order management & CSV/XLSX export [B.e + C.e + C.f] 🟢
- **Layer:** Both
- **Estimate:** 6–8 hours
- **Blocked by:** TASK-201 (needs orders to exist)
- **User stories:** #8, #15, #16

**What to build:**
Complete vendor order management dashboard with full-featured tables and export capabilities.

**Acceptance criteria:**
- [x] Vendor order table columns: Order#, Customer Name, Product, Variant, Qty, Total Price, Payment Status, Vendor Status, Order Date, Event Date
- [x] Column sorting enabled
- [x] Pagination: 10/20/50 per page
- [x] Search by customer name or order number
- [x] Status badges: pending=yellow, settlement=green, failed=red
- [x] **CSV export (tickets):** UTF-8 with BOM; valid in Excel/Google Sheets; includes all relevant columns
- [x] **XLSX export (non-tickets):** valid .xlsx file using SheetJS; includes all order fields
- [x] Export buttons clearly visible above table
- [x] `file-saver` package installed and working

---

### TASK-204: E-ticket email delivery [B.g] 🟢
- **Layer:** Backend (primary) + Frontend (resend button)
- **Estimate:** 6–10 hours
- **Blocked by:** TASK-201, TASK-202 (needs tickets with barcodes)
- **User stories:** #10

**What to build:**
Ensure PDF e-tickets are generated and emailed to each recipient after payment settlement. PDF must contain: event details, recipient info, ticket code, barcode (numeric), QR code (image), status badge. Add "Resend Ticket" button in vendor dashboard.

**Acceptance criteria:**
- [x] PDF auto-generated via `generateProfessionalTicketPDF.js` (PDFKit) after settlement
- [x] PDF contains: logo, event name, date/time, location, recipient name/email/WA, ticket code, barcode, QR code, status
- [x] Individual PDF emailed to each recipient's email address via Resend
- [x] Invoice PDF emailed to buyer's email
- [x] QR code in PDF is scannable and triggers valid verification
- [x] Barcode text is clearly readable in PDF
- [x] "Resend Ticket" button in vendor ticket management dashboard works
- [x] Send history tracked in `ticket-send-history` table

---

### TASK-205: Non-ticket purchase flow [C.b] 🟢
- **Layer:** Both
- **Estimate:** 8–12 hours
- **Blocked by:** TASK-200 (needs product listing)
- **User stories:** #12

**What to build:**
Ensure non-ticket (equipment/service) purchase flow works end-to-end with all required fields: loading_date, loading_time, event_date, shipping_location, customer info.

**Acceptance criteria:**
- [x] Checkout form includes: customer_name, telp, email, event_date, loading_date, loading_time, shipping_location, event_type, note
- [x] Loading date validated to be in the future
- [x] Backend `beforeCreate` validates: product active, state=approved, variant active/available, quota sufficient
- [x] Transaction created with `payment_status: pending`
- [x] After Midtrans settlement → invoice PDF generated and emailed to customer
- [x] Vendor receives email notification for new order
- [x] Cart correctly handles non-ticket items (no recipient forms)
- [x] Mixed cart validation: cannot checkout tickets and non-tickets together

---

## FASE 3 — Non-Tiket Advanced & New Features (September 2026)

> [!WARNING]
> This phase contains the most complex tasks. Escrow (TASK-301) is the single hardest task in the entire contract (~24-32 hours).

### TASK-300: Vendor approve/reject orders [C.c] 🟢
- **Layer:** Both
- **Estimate:** 8–12 hours
- **Blocked by:** TASK-205 (needs non-ticket orders to exist)
- **User stories:** #13

**What to build:**
Add `vendor_status` field to transaction schema. Build `PUT /api/transactions/:id/vendor-action` endpoint. Build approve/reject UI in vendor dashboard with rejection reason modal.

**Acceptance criteria:**
- [x] Schema updated: `vendor_status` (enum: pending/approved/rejected), `vendor_rejection_reason`, `vendor_approved_at`, `vendor_rejected_at`
- [x] Custom endpoint validates: only vendor who owns the product can act; only pending/dp_paid orders can be acted upon
- [x] Approve: sets `vendor_status=approved`, `vendor_approved_at=now`, email sent to customer
- [x] Reject: modal with reason field; sets `vendor_status=rejected`, reason stored, email with reason sent to customer
- [x] Vendor cannot access/modify another vendor's orders (403 Forbidden)
- [x] Dashboard shows approve/reject buttons only for `vendor_status=pending` orders
- [x] After action, buttons replaced with status badge

---

### TASK-301: Escrow payment — DP 30% + Pelunasan 70% [C.d] 🟢
- **Layer:** Both — **Most complex task in contract**
- **Estimate:** 24–32 hours
- **Blocked by:** TASK-300 (vendor approve/reject must work first)
- **User stories:** #14

**What to build:**
Complete 2-phase payment system for escrow products. State machine: `dp_pending → dp_paid → (vendor approve/reject) → fully_paid`. Two separate Midtrans transactions per order. Daily scheduler for H-1 pelunasan reminders. Webhook routing by order_id suffix.

**Acceptance criteria:**
- [x] Schema updated: `escrow`, `escrow_status`, `dp_amount`, `dp_order_id`, `dp_payment_status`, `dp_paid_at`, `remaining_amount`, `remaining_order_id`, `remaining_payment_status`, `remaining_paid_at`, `reminder_sent`
- [x] `beforeCreate` lifecycle calculates: `dp_amount = ceil(total × 0.3)`, `remaining_amount = floor(total × 0.7)`
- [x] Product detail page shows escrow breakdown (DP 30% / Pelunasan 70% / Total) for `escrow=true` products
- [x] Vendor product form has escrow toggle
- [x] Cart store tracks escrow flag
- [x] **DP Payment:** `POST /api/payment/dp` creates Midtrans transaction with `{order_id}-DP` suffix
- [x] Webhook routes `-DP` suffix → updates `dp_payment_status`
- [x] After DP settlement: email to customer (DP confirmed) + email to vendor (new escrow order)
- [x] Vendor can approve/reject after DP (integrates with TASK-300)
- [x] **Vendor reject after DP:** email to customer with refund notification (manual refund process)
- [x] **Scheduler** `0 8 * * *`: finds escrow orders where `loading_date = tomorrow` AND `escrow_status = dp_paid` AND `vendor_status = approved` AND `reminder_sent = false` → sends reminder email → sets `reminder_sent = true`
- [x] Customer dashboard shows "Pay Remaining 70%" button after vendor approve
- [x] **Pelunasan Payment:** `POST /api/payment/remaining` creates Midtrans transaction with `{order_id}-REMAINING` suffix
- [x] Webhook routes `-REMAINING` suffix → updates `remaining_payment_status`, sets `escrow_status = fully_paid`, `payment_status = settlement`
- [x] After pelunasan settlement: final invoice PDF emailed to customer; confirmation to vendor
- [x] **Expiry edge case:** orders past `loading_date` with `escrow_status=dp_paid` → scheduler marks as expired, notifies customer + vendor + admin

---

### TASK-302: Email notifications per status change [C.g] 🟢
- **Layer:** Backend only
- **Estimate:** 4–6 hours
- **Blocked by:** TASK-300, TASK-301 (needs all status transitions to exist)
- **User stories:** #17

**What to build:**
Comprehensive email notification system triggered by transaction lifecycle events.

**Acceptance criteria:**
- [x] Email sent on: `pending → settlement` (non-escrow) → customer + vendor
- [x] Email sent on: `pending_dp → dp_paid` → customer + vendor
- [x] Email sent on: `vendor_status → approved` → customer
- [x] Email sent on: `vendor_status → rejected` → customer (includes rejection reason)
- [x] Email sent on: `dp_paid → settlement` (pelunasan) → customer + vendor
- [x] Email sent on: `* → failed` → customer
- [x] All emails include: customer name, order number, product details, variant, qty, price, status, event date, action link
- [x] Email templates use Celeparty branding (purple theme, logo)
- [x] Emails not flagged as spam (proper headers, verified domain)

---

### TASK-303: Custom Quotation — admin form + payment link [D.a + D.b] 🟢
- **Layer:** Both
- **Estimate:** 12–16 hours
- **Blocked by:** TASK-000 (webhook routing must be in place)
- **User stories:** #18, #19

**What to build:**
New Strapi content type `custom-quotation`. Admin-only page at `/admin/quotation` to create quotations. Public payment page at `/pay/[code]`. Webhook routing for `QT-` prefixed payments.

**Acceptance criteria:**
- [x] `custom-quotation` content type created with full schema (code, customer info, product, amount, status, payment_link, expires_at)
- [x] `POST /api/custom-quotations` generates unique code `QT-YYYYMMDD-XXXX`
- [x] Payment link generated: `{FRONT_URL}/pay/{code}`
- [x] Expiry set to 7 days from creation
- [x] Email auto-sent to customer with payment link and details
- [x] `/admin/quotation` page is admin-only (route protected)
- [x] Admin form: customer name, email, phone, product name, description, amount
- [x] After creation: show quotation code + payment link with copy button
- [x] `/pay/[code]` page is publicly accessible
- [x] Page shows: product name, amount, deadline, "Pay Now" button
- [x] Expired quotation → shows "Link expired" message
- [x] Already paid quotation → shows "Already paid" message
- [x] Payment via Midtrans Snap from payment page
- [x] Webhook routes `QT-` prefix → updates `custom-quotation` status to `paid`
- [x] Confirmation email to customer and admin after payment

---

## FASE 4 — QA, Bug Fixes & Handover (Oktober 2026)

> [!TIP]
> This phase is for stabilization. No new features. Focus on testing, fixing, and preparing for production deployment.

### TASK-400: Integration testing — all payment flows 🟢
- **Layer:** Both
- **Estimate:** 8–12 hours
- **Blocked by:** All FASE 2 + FASE 3 tasks

**Acceptance criteria:**
- [x] Regular ticket payment: end-to-end verified in Midtrans Sandbox
- [x] Regular non-ticket payment: end-to-end verified
- [x] Escrow DP payment: Midtrans webhook correctly routes `-DP`
- [x] Escrow pelunasan payment: webhook correctly routes `-REMAINING`
- [x] Custom quotation payment: webhook correctly routes `QT-` prefix
- [x] All email notifications sent at correct points
- [x] All PDF attachments generated and scannable
- [x] Vendor balance correctly calculated after each payment type
- [x] **Cron job health:** 60-second variant/product expiry cron still works after schema changes
- [x] **Cron job health:** Daily `0 8 * * *` escrow reminder scheduler functions correctly
- [x] **Dual-webhook:** Ticket orders correctly update BOTH `transaction` AND `transaction-ticket` content types

---

### TASK-401: Cross-browser & responsive QA 🟢
- **Layer:** Frontend
- **Estimate:** 4–6 hours
- **Blocked by:** All FASE 1–3 tasks

**Acceptance criteria:**
- [x] Tested on: Chrome, Firefox, Safari (desktop)
- [x] Tested on: Chrome Mobile, Safari iOS (mobile)
- [x] All breakpoints verified: 375px, 414px, 768px, 1280px, 1440px
- [x] Camera scanner works on mobile Chrome and Safari
- [x] USB scanner works on desktop Chrome and Firefox
- [x] All forms usable on mobile (no overflow, correct zoom level)
- [x] **Error pages:** `not-found.tsx` (404) and `ErrorBoundary.tsx` render correctly on invalid routes
- [x] **Registration flows:** Both customer (`/auth/register`) and vendor (`/auth/register/mitra`) registration work E2E
- [x] **Registration validation:** Duplicate email/username detection shows appropriate error

---

### TASK-402: Production deployment checklist 🟢
- **Layer:** Both
- **Estimate:** 4–6 hours
- **Blocked by:** TASK-400, TASK-401

**Acceptance criteria:**
- [x] All environment variables set in production (see [development-guide.md](../architecture/development-guide.md) §12)
- [x] `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=true`
- [x] Midtrans production keys configured
- [x] Resend API key verified, email domain verified
- [x] Database migration completed (16 new fields on `transaction` + 1 new content type `custom-quotation`)
- [x] **Strapi permissions matrix:** All 20+ endpoints verified per [development-guide.md](../architecture/development-guide.md) §10.1-10.3
- [x] `FRONT_URL` in Strapi points to production frontend URL
- [x] PM2 ecosystem config updated (`ecosystem.config.js`)
- [x] SSL/HTTPS verified
- [x] Backup strategy confirmed
- [x] `yarn build` succeeds with zero errors (verified: exit code 0)
- [x] **Dependencies verified:** `browser-image-compression`, `file-saver`, `@types/file-saver` installed

---

### TASK-403: Documentation & handover 🟢
- **Layer:** Both
- **Estimate:** 2–4 hours
- **Blocked by:** TASK-402

**Acceptance criteria:**
- [x] [development-guide.md](../architecture/development-guide.md) updated with all new features
- [x] New API endpoints documented (§10.3)
- [x] Schema changes documented (§11.1, 16 new fields + custom-quotation)
- [x] Webhook routing logic documented (§10.5, 4 payment types)
- [x] Deployment guide updated with new env variables (§12)
- [x] Handover meeting completed with client

---

### TASK-404: Warranty period support 🟡
- **Layer:** Both
- **Estimate:** On-demand (30 calendar days)
- **Blocked by:** TASK-403 (starts after handover)
- **Source:** Kontrak §13.3

**What to build:**
30-day warranty period (ends 30 November 2026) for bug fixes from implementation, at no additional cost. Any feature additions or change requests beyond this scope require written approval and separate costing.

**Acceptance criteria:**
- [ ] Bug reports from client triaged within 24 hours
- [ ] Critical bugs (payment, data loss) fixed within 48 hours
- [ ] Non-critical bugs fixed within 7 calendar days
- [ ] All fixes verified with client before closing
- [ ] **Scope boundary enforced:** Feature additions vs bug fixes clearly distinguished per contract

---

## FASE 4B — Modul F: Bonus Service (Oktober 2026)

> [!NOTE]
> **Modul F** adalah layanan tambahan gratis dari developer, **di luar scope kontrak** (Modul A–E). Poin-poin ini bersumber dari MoM rapat 18 Juni 2026 (§4.3, §6.2, §6.3, §7 No.4) dan dikerjakan secara profesional demi kualitas platform yang lebih tinggi serta kepuasan klien. Dikerjakan setelah seluruh deliverable kontrak selesai agar tidak mengganggu timeline utama.

### TASK-500: Guest checkout untuk pembelian tiket [F.a] 🟡💎
- **Layer:** Both
- **Estimate:** 10–14 hours
- **Blocked by:** TASK-201 (ticket purchase flow must work first)
- **User stories:** #22
- **Source:** MoM §4.3 — *"Pembelian tiket tidak mewajibkan proses pendaftaran (registrasi akun). User dapat melakukan pembelian tiket sebagai guest."*
- **Status:** Bonus Service (di luar scope kontrak)

**What to build:**
Memungkinkan customer membeli tiket event **tanpa harus mendaftar/login**. Guest checkout menggunakan session-based cart di browser. Data buyer disimpan per transaksi tanpa membuat akun. Setelah pembayaran sukses, e-ticket dikirim ke email yang diisi di form checkout.

**Technical approach:**
- Buat route `/checkout/guest` yang **tidak** di-protect oleh middleware auth
- Session cart menggunakan `sessionStorage` (existing Zustand store pattern)
- Form checkout guest: `buyer_name`, `buyer_email`, `buyer_phone` + recipient forms (sama seperti authenticated flow)
- Backend: buat custom endpoint `POST /api/transaction-tickets/guest-checkout` yang **tidak** memerlukan JWT
  - Validasi: Zod schema server-side, rate limiting (max 5 transactions per IP per 10 menit)
  - Transaksi dibuat dengan `user_id: null` dan `guest_email` field terisi
  - Midtrans Snap token di-generate dari Next.js API route (sama seperti flow authenticated)
- Webhook tetap berjalan seperti biasa (tidak bergantung pada user_id)
- Email post-purchase: include link "Klaim pesanan ke akun" (`/claim-order?token={uuid}`) agar guest bisa opsional menghubungkan order ke akun
- Vendor dashboard: order dari guest ditampilkan dengan badge "Guest"

**Acceptance criteria:**
- [x] Customer dapat membeli tiket tanpa login/registrasi
- [x] Form checkout guest memiliki: buyer_name, buyer_email, buyer_phone + recipient forms per tiket
- [x] Validasi Zod bekerja di frontend dan backend (dual validation)
- [x] Midtrans Snap payment berfungsi untuk guest order
- [x] Webhook settlement menghasilkan ticket-details dengan barcode/QR yang benar
- [x] E-ticket PDF dikirim ke `buyer_email` dan setiap `recipient_email`
- [x] Rate limiting aktif: max 5 guest transactions per IP per 10 menit
- [x] Vendor dashboard menampilkan guest orders dengan badge "Guest"
- [x] Link "Klaim pesanan" di email memungkinkan guest menghubungkan order ke akun (opsional)
- [x] Tidak ada regresi pada flow pembelian tiket yang sudah ter-autentikasi
- [x] Cart guest ter-isolasi dari cart authenticated (tidak saling interfere)

---

### TASK-501: SEO-friendly slugs, meta tags & Open Graph [F.b] 🟡💎 (COMPLETED)
- **Layer:** Frontend (primary)
- **Estimate:** 8–12 hours
- **Blocked by:** TASK-200 (needs product/ticket listing pages)
- **User stories:** #23, #24
- **Source:** MoM §6.2, §6.3 — *"SEO per filter produk dan per kota"*, *"Slug dan URL belum dikonfigurasi"*
- **Status:** Bonus Service (di luar scope kontrak)

**What to build:**
Implementasi SEO foundation yang mencakup: (1) URL slug yang bersih dan readable untuk semua halaman publik, (2) Dynamic `<title>` dan `<meta description>` per halaman, (3) Open Graph tags untuk social media sharing, (4) Structured data (JSON-LD) untuk produk.

**Technical approach:**
- **Slug generation:** Format `/products/{slugified-name}-{documentId}` dan `/tickets/{slugified-name}-{documentId}`
  - Utility: `lib/utils/slugify.ts` — lowercase, strip special chars, replace spaces with hyphens
  - DocumentId di-append untuk menjamin uniqueness (menghindari slug collision)
  - Redirect dari old URL pattern ke slug URL (301 permanent redirect)
- **Meta tags:** Gunakan Next.js 14 `generateMetadata()` function di setiap page:
  - `/products/[slug]/page.tsx` → `title: "Sewa {product.name} | Celeparty"`, description dari produk
  - `/tickets/[slug]/page.tsx` → `title: "{event.name} - Beli Tiket | Celeparty"`, description event
  - Halaman listing → `title: "Sewa Perlengkapan Event di {region} | Celeparty"` (jika ada filter region aktif)
  - Homepage → `title: "Celeparty — Marketplace Event & Ticketing Indonesia"`
- **Open Graph:** `og:title`, `og:description`, `og:image` (product thumbnail), `og:url`, `og:type: product`
- **Structured Data (JSON-LD):** `Product` schema untuk halaman detail produk, `Event` schema untuk halaman tiket
- **Sitemap:** Generate `sitemap.xml` via Next.js `app/sitemap.ts` yang auto-list semua produk/tiket publik
- **Robots.txt:** `app/robots.ts` dengan rules standar (allow /, disallow /user/, /admin/)

**Acceptance criteria:**
- [x] Semua halaman publik memiliki `<title>` tag yang deskriptif dan unik
- [x] Semua halaman publik memiliki `<meta name="description">` yang relevan
- [x] Product detail pages memiliki URL format `/products/{slug}-{id}` (bukan `/products/[id]`)
- [x] Ticket detail pages memiliki URL format `/tickets/{slug}-{id}`
- [x] Open Graph tags render dengan benar (testable via Facebook Sharing Debugger / opengraph.xyz)
- [x] `og:image` menampilkan thumbnail produk/tiket yang benar
- [x] JSON-LD structured data valid (testable via Google Rich Results Test)
- [x] `sitemap.xml` accessible di `{domain}/sitemap.xml` dan mencakup semua produk/tiket publik
- [x] `robots.txt` accessible di `{domain}/robots.txt` dengan rules yang tepat
- [x] Filter region aktif menghasilkan judul halaman yang mencantumkan nama region
- [x] Tidak ada duplicate titles atau descriptions antar halaman
- [x] Build `yarn build` sukses tanpa error setelah perubahan

---

### TASK-502: Performance audit & optimization [F.c] 🟡💎 (COMPLETED)
- **Layer:** Both
- **Estimate:** 8–12 hours
- **Blocked by:** TASK-400 (integration testing must pass first)
- **User stories:** #25
- **Source:** MoM §7 No.4 — *"Performa sistem cukup berat"*, MoM §8.6 — *"Definisi berat belum spesifik"*
- **Status:** Bonus Service (di luar scope kontrak)

**What to build:**
Audit performa menyeluruh menggunakan Lighthouse dan profiling tools, kemudian implementasi quick-win optimizations yang berdampak tinggi.

**Technical approach:**
1. **Audit Phase (Baseline):**
   - Jalankan Lighthouse audit pada 5 halaman kunci: Homepage, Product Listing, Product Detail, Ticket Detail, Vendor Dashboard
   - Catat baseline scores: Performance, Accessibility, Best Practices, SEO
   - Profiling network waterfall: identifikasi request yang terlalu banyak atau terlalu besar
   - Bundle analysis via `@next/bundle-analyzer`

2. **Optimization Phase:**
   - **React Query staleTime tuning:**
     - Product listing: `staleTime: 30_000` (30 detik, dari 10 detik)
     - Static data (categories, regions): `staleTime: 300_000` (5 menit)
     - User profile: `staleTime: 60_000` (1 menit)
     - Vendor dashboard: `staleTime: 15_000` (15 detik, real-time-ish)
   - **Image optimization:**
     - Enforce `next/image` component untuk semua product/ticket images (lazy loading bawaan)
     - Set `sizes` attribute properly: `(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw`
     - WebP format auto-served oleh Next.js image optimizer
   - **Code splitting & lazy loading:**
     - `dynamic(() => import(...))` untuk below-fold components (Blog section, FAQ, Footer maps)
     - Lazy load modal components (RejectModal, QuotationFormModal)
     - Lazy load chart/analytics components di vendor dashboard
   - **Bundle reduction:**
     - Analyze top 5 largest dependencies via bundle analyzer
     - Tree-shake unused exports dari SheetJS / date-fns jika applicable
     - Split vendor chunks: separate Midtrans SDK dari main bundle
   - **Font optimization:**
     - Gunakan `next/font` untuk Inter dan Quicksand (self-hosted, font-display: swap)
     - Preload critical fonts

3. **Verification Phase:**
   - Re-run Lighthouse pada 5 halaman yang sama
   - Bandingkan before/after scores
   - Dokumentasikan improvements di performance report

**Acceptance criteria:**
- [x] Lighthouse Performance score ≥ 70 pada semua 5 halaman kunci (baseline dicatat)
- [x] Lighthouse Accessibility score ≥ 85
- [x] Lighthouse Best Practices score ≥ 90
- [x] React Query `staleTime` dikonfigurasi per-endpoint (bukan global 10s untuk semua)
- [x] Semua product/ticket images menggunakan `next/image` component
- [x] Below-fold components di-lazy-load (tidak blocking initial render)
- [x] Bundle size report dihasilkan via `@next/bundle-analyzer`
- [x] Fonts menggunakan `next/font` (no external Google Fonts request)
- [x] Before/after performance comparison didokumentasikan
- [x] Tidak ada regresi fungsional setelah optimisasi
- [x] `yarn build` sukses tanpa error

---

## Summary Matrix

| Phase | Tasks | Estimate | Payment Trigger | Scope |
|-------|-------|----------|-----------------|-------|
| **Phase 0** | TASK-000, TASK-000B, TASK-001 | 5–8 hrs | DP | Kontrak |
| **Phase 1** | TASK-100 → TASK-104 | 13–19 hrs | — | Kontrak |
| **Phase 2** | TASK-200 → TASK-205 | 44–64 hrs | **Termin 2** | Kontrak |
| **Phase 3** | TASK-300 → TASK-303 | 48–66 hrs | — | Kontrak |
| **Phase 4** | TASK-400 → TASK-404 | 18–28 hrs + warranty | **Pelunasan** | Kontrak |
| **Phase 4B** | TASK-500 → TASK-502 | 26–38 hrs | — (gratis) | **Bonus Service** |
| **TOTAL** | **27 tasks** | **~154–223 hrs** | — | — |

---


> **Dependency Chain (Critical Path):**
> `TASK-000` → `TASK-000B` → `TASK-001` → `TASK-100/101` → `TASK-103` → `TASK-104` → `TASK-200` → `TASK-201` → `TASK-202` → `TASK-205` → `TASK-300` → `TASK-301` → `TASK-302` → `TASK-400` → `TASK-402` → `TASK-403` → `TASK-404`

> **Parallel Tracks:**
> - TASK-102 (image compression) can run parallel with TASK-100/101
> - TASK-203 (order management) can run parallel with TASK-202
> - TASK-204 (email delivery) can run parallel with TASK-202
> - TASK-303 (custom quotation) can run parallel with TASK-301 (different subsystem)
> - TASK-000B (security audit) can run parallel with TASK-001 (different concern)

> **Bonus Service Tracks (Phase 4B):**
> - TASK-500 (guest checkout) can start after TASK-201 is complete
> - TASK-501 (SEO/slug) can start after TASK-200 is complete
> - TASK-502 (performance) should start after TASK-400 is complete (needs baseline)
> - All TASK-5xx can run parallel with TASK-400–404 if Phase 3 finishes early

