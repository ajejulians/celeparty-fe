export interface BlogListItem {
  slug: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  date: string;
  author: string;
  category: string;
}

export interface BlogDetail {
  slug: string;
  title: string;
  excerpt: string;
  thumbnailUrl: string;
  date: string;
  author: string;
  category: string;
  content: BlogContentBlock[];
  relatedProductSlugs: string[];
}

export interface BlogContentBlock {
  type: "heading" | "paragraph" | "list";
  value: string;
  items?: string[];
}

export const blogList: BlogListItem[] = [
  {
    slug: "tips-memilih-sound-system-event",
    title: "Tips Memilih Sound System yang Tepat untuk Event Anda",
    excerpt:
      "Sound system adalah jantung dari setiap acara. Pelajari cara memilih sistem audio yang sesuai dengan skala dan jenis event Anda agar suara tetap jernih dan merata.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=533&fit=crop",
    date: "2026-07-10",
    author: "Tim Celeparty",
    category: "Audio & Sound",
  },
  {
    slug: "tren-dekorasi-event-2026",
    title: "Tren Dekorasi Event 2026: Dari Rustic hingga Modern Minimalis",
    excerpt:
      "Tahun 2026 membawa warna baru dalam dunia dekorasi event. Simak tren terkini yang bisa Anda terapkan untuk pernikahan, ulang tahun, atau corporate gathering.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=533&fit=crop",
    date: "2026-07-08",
    author: "Tim Celeparty",
    category: "Dekorasi",
  },
  {
    slug: "panduan-catering-acara-kantor",
    title: "Panduan Lengkap Catering untuk Acara Kantor",
    excerpt:
      "Memilih menu catering untuk acara kantor tidak boleh sembarangan. Pelajari cara menghitung porsi, memilih variasi menu, dan memastikan semua tamu terlayani dengan baik.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=533&fit=crop",
    date: "2026-07-05",
    author: "Tim Celeparty",
    category: "Catering",
  },
  {
    slug: "fotografi-event-yang-instagrammable",
    title: "Cara Membuat Fotografi Event yang Instagrammable",
    excerpt:
      "Foto adalah kenangan abadi dari setiap event. Ketahui teknik dan pose yang membuat dokumentasi acara Anda terlihat profesional dan layak dibagikan ke media sosial.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=533&fit=crop",
    date: "2026-07-02",
    author: "Tim Celeparty",
    category: "Fotografi",
  },
  {
    slug: "checklist-event-pertama",
    title: "Checklist Lengkap untuk Event Pertama Anda",
    excerpt:
      "Merencanakan event pertama bisa terasa menakutkan. Ikuti checklist ini agar tidak ada yang terlewat — dari venue, vendor, hingga hari-H.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=533&fit=crop",
    date: "2026-06-28",
    author: "Tim Celeparty",
    category: "Tips Event",
  },
  {
    slug: "lighting-panggung-pemula",
    title: "Dasar-Dasar Lighting Panggung untuk Pemula",
    excerpt:
      "Lighting yang tepat bisa mengubah atmosfer acara secara drastis. Pelajari jenis-jenis lampu panggung dan kapan menggunakannya.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=533&fit=crop",
    date: "2026-06-25",
    author: "Tim Celeparty",
    category: "Audio & Sound",
  },
];

