export interface Product {
  slug: string;
  name: string;
  category: string;
  city: string;
  date: string;
  imageUrl: string;
  priceFrom: number;
  status: "active" | "sold_out" | "escrow_badge";
  variants: { name: string; price: number }[];
  description: string;
  vendorName: string;
}

export interface Order {
  id: string;
  orderId: string;
  barcode: string;
  customer: string;
  product: string;
  variant: string;
  qty: number;
  total: number;
  paymentStatus: "pending" | "settlement" | "failed" | "cancelled";
  orderDate: string;
  eventDate: string;
  vendorStatus: "pending" | "approved" | "rejected";
}

export const products: Product[] = [
  {
    slug: "sound-system-profesional",
    name: "Sound System Profesional 5000W",
    category: "Audio & Sound",
    city: "Jakarta",
    date: "2026-08-12",
    imageUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=450&fit=crop",
    priceFrom: 2500000,
    status: "active",
    variants: [
      { name: "Reguler", price: 2500000 },
      { name: "VIP", price: 4500000 },
    ],
    description: "Paket sound system profesional untuk event Anda. Termasuk 2 speaker line array, mixer digital, dan teknisi berpengalaman.",
    vendorName: "Jakarta Audio Pro",
  },
  {
    slug: "fotografer-event",
    name: "Fotografer Event Premium",
    category: "Fotografi",
    city: "Bandung",
    date: "2026-09-05",
    imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=450&fit=crop",
    priceFrom: 3500000,
    status: "active",
    variants: [
      { name: "4 Jam", price: 3500000 },
      { name: "8 Jam", price: 6000000 },
    ],
    description: "Jasa fotografer profesional dengan pengalaman 5+ tahun di event pernikahan, ulang tahun, dan corporate gathering.",
    vendorName: "Bandung Visual Story",
  },
  {
    slug: "dekorasi-pernikahan",
    name: "Dekorasi Pernikahan Rustic",
    category: "Dekorasi",
    city: "Surabaya",
    date: "2026-10-20",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=450&fit=crop",
    priceFrom: 15000000,
    status: "escrow_badge",
    variants: [
      { name: "Paket Basic", price: 15000000 },
      { name: "Paket Premium", price: 28000000 },
    ],
    description: "Dekorasi pernikahan tema rustic lengkap dengan bunga segar, lighting, dan pelaminan custom.",
    vendorName: "Surabaya Decor House",
  },
  {
    slug: "catering-gathering",
    name: "Catering Gathering 100 Pax",
    category: "Catering",
    city: "Jakarta",
    date: "2026-08-28",
    imageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=450&fit=crop",
    priceFrom: 8500000,
    status: "active",
    variants: [
      { name: "Menu Nusantara", price: 8500000 },
      { name: "Menu Internasional", price: 12000000 },
    ],
    description: "Paket catering untuk acara gathering perusahaan. Menu prasmanan lengkap dengan dessert dan minuman.",
    vendorName: "Citarasa Nusantara",
  },
  {
    slug: "mc-acara",
    name: "MC Profesional Event",
    category: "Entertainment",
    city: "Yogyakarta",
    date: "2026-09-15",
    imageUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&h=450&fit=crop",
    priceFrom: 2000000,
    status: "active",
    variants: [
      { name: "3 Jam", price: 2000000 },
      { name: "6 Jam", price: 3500000 },
    ],
    description: "MC berpengalaman untuk berbagai jenis acara — formal, semi-formal, hingga casual. Bisa dwi-bahasa.",
    vendorName: "Jogja Talent House",
  },
  {
    slug: "photo-booth",
    name: "Photo Booth 360°",
    category: "Entertainment",
    city: "Jakarta",
    date: "2026-11-01",
    imageUrl: "https://images.unsplash.com/photo-1496843916299-590492c751f4?w=600&h=450&fit=crop",
    priceFrom: 5000000,
    status: "sold_out",
    variants: [
      { name: "Reguler (3 Jam)", price: 5000000 },
      { name: "Full Day", price: 8500000 },
    ],
    description: "Photo booth 360° dengan platform putar, lighting profesional, dan instant sharing ke media sosial.",
    vendorName: "Jakarta Fun Booth",
  },
  {
    slug: "lighting-panggung",
    name: "Lighting Panggung Profesional",
    category: "Audio & Sound",
    city: "Bandung",
    date: "2026-08-20",
    imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=450&fit=crop",
    priceFrom: 4000000,
    status: "active",
    variants: [
      { name: "Paket Standar", price: 4000000 },
      { name: "Paket Full", price: 7500000 },
    ],
    description: "Lighting panggung lengkap dengan moving head, LED par, smoke machine, dan operator lighting.",
    vendorName: "Bandung Stage Lighting",
  },
  {
    slug: "videografer-event",
    name: "Videografer Event Cinematic",
    category: "Fotografi",
    city: "Surabaya",
    date: "2026-10-10",
    imageUrl: "https://images.unsplash.com/photo-1492724724894-7464c27d0ceb?w=600&h=450&fit=crop",
    priceFrom: 4500000,
    status: "active",
    variants: [
      { name: "Highlight 3 Menit", price: 4500000 },
      { name: "Full Documentation", price: 8500000 },
    ],
    description: "Videografer dengan gaya cinematic, drone aerial, dan cinematic color grading.",
    vendorName: "Surabaya Film Works",
  },
];

