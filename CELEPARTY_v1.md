🏛️ MODUL A: PERBAIKAN STRUKTUR & LAYOUT
Modul ini berfokus pada pembersihan taksonomi, standardisasi responsivitas visual, dan penambahan filter spasial di halaman katalog utama.  
1. Komponen UI yang Dibangun / DimodifikasiProductFilters.tsx (Modifikasi): Integrasi dropdown wilayah baru menggunakan data statis indonesian-regions.ts.  Header.tsx & Footer.tsx (Modifikasi): Optimalisasi breakpoint layout agar terbebas dari horizontal scroll tidak disengaja pada lebar minimum 375px.  
2. Alur Pengguna (User Flow) — Filter Wilayah[Halaman /products] ──► User membuka Sidebar Filter (Desktop) atau Bottom Sheet (Mobile)
                           │
                           ▼
                     User memilih "Provinsi / Kabupaten" pada Dropdown Filter
                           │
                           ▼
                     Zustand Store / URL Query Params diperbarui secara real-time
                           │
                           ▼
                     React Query memicu refetch otomatis berdasarkan dependensi state wilayah
                           │
                           ▼
                     [Grid UI] Menampilkan produk/jasa yang areanya dicakup oleh vendor tersebut

🎟️ MODUL B: PRODUK TIKET (TICKETING SYSTEM)
Modul operasional tiket berskala besar, menangani pengumpulan data individual per tiket, manifes penjualan vendor, hingga gerbang masuk kecepatan tinggi (high-speed entry gate).  
1. Komponen UI yang Dibangun / Dimodifikasicomponents/product/TicketForm.tsx (Modifikasi): Form pembuatan tiket khusus vendor (menggunakan SchemaTicket.ts untuk validasi Zod).  app/cart/dataContent.tsx (Modifikasi): Penambahan slot form dinamis untuk menangani data manifes penerima tiket berdasarkan jumlah kuantitas (quantity) pembelian[cite: 4].components/profile/vendor/ticket-management/ (Penyatuan Komponen Duplikat):TicketDashboard.tsx — Dasbor penjualan kuota tiket[cite: 4].TicketScan.tsx — Gerbang verifikasi tiket multi-mode[cite: 4].TicketSend.tsx — Form pengiriman tiket undangan / bypass gratis[cite: 4].
2. Alur Pengguna (User Flow)A. Pembelian Tiket & Input Manifes Multi-Penerima (Customer)[Detail Tiket] ──► User memilih Varian (VIP/Reguler) + Menentukan Qty (misal: 3 tiket) ──► Klik "Beli"
                        │
                        ▼
[Halaman /cart] ──► Zustand mendeteksi `isTicket: true` dan merender otomatis 3 buah kartu "Recipient Form"
                        │
                        ▼
                  User WAJIB mengisi data tiap lembar (Nama, Email, WA, Jenis & No Identitas)[cite: 4]
                        │
                        ▼
                  Pemicu `onBlur` memvalidasi input via Zod (Error merah text-xs di bawah input field)
                        │
                        ▼
[Order Summary] ──► Klik "Bayar Sekarang" (Tombol c-green, text-neutral-900) ──► Buka Midtrans Snap Popup
B. Verifikasi Masuk Gerbang Event (Vendor Staff)[/vendor/tickets] ──► Staf memilih salah satu dari 3 Tab: "Kamera", "USB Scanner", atau "Manual"
                           │
                           ├─► [Tab Kamera] ──► Kamera smartphone aktif via @zxing/library ──► Scan QR
                           │
                           ├─► [Tab USB] ──► Input tersembunyi otomatis mengunci fokus (Auto-Focus)
                           │                 └── Tembak laser fisik ──► Scanner menyuntikkan teks + Enter[cite: 4, 6]
                           │
                           └─► [Tab Manual] ──► Staf mengetik kode tiket manual ──► Klik "Verify"[cite: 4, 6]
                                             │
                                             ▼
                                     POST ke `/api/qr-verify`[cite: 4, 6]
                                             │
                                             ▼
[Sinyal Audio & UI Overlay] ──► Merender Card Kondisi Hasil dari Backend:[cite: 4, 6]
                                 ├─► ✅ VALID: Card bg-emerald-50 + Audio Beep Sukses[cite: 2, 4]
                                 ├─► ⚠️ USED: Card bg-amber-50 + Detail Waktu Scan Pertama[cite: 2, 4]
                                 └─► ❌ INVALID: Card bg-red-50 + Audio Buzz Gagal[cite: 2, 4]