export const blogDetails: Record<string, BlogDetail> = {
  "tips-memilih-sound-system-event": {
    slug: "tips-memilih-sound-system-event",
    title: "Tips Memilih Sound System yang Tepat untuk Event Anda",
    excerpt:
      "Sound system adalah jantung dari setiap acara. Pelajari cara memilih sistem audio yang sesuai dengan skala dan jenis event Anda agar suara tetap jernih dan merata.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=533&fit=crop",
    date: "2026-07-10",
    author: "Tim Celeparty",
    category: "Audio & Sound",
    content: [
      {
        type: "heading",
        value: "Mengapa Sound System Itu Penting?",
      },
      {
        type: "paragraph",
        value:
          "Dalam setiap event, kualitas suara adalah salah satu faktor penentu keberhasilan acara. Tamu yang tidak bisa mendengar pembicara dengan jelas akan kehilangan minat. Musik yang pecah atau terlalu pelan bisa merusak suasana. Karena itu, memilih sound system yang tepat bukan sekadar soal budget — ini soal memahami kebutuhan akustik venue dan jenis acara Anda.",
      },
      {
        type: "heading",
        value: "Kenali Jenis Event Anda",
      },
      {
        type: "paragraph",
        value:
          "Sebelum menyewa sound system, tanyakan pada diri sendiri: acara apa yang sedang Anda selenggarakan? Berikut panduan singkatnya:",
      },
      {
        type: "list",
        value: "Jenis event dan rekomendasi sound system:",
        items: [
          "Seminar / Konferensi: Fokus pada kejelasan vokal. Anda butuh speaker yang punya mid-range jernih dan microphone wireless berkualitas.",
          "Pernikahan: Kombinasi vokal (MC, pembaca doa) dan musik (live band, DJ). Butuh sistem yang fleksibel dengan subwoofer untuk low-end.",
          "Konser Kecil / Gathering: Prioritaskan power output dan bass. Line array kecil sudah cukup untuk venue 200-500 orang.",
          "Pameran / Expo: Speaker distribusi kecil di beberapa titik lebih efektif daripada satu sistem besar.",
        ],
      },
      {
        type: "heading",
        value: "Hitung Kebutuhan Watt Berdasarkan Venue",
      },
      {
        type: "paragraph",
        value:
          "Rumus praktis: setiap tamu membutuhkan sekitar 5-10 watt untuk acara indoor, dan 10-20 watt untuk outdoor. Jadi untuk acara indoor dengan 300 tamu, Anda butuh sekitar 1.500-3.000 watt. Pastikan Anda juga mempertimbangkan faktor seperti tinggi plafon, material dinding (apakah banyak kaca atau beton?), dan apakah ada panggung.",
      },
      {
        type: "heading",
        value: "Kesimpulan",
      },
      {
        type: "paragraph",
        value:
          "Sound system yang baik adalah investasi untuk kesuksesan acara Anda. Jangan ragu untuk berkonsultasi dengan vendor audio profesional. Di Celeparty, Anda bisa menemukan berbagai pilihan vendor sound system dengan rating dan review yang transparan. Pilih sesuai budget dan kebutuhan, lalu fokuslah menikmati acara Anda.",
      },
    ],
    relatedProductSlugs: [
      "sound-system-profesional",
      "lighting-panggung",
    ],
  },
  "tren-dekorasi-event-2026": {
    slug: "tren-dekorasi-event-2026",
    title: "Tren Dekorasi Event 2026: Dari Rustic hingga Modern Minimalis",
    excerpt:
      "Tahun 2026 membawa warna baru dalam dunia dekorasi event. Simak tren terkini yang bisa Anda terapkan untuk pernikahan, ulang tahun, atau corporate gathering.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=533&fit=crop",
    date: "2026-07-08",
    author: "Tim Celeparty",
    category: "Dekorasi",
    content: [
      {
        type: "heading",
        value: "Tren Dekorasi 2026: Perpaduan Alam dan Teknologi",
      },
      {
        type: "paragraph",
        value:
          "Tahun 2026 menandai pergeseran signifikan dalam estetika dekorasi event. Dua kekuatan besar saling bertemu: keinginan kembali ke alam (rustic, sustainable) dan integrasi teknologi modern (LED walls, projection mapping). Hasilnya adalah gaya 'Eco-Chic' — dekorasi yang memukau secara visual namun sadar lingkungan.",
      },
      {
        type: "heading",
        value: "1. Rustic Modern (Rustic 2.0)",
      },
      {
        type: "paragraph",
        value:
          "Kayu palet masih digunakan, tapi sekarang dipadukan dengan aksen metalik seperti tembaga dan gold. Warna terakota dan sage green mendominasi palet, menggantikan dusty pink yang populer di tahun-tahun sebelumnya. Bunga kering (pampas, eucalyptus) semakin diminati karena tahan lebih lama dan bisa digunakan ulang.",
      },
      {
        type: "heading",
        value: "2. Minimalis Monokrom",
      },
      {
        type: "paragraph",
        value:
          "Untuk corporate event dan gala dinner, tren minimalis monokrom dengan sentuhan bold masih kuat. Pilih satu warna statement (cobalt blue, emerald green, atau burgundy) dan aplikasikan di focal point seperti backdrop panggung, table runner, atau hanging installation. Sisanya biarkan putih dan clean.",
      },
      {
        type: "heading",
        value: "3. Sustainable Decor",
      },
      {
        type: "paragraph",
        value:
          "Kesadaran lingkungan mendorong vendor dekorasi untuk beralih ke material daur ulang dan rental system. Bunga artifisial berkualitas tinggi semakin banyak digunakan karena bisa dipakai lintas event tanpa limbah. Kain dekorasi dari serat alami (linen, katun organik) menggantikan polyester.",
      },
      {
        type: "heading",
        value: "Kesimpulan",
      },
      {
        type: "paragraph",
        value:
          "Apapun tren yang Anda pilih, yang terpenting adalah dekorasi mencerminkan kepribadian penyelenggara dan membuat tamu merasa istimewa. Di Celeparty, Anda bisa menemukan vendor dekorasi terbaik dengan portofolio yang sesuai gaya Anda.",
      },
    ],
    relatedProductSlugs: [
      "dekorasi-pernikahan",
      "fotografer-event",
    ],
  },
  "panduan-catering-acara-kantor": {
    slug: "panduan-catering-acara-kantor",
    title: "Panduan Lengkap Catering untuk Acara Kantor",
    excerpt:
      "Memilih menu catering untuk acara kantor tidak boleh sembarangan. Pelajari cara menghitung porsi, memilih variasi menu, dan memastikan semua tamu terlayani dengan baik.",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&h=533&fit=crop",
    date: "2026-07-05",
    author: "Tim Celeparty",
    category: "Catering",
    content: [
      {
        type: "heading",
        value: "Catering Kantor: Lebih dari Sekadar Makan Siang",
      },
      {
        type: "paragraph",
        value:
          "Acara kantor — baik itu rapat tahunan, team building, atau perayaan ulang tahun perusahaan — seringkali diukur dari kualitas makanannya. Catering yang buruk bisa menjadi bahan keluhan berminggu-minggu. Sebaliknya, makanan yang lezat dan disajikan dengan baik bisa meningkatkan moral tim secara signifikan.",
      },
      {
        type: "heading",
        value: "Langkah 1: Tentukan Format Acara",
      },
      {
        type: "list",
        value: "Pilih format yang sesuai dengan jenis acara:",
        items: [
          "Standing Party / Networking: Pilih canapé dan finger food. Tamu bisa bergerak bebas sambil ngobrol. Hitung 8-12 pieces per orang.",
          "Buffet / Prasmanan: Format paling umum untuk acara kantor. Pastikan ada 1 stall per 50-75 orang untuk menghindari antrean panjang.",
          "Set Menu / Fine Dining: Cocok untuk executive dinner atau acara yang lebih intim (20-40 orang). Biaya per pax lebih tinggi tapi pengalaman lebih eksklusif.",
          "Box Meal / Nasi Kotak: Praktis untuk acara santai atau outdoor. Pastikan kemasan ramah lingkungan dan mudah dibawa.",
        ],
      },
      {
        type: "heading",
        value: "Langkah 2: Perhitungkan Jumlah Tamu dengan Akurat",
      },
      {
        type: "paragraph",
        value:
          "Selalu pesan untuk 10-15% lebih banyak dari jumlah tamu yang dikonfirmasi. Lebih baik kelebihan sedikit daripada kekurangan. Untuk acara perusahaan besar (200+ orang), rounding ke atas 25-50 porsi adalah praktik standar. Jika ada menu spesial (vegetarian, halal preference), konfirmasikan jumlahnya ke vendor catering minimal 5 hari sebelum acara.",
      },
      {
        type: "heading",
        value: "Kesimpulan",
      },
      {
        type: "paragraph",
        value:
          "Catering adalah investasi dalam kepuasan karyawan dan tamu Anda. Ambil waktu untuk tasting menu sebelum memutuskan vendor. Di Celeparty, Anda bisa memesan jasa catering profesional dengan berbagai pilihan menu — dari Nusantara hingga Internasional.",
      },
    ],
    relatedProductSlugs: [
      "catering-gathering",
      "mc-acara",
    ],
  },
};
