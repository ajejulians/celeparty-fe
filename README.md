# Celeparty Frontend (Next.js 14 App Router)

Celeparty adalah **marketplace event platform** — tempat pengguna (customer) dapat menemukan dan menyewa jasa/produk untuk keperluan event, sekaligus tempat vendor mengelola bisnis event mereka. Frontend ini dibangun dengan arsitektur modern berbasis Next.js 14 untuk memastikan performa yang cepat, SEO yang baik, dan pengalaman pengguna yang luar biasa (WOW effect).

## 🚀 Teknologi Utama

- **Framework**: [Next.js 14](https://nextjs.org/) (menggunakan paradigma terbaru App Router)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) (Strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Ikon**: [Lucide React](https://lucide.dev/)
- **Font**: Quicksand (Display/Headings) & Inter (Body/Data) via `next/font/google`
- **Desain Sistem**: Merujuk pada panduan eksklusif *Celeparty Design System v1.0* ("Festive but Professional").

## 📁 Struktur Folder

Proyek ini mengadopsi best-practice struktur direktori Next.js App Router:

```
app/
 ├── (public)/         # Rute yang dapat diakses publik (Tanpa Layout Dashboard)
 │    ├── page.tsx     # Landing Page utama
 │    ├── products/    # Katalog Produk & Pencarian
 │    ├── help/        # Pusat Bantuan (FAQ, Bantuan Umum)
 │    ├── legal/       # Dokumen Legal & Syarat Ketentuan
 │    ├── privacy/     # Kebijakan Privasi
 │    ├── contact/     # Halaman Hubungi Kami
 │    └── blog/        # Artikel & Blog Celeparty
 │
 ├── (admin)/          # Area khusus Admin Internal (Restricted)
 ├── (vendor)/         # Dashboard khusus Mitra Vendor Event
 │
 ├── globals.css       # Style utama & utilitas dasar Tailwind
 └── layout.tsx        # Root Layout aplikasi (termasuk Navbar & Footer)

components/
 ├── auth/             # Komponen autentikasi (Login/Daftar) & FormField
 ├── layout/           # Komponen struktur halaman (Navbar, Footer, Sidebar)
 ├── product/          # Komponen yang berhubungan dengan produk (TicketCard)
 ├── feedback/         # UI State (Error, Loading Skeleton, Empty State, StatusBadge)
 └── ui/               # Komponen fundamental yang digunakan ulang (Button, Input, Card)

lib/
 ├── data.ts           # Data Dummy & Interface Type (Mock Data)
 └── utils.ts          # Fungsi utilitas (Class merger `cn`, formatters)
```

## 🎨 Design System & Token

Celeparty memiliki desain sistem yang berfokus pada pengalaman "Festive tapi Dapat Dipercaya". 

- **Primary (`c-blue` - #3E2882)**: Digunakan untuk layout, elemen struktur, hero section, dan *trust points*.
- **CTA/Accent (`c-green` - #CBD002)**: Secara khusus digunakan untuk menarik perhatian ke tombol transaksi utama ("Beli Sekarang", "Mulai Sekarang"). Didesain dengan *glow shadow* untuk interaksi premium.
- **Glassmorphism**: Dimanfaatkan pada Navbar ketika di-scroll (`backdrop-blur-lg`) serta Menu Mobile guna menghadirkan estetika modern.
- **Micro-animations**: Interaksi berskala kecil namun terasa premium. Contoh: Efek `scale-95` pada klik tombol, *underline swipe* pada navigasi, serta pemutaran tipis pada ikon-ikon yang disorot (hover).

*(Rincian lengkap dari desain sistem berada di dalam berkas internal `DESIGN.md`)*.

## 🛠️ Cara Menjalankan Secara Lokal

1. **Clone repository ini**
   ```bash
   git clone https://github.com/ajejulians/celeparty-fe.git
   cd celeparty-fe
   ```

2. **Instal seluruh dependencies**
   ```bash
   npm install
   # atau menggunakan pnpm/yarn
   pnpm install
   ```

3. **Jalankan Development Server**
   ```bash
   npm run dev
   ```

4. **Buka di Browser**
   Buka [http://localhost:3000](http://localhost:3000) untuk melihat hasilnya. Proyek akan diperbarui secara otomatis jika Anda memodifikasi file.

## 📱 Standar Responsivitas

Platform ini dikembangkan dengan pendekatan **Mobile-First**. 
- Seluruh layout *grid* diatur dari `grid-cols-1` pada ukuran kecil (HP).
- Elemen sentuh minimum (`min-h-[44px]`) untuk aksesibilitas di perangkat seluler.
- *Full-screen overlay menu* pada kondisi mobile untuk memudahkan navigasi menggunakan ibu jari (dengan penguncian efek scroll latar belakang).

## 🧑‍💻 Kontribusi

Saat mengembangkan lebih lanjut, harap patuhi *rules* berikut:
1. Pastikan Anda hanya menggunakan warna/ukuran dari token Tailwind (`c-blue`, `c-green`, `c-red`, dll). **Jangan** memasukkan nilai hex langsung ke dalam file komponen.
2. Gunakan `Image` dari `next/image` alih-alih `img` biasa untuk semua aset eksternal dan gambar dummy demi optimalisasi performa yang lebih baik.
3. Selalu pisahkan *Client Component* (gunakan arahan `"use client";`) hanya pada komponen spesifik yang membutuhkan state interaktif, hooks (`useState`, `useEffect`), maupun *event listeners*.