📦 MODUL C: PRODUK NON-TIKET & SISTEM ESCROW
Modul pengelolaan sewa logistik barang/jasa dengan sistem pembayaran dua tahap (DP 30% & Pelunasan 70%) disertai gerbang persetujuan ketersediaan oleh pihak vendor.  1. Komponen UI yang Dibangun / Dimodifikasicomponents/product/ProductForm.tsx (Modifikasi): Penambahan input rincian logistik sewa dan tombol toggle "Aktifkan Opsi Pembayaran Escrow".  app/user/vendor/orders/page.tsx (Modifikasi): Integrasi baris aksi pesanan masuk (Accept / Reject buttons) khusus untuk akun ber-role Vendor[cite: 4].components/payment/EscrowBreakdown.tsx (Komponen Baru): Kartu rincian pemecahan nilai uang (DP 30% di awal dan sisa Pelunasan 70% sebelum tanggal loading)[cite: 2, 4].
2. Alur Pengguna (User Flow) — Transaksi Escrow & Gerbang Vendor[Checkout Jasa] ──► Customer melihat rincian EscrowBreakdown ──► Memilih Opsi Escrow[cite: 4]
                           │
                           ▼
                     Customer membayar tagihan Tahap 1 (DP 30% dari total harga) via Midtrans
                           │
                           ▼
                     [Status Order]: payment_status berubah menjadi 'dp_paid'[cite: 4]
                           │
                           ▼
[Dasbor Vendor] ──► Pesanan masuk ke tab "Pending" Vendor ──► Vendor memeriksa tanggal sewa & loading[cite: 4, 6]
                           │
                           ├───► [Klik REJECT] ──► Modal alasan penolakan muncul ──► Pesanan batal (Proses Refund)[cite: 4, 6]
                           │
                           └───► [Klik APPROVE] ──► vendor_status menjadi 'approved'[cite: 4]
                                                       │
                                                       ▼
[Dasbor Customer] ──► Tombol baru "Bayar Pelunasan 70%" aktif di riwayat transaksi customer[cite: 4, 6]
                           │
                           ▼
                     Customer melunasi sisa tagihan 70% (Maksimal H-1 sebelum tanggal loading)
                           │
                           ▼
                     [Status Order]: payment_status final berubah menjadi 'settlement' (Lunas)[cite: 4]

📝 MODUL D: CUSTOM QUOTATION
Modul transaksi khusus untuk mengakomodasi kesepakatan harga sewa di luar katalog standar setelah melalui proses negosiasi offline.  
1. Komponen UI yang Dibangun / Dimodifikasiapp/admin/quotation/page.tsx (Halaman Baru - Protected Admin): Form input penawaran khusus untuk entitas Admin Celeparty[cite: 4, 6].app/pay/[code]/page.tsx (Halaman Baru - Public Landing): Halaman kasir ringkas (centered narrow container) tempat customer mengeksekusi tautan pembayaran yang mereka terima[cite: 2, 4].
2. Alur Pengguna (User Flow)[Admin Panel] ──► Admin mengisi Form (Nama, Email, WA Customer, Nama Produk Spesifik, & Harga Deal)[cite: 4, 6]
                           │
                           ▼
                     Klik "Generate" ──► Backend membuat kode unik `QT-YYYYMMDD-XXXX`[cite: 4, 6]
                           │
                           ▼
                     UI menampilkan tautan invoice kustom + Tombol "Salin Tautan" (Copy to Clipboard)[cite: 4, 6]
                           │
                           ▼
[Landing /pay/code] ──► Customer membuka tautan dari email ──► Sistem memvalidasi masa kedaluwarsa (7 Hari)[cite: 4, 6]
                           │
                           ▼
                     Halaman menampilkan detail kesepakatan harga kustom + Tombol "Bayar Sekarang"[cite: 4]
                           │
                           ▼
                     Customer membayar full via Midtrans Snap ──► Status Quotation otomatis 'paid'[cite: 4, 6]