export const orders: Order[] = [
  {
    id: "ord-001",
    orderId: "INV-20260812-001",
    barcode: "CTix-20260812-A8F2E1C9",
    customer: "Budi Santoso",
    product: "Sound System Profesional 5000W",
    variant: "Reguler",
    qty: 1,
    total: 2500000,
    paymentStatus: "settlement",
    orderDate: "2026-07-10",
    eventDate: "2026-08-12",
    vendorStatus: "approved",
  },
  {
    id: "ord-002",
    orderId: "INV-20260905-002",
    barcode: "CTix-20260905-B3D7F2A1",
    customer: "Siti Nurhaliza",
    product: "Fotografer Event Premium",
    variant: "8 Jam",
    qty: 1,
    total: 6000000,
    paymentStatus: "pending",
    orderDate: "2026-07-08",
    eventDate: "2026-09-05",
    vendorStatus: "pending",
  },
  {
    id: "ord-003",
    orderId: "INV-20261020-003",
    barcode: "CTix-20261020-C4E8G3B2",
    customer: "Ahmad Fauzi",
    product: "Dekorasi Pernikahan Rustic",
    variant: "Paket Premium",
    qty: 1,
    total: 28000000,
    paymentStatus: "settlement",
    orderDate: "2026-07-05",
    eventDate: "2026-10-20",
    vendorStatus: "approved",
  },
  {
    id: "ord-004",
    orderId: "INV-20260828-004",
    barcode: "CTix-20260828-D5F9H4C3",
    customer: "Mega Corp Indonesia",
    product: "Catering Gathering 100 Pax",
    variant: "Menu Nusantara",
    qty: 2,
    total: 17000000,
    paymentStatus: "settlement",
    orderDate: "2026-07-12",
    eventDate: "2026-08-28",
    vendorStatus: "approved",
  },
  {
    id: "ord-005",
    orderId: "INV-20260915-005",
    barcode: "CTix-20260915-E6G0I5D4",
    customer: "Dewi Lestari",
    product: "MC Profesional Event",
    variant: "6 Jam",
    qty: 1,
    total: 3500000,
    paymentStatus: "failed",
    orderDate: "2026-07-09",
    eventDate: "2026-09-15",
    vendorStatus: "rejected",
  },
  {
    id: "ord-006",
    orderId: "INV-20260820-006",
    barcode: "CTix-20260820-F7H1J6E5",
    customer: "Rudi Hartono",
    product: "Lighting Panggung Profesional",
    variant: "Paket Full",
    qty: 1,
    total: 7500000,
    paymentStatus: "pending",
    orderDate: "2026-07-11",
    eventDate: "2026-08-20",
    vendorStatus: "pending",
  },
  {
    id: "ord-007",
    orderId: "INV-20261010-007",
    barcode: "CTix-20261010-G8I2K7F6",
    customer: "PT Sentosa Jaya",
    product: "Videografer Event Cinematic",
    variant: "Full Documentation",
    qty: 1,
    total: 8500000,
    paymentStatus: "settlement",
    orderDate: "2026-07-07",
    eventDate: "2026-10-10",
    vendorStatus: "approved",
  },
];