⚙️ MODUL E: PENYEDERHANAAN SISTEMModul eliminasi technical debt jangka pendek untuk mempercepat kenyamanan transaksi harian[cite: 4, 7].
1. Komponen UI yang Dibangun / DimodifikasiItemProduct.tsx & /products/[slug]/page.tsx (Modifikasi): Penghapusan seluruh elemen visual dekoratif bintang rating dan baris ulasan komoditas[cite: 4, 7].components/product/FileUploader.tsx (Modifikasi): Penyuntikan pustaka kompresi gambar otomatis sebelum menyentuh lapisan multipart-form data upload[cite: 4, 6].
2. Alur Pengguna (User Flow) — Auto Compress Gambar[Form Tambah Produk] ──► Vendor memilih atau menjatuhkan berkas foto produk (> 1MB) ke area FileUploader[cite: 4, 6]
                              │
                              ▼
                        Sistem mencegat proses upload dan memicu `browser-image-compression`[cite: 4, 6]
                              │
                              ▼
                        Web Worker memproses kompresi di latar belakang tanpa mengunci (freeze) main UI thread[cite: 4]
                              │
                              ▼
                        UI menampilkan teks indikator progress: "Mengompresi Gambar (2.4 MB → 420 KB)..."[cite: 4]
                              │
                              ▼
                        File biner hasil kompresi berukuran ringan dikirim secara aman ke server Strapi[cite: 4]

🚀 MODUL F: BONUS SERVICE (LAYANAN TAMBAHAN)
Serangkaian fitur tambahan gratis dari developer untuk mendongkrak tingkat konversi penjualan dan optimisasi keramahan mesin pencari (SEO)[cite: 4, 6].
1. Komponen UI yang Dibangun / Dimodifikasiapp/cart/CheckoutStrategy (Modifikasi): Penambahan opsi jalur "Beli Tanpa Akun (Guest Checkout)" pada langkah pengisian data diri[cite: 4, 6].app/products/[slug]-[documentId]/page.tsx (Halaman Baru): Penataan ulang struktur rute dinamis agar ramah SEO berbasis slug yang divalidasi lewat fungsi Next.js generateMetadata[cite: 4, 6].
2. Alur Pengguna (User Flow) — Guest Checkout[Jalur Checkout] ──► User memilih opsi "Lanjutkan sebagai Tamu" (Tanpa perlu melakukan Registrasi Akun)[cite: 4, 6]
                           │
                           ▼
                     User cukup memasukkan alamat Email Utama + melengkapi Form Data Penerima Tiket[cite: 4, 6]
                           │
                           ▼
                     Zustand mengunci data pembeli menggunakan token tamu sementara (*temporary session token*)[cite: 6]
                           │
                           ▼
                     Eksekusi pembayaran Midtrans Snap berjalan normal menggunakan detail data tamu[cite: 4, 6]
                           │
                           ▼
[Email Notifikasi] ──► PDF Tiket dikirim ke email tamu, disertai tautan khusus "Klaim Akun" 
                     (Mengonversi data pesanan tamu ke akun teregistrasi baru jika diinginkan di masa depan)[cite: 6]

🎨 ATURAN IMPLEMENTASI DESIGN SYSTEM KONSISTEN (taste.md)
Setiap komponen frontend wajib melewati sanity check berikut sebelum dinyatakan selesai:  
1. Touch Targets (Mobile): Semua tombol interaktif, stepper, tab selector, dan field input wajib memiliki tinggi target sentuh minimal 44x44px (khusus tab switcher scanner 48px) demi memfasilitasi kecepatan ketukan di lapangan. 
2. Mencegah iOS Safari Auto-Zoom: Seluruh elemen <input> dan <select> pada form data pelanggan dan pengisian logistik wajib menggunakan font berukuran minimal 16px (text-base). 
3. Rasio Kontras Lolos WCAG: Tombol utama Checkout berwarna latar belakang aksen c-green (#CBD002) Wajib dipasangkan dengan kelas teks gelap (text-neutral-900). Penggunaan teks putih (text-white) di atas warna hijau brand ini dilarang keras karena melanggar aturan kontras aksesibilitas. 
4. Pembeda Tipe Font: Judul halaman, harga tebal, teks tombol, dan navigasi wajib dibungkus kelas font-quick (Quicksand). Sementara paragraf, deskripsi, data tabel, dan label input menggunakan kelas font-sans (Inter). Kode tiket numerik wajib berformat font-mono (JetBrains Mono).  