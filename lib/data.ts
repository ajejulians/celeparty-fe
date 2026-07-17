export interface Product {
	slug: string;
	name: string;
	category: string;
	city: string;
	date: string;
	imageUrl: string;
	priceFrom: number;
	rentalUnit: "Hari" | "Event" | "Bulan";
	isNegotiable: boolean;
	isActive: boolean;
	escrow: boolean;
	stock: number;
	totalStock: number;
	status: "active" | "sold_out" | "escrow_badge" | "inactive";
	variants: { name: string; price: number }[];
	description: string;
	vendorName: string;
	vendorId: string;
}

export function computeProductStatus(product: {
	isActive: boolean;
	escrow: boolean;
	stock: number;
}): Product["status"] {
	if (!product.isActive) return "inactive";
	if (product.escrow) return "escrow_badge";
	if (product.stock === 0) return "sold_out";
	return "active";
}

export interface Order {
	id: string;
	orderId: string;
	barcode: string;
	customer: string;
	product: string;
	productSlug: string;
	variant: string;
	qty: number;
	total: number;
	paymentStatus:
		| "pending"
		| "dp_pending"
		| "dp_paid"
		| "dp_refunded"
		| "fully_paid"
		| "settlement"
		| "failed"
		| "cancelled"
		| "expired";
	orderDate: string;
	eventDate: string;
	vendorStatus: "pending" | "approved" | "rejected";
	vendorName?: string;
	vendorId?: string;
	escrow: boolean;
	escrowStatus:
		| "none"
		| "dp_pending"
		| "dp_paid"
		| "dp_refunded"
		| "fully_paid"
		| "expired";
	dpAmount: number;
	remainingAmount: number;
}

export const products: Product[] = [
	{
		slug: "sound-system-profesional",
		name: "Sound System Profesional 5000W",
		category: "Audio & Sound",
		city: "Jakarta",
		date: "2026-08-12",
		imageUrl:
			"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=450&fit=crop",
		priceFrom: 2500000,
		rentalUnit: "Hari",
		isNegotiable: true,
		isActive: true,
		escrow: false,
		status: "active",
		variants: [
			{ name: "Reguler", price: 2500000 },
			{ name: "VIP", price: 4500000 },
		],
		description:
			"Paket sound system profesional untuk event Anda. Termasuk 2 speaker line array, mixer digital, dan teknisi berpengalaman.",
		vendorName: "Jakarta Audio Pro",
		vendorId: "v-001",
		stock: 2,
		totalStock: 5,
	},
	{
		slug: "fotografer-event",
		name: "Fotografer Event Premium",
		category: "Fotografi",
		city: "Bandung",
		date: "2026-09-05",
		imageUrl: "",
		priceFrom: 3500000,
		rentalUnit: "Event",
		isNegotiable: false,
		isActive: true,
		escrow: false,
		status: "active",
		variants: [
			{ name: "4 Jam", price: 3500000 },
			{ name: "8 Jam", price: 6000000 },
		],
		description:
			"Jasa fotografer profesional dengan pengalaman 5+ tahun di event pernikahan, ulang tahun, dan corporate gathering.",
		vendorName: "Bandung Visual Story",
		vendorId: "v-002",
		stock: 3,
		totalStock: 3,
	},
	{
		slug: "dekorasi-pernikahan",
		name: "Dekorasi Pernikahan Rustic",
		category: "Dekorasi",
		city: "Surabaya",
		date: "2026-10-20",
		imageUrl:
			"https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=450&fit=crop",
		priceFrom: 15000000,
		rentalUnit: "Event",
		isNegotiable: true,
		isActive: true,
		escrow: true,
		status: "escrow_badge",
		variants: [
			{ name: "Paket Basic", price: 15000000 },
			{ name: "Paket Premium", price: 28000000 },
		],
		description:
			"Dekorasi pernikahan tema rustic lengkap dengan bunga segar, lighting, dan pelaminan custom.",
		vendorName: "Surabaya Decor House",
		vendorId: "v-003",
		stock: 1,
		totalStock: 10,
	},
	{
		slug: "catering-gathering",
		name: "Catering Gathering 100 Pax",
		category: "Catering",
		city: "Jakarta",
		date: "2026-08-28",
		imageUrl:
			"https://images.unsplash.com/photo-1555244162-803834f70033?w=600&h=450&fit=crop",
		priceFrom: 8500000,
		rentalUnit: "Event",
		isNegotiable: true,
		isActive: true,
		escrow: false,
		status: "active",
		variants: [
			{ name: "Menu Nusantara", price: 8500000 },
			{ name: "Menu Internasional", price: 12000000 },
		],
		description:
			"Paket catering untuk acara gathering perusahaan. Menu prasmanan lengkap dengan dessert dan minuman.",
		vendorName: "Citarasa Nusantara",
		vendorId: "v-004",
		stock: 5,
		totalStock: 5,
	},
	{
		slug: "mc-acara",
		name: "MC Profesional Event",
		category: "Entertainment",
		city: "Yogyakarta",
		date: "2026-09-15",
		imageUrl: "",
		priceFrom: 2000000,
		rentalUnit: "Event",
		isNegotiable: false,
		isActive: true,
		escrow: false,
		status: "active",
		variants: [
			{ name: "3 Jam", price: 2000000 },
			{ name: "6 Jam", price: 3500000 },
		],
		description:
			"MC berpengalaman untuk berbagai jenis acara — formal, semi-formal, hingga casual. Bisa dwi-bahasa.",
		vendorName: "Jogja Talent House",
		vendorId: "v-005",
		stock: 2,
		totalStock: 2,
	},
	{
		slug: "photo-booth",
		name: "Photo Booth 360°",
		category: "Entertainment",
		city: "Jakarta",
		date: "2026-11-01",
		imageUrl:
			"https://images.unsplash.com/photo-1496843916299-590492c751f4?w=600&h=450&fit=crop",
		priceFrom: 5000000,
		rentalUnit: "Event",
		isNegotiable: false,
		isActive: true,
		escrow: false,
		status: "sold_out",
		variants: [
			{ name: "Reguler (3 Jam)", price: 5000000 },
			{ name: "Full Day", price: 8500000 },
		],
		description:
			"Photo booth 360° dengan platform putar, lighting profesional, dan instant sharing ke media sosial.",
		vendorName: "Jakarta Fun Booth",
		vendorId: "v-001",
		stock: 0,
		totalStock: 3,
	},
	{
		slug: "lighting-panggung",
		name: "Lighting Panggung Profesional",
		category: "Audio & Sound",
		city: "Bandung",
		date: "2026-08-20",
		imageUrl:
			"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&h=450&fit=crop",
		priceFrom: 4000000,
		rentalUnit: "Hari",
		isNegotiable: true,
		isActive: true,
		escrow: false,
		status: "active",
		variants: [
			{ name: "Paket Standar", price: 4000000 },
			{ name: "Paket Full", price: 7500000 },
		],
		description:
			"Lighting panggung lengkap dengan moving head, LED par, smoke machine, dan operator lighting.",
		vendorName: "Bandung Stage Lighting",
		vendorId: "v-002",
		stock: 4,
		totalStock: 8,
	},
	{
		slug: "videografer-event",
		name: "Videografer Event Cinematic",
		category: "Fotografi",
		city: "Surabaya",
		date: "2026-10-10",
		imageUrl: "",
		priceFrom: 4500000,
		rentalUnit: "Event",
		isNegotiable: true,
		isActive: true,
		escrow: false,
		status: "active",
		variants: [
			{ name: "Highlight 3 Menit", price: 4500000 },
			{ name: "Full Documentation", price: 8500000 },
		],
		description:
			"Videografer dengan gaya cinematic, drone aerial, dan cinematic color grading.",
		vendorName: "Surabaya Film Works",
		vendorId: "v-003",
		stock: 1,
		totalStock: 4,
	},
	{
		slug: "tenda-kerucut",
		name: "Tenda Kerucut VIP 10x10",
		category: "Sewa Alat",
		city: "Jakarta",
		date: "2026-08-15",
		imageUrl: "",
		priceFrom: 1200000,
		rentalUnit: "Hari",
		isNegotiable: true,
		isActive: true,
		escrow: false,
		status: "active",
		variants: [
			{ name: "Standar", price: 1200000 },
			{ name: "Dekor", price: 1800000 },
		],
		description:
			"Tenda kerucut mewah kapasitas 40-60 orang, cocok untuk garden party dan acara outdoor.",
		vendorName: "Jakarta Audio Pro",
		vendorId: "v-001",
		stock: 6,
		totalStock: 20,
	},
	{
		slug: "kursi-tiffany",
		name: "Kursi Tiffany Premium",
		category: "Sewa Alat",
		city: "Jakarta",
		date: "2026-09-01",
		imageUrl:
			"https://images.unsplash.com/photo-1464699908537-0954e50791ee?w=600&h=450&fit=crop",
		priceFrom: 35000,
		rentalUnit: "Hari",
		isNegotiable: false,
		isActive: true,
		escrow: false,
		status: "active",
		variants: [
			{ name: "Per Unit", price: 35000 },
			{ name: "Paket 50", price: 1500000 },
		],
		description:
			"Kursi Tiffany elegan untuk wedding, gala dinner, dan event formal.",
		vendorName: "Jakarta Audio Pro",
		vendorId: "v-001",
		stock: 30,
		totalStock: 100,
	},
	{
		slug: "meja-vip",
		name: "Meja VIP Event",
		category: "Sewa Alat",
		city: "Jakarta",
		date: "2026-09-01",
		imageUrl: "",
		priceFrom: 500000,
		rentalUnit: "Hari",
		isNegotiable: false,
		isActive: false,
		escrow: false,
		status: "inactive",
		variants: [{ name: "Standar", price: 500000 }],
		description: "Meja VIP untuk acara formal dan informal.",
		vendorName: "Jakarta Audio Pro",
		vendorId: "v-001",
		stock: 0,
		totalStock: 10,
	},
];

export const orders: Order[] = [
	{
		id: "ord-001",
		orderId: "INV-20260812-001",
		barcode: "CTix-20260812-A8F2E1C9",
		customer: "Budi Santoso",
		product: "Sound System Profesional 5000W",
		productSlug: "sound-system-profesional",
		variant: "Reguler",
		qty: 1,
		total: 2500000,
		paymentStatus: "fully_paid",
		orderDate: "2026-07-10",
		eventDate: "2026-08-12",
		vendorStatus: "approved",
		vendorName: "Jakarta Audio Pro",
		vendorId: "v-001",
		escrow: true,
		escrowStatus: "fully_paid",
		dpAmount: 750000,
		remainingAmount: 1750000,
	},
	{
		id: "ord-002",
		orderId: "INV-20260905-002",
		barcode: "CTix-20260905-B3D7F2A1",
		customer: "Siti Nurhaliza",
		product: "Fotografer Event Premium",
		productSlug: "fotografer-event",
		variant: "8 Jam",
		qty: 1,
		total: 6000000,
		paymentStatus: "pending",
		orderDate: "2026-07-08",
		eventDate: "2026-09-05",
		vendorStatus: "pending",
		vendorName: "Bandung Visual Story",
		vendorId: "v-002",
		escrow: false,
		escrowStatus: "none",
		dpAmount: 0,
		remainingAmount: 0,
	},
	{
		id: "ord-003",
		orderId: "INV-20261020-003",
		barcode: "CTix-20261020-C4E8G3B2",
		customer: "Ahmad Fauzi",
		product: "Dekorasi Pernikahan Rustic",
		productSlug: "dekorasi-pernikahan",
		variant: "Paket Premium",
		qty: 1,
		total: 28000000,
		paymentStatus: "dp_paid",
		orderDate: "2026-07-05",
		eventDate: "2026-10-20",
		vendorStatus: "approved",
		vendorName: "Surabaya Decor House",
		vendorId: "v-003",
		escrow: true,
		escrowStatus: "dp_paid",
		dpAmount: 8400000,
		remainingAmount: 19600000,
	},
	{
		id: "ord-004",
		orderId: "INV-20260828-004",
		barcode: "CTix-20260828-D5F9H4C3",
		customer: "Mega Corp Indonesia",
		product: "Catering Gathering 100 Pax",
		productSlug: "catering-gathering",
		variant: "Menu Nusantara",
		qty: 2,
		total: 17000000,
		paymentStatus: "dp_pending",
		orderDate: "2026-07-12",
		eventDate: "2026-08-28",
		vendorStatus: "pending",
		vendorName: "Citarasa Nusantara",
		vendorId: "v-004",
		escrow: true,
		escrowStatus: "dp_pending",
		dpAmount: 5100000,
		remainingAmount: 11900000,
	},
	{
		id: "ord-005",
		orderId: "INV-20260915-005",
		barcode: "CTix-20260915-E6G0I5D4",
		customer: "Dewi Lestari",
		product: "MC Profesional Event",
		productSlug: "mc-acara",
		variant: "6 Jam",
		qty: 1,
		total: 3500000,
		paymentStatus: "failed",
		orderDate: "2026-07-09",
		eventDate: "2026-09-15",
		vendorStatus: "rejected",
		vendorName: "Jogja Talent House",
		vendorId: "v-005",
		escrow: false,
		escrowStatus: "none",
		dpAmount: 0,
		remainingAmount: 0,
	},
	{
		id: "ord-006",
		orderId: "INV-20260820-006",
		barcode: "CTix-20260820-F7H1J6E5",
		customer: "Rudi Hartono",
		product: "Lighting Panggung Profesional",
		productSlug: "lighting-panggung",
		variant: "Paket Full",
		qty: 1,
		total: 7500000,
		paymentStatus: "pending",
		orderDate: "2026-07-11",
		eventDate: "2026-08-20",
		vendorStatus: "pending",
		vendorName: "Bandung Stage Lighting",
		vendorId: "v-002",
		escrow: false,
		escrowStatus: "none",
		dpAmount: 0,
		remainingAmount: 0,
	},
	{
		id: "ord-007",
		orderId: "INV-20261010-007",
		barcode: "CTix-20261010-G8I2K7F6",
		customer: "PT Sentosa Jaya",
		product: "Videografer Event Cinematic",
		productSlug: "videografer-event",
		variant: "Full Documentation",
		qty: 1,
		total: 8500000,
		paymentStatus: "fully_paid",
		orderDate: "2026-07-07",
		eventDate: "2026-10-10",
		vendorStatus: "approved",
		vendorName: "Surabaya Film Works",
		vendorId: "v-003",
		escrow: false,
		escrowStatus: "none",
		dpAmount: 0,
		remainingAmount: 0,
	},
	{
		id: "ord-008",
		orderId: "INV-20260717-008",
		barcode: "CTix-20260717-H9J3L8M7",
		customer: "Andi Wijaya",
		product: "Photo Booth 360°",
		productSlug: "photo-booth",
		variant: "Reguler (3 Jam)",
		qty: 1,
		total: 5000000,
		paymentStatus: "expired",
		orderDate: "2026-07-01",
		eventDate: "2026-07-10",
		vendorStatus: "pending",
		vendorName: "Jakarta Fun Booth",
		vendorId: "v-001",
		escrow: true,
		escrowStatus: "expired",
		dpAmount: 1500000,
		remainingAmount: 3500000,
	},
	{
		id: "ord-009",
		orderId: "INV-20260717-009",
		barcode: "CTix-20260717-K4M5N9P2",
		customer: "Putri Amelia",
		product: "Tenda Kerucut VIP 10x10",
		productSlug: "tenda-kerucut",
		variant: "Standar",
		qty: 1,
		total: 1200000,
		paymentStatus: "dp_refunded",
		orderDate: "2026-07-02",
		eventDate: "2026-08-15",
		vendorStatus: "rejected",
		vendorName: "Jakarta Audio Pro",
		vendorId: "v-001",
		escrow: true,
		escrowStatus: "dp_refunded",
		dpAmount: 360000,
		remainingAmount: 840000,
	},
];

export const getProductsByVendor = (vendorId: string) => {
	return products.filter((p) => p.vendorId === vendorId);
};

export const getOrdersByVendor = (vendorId: string) => {
	return orders.filter((o) => o.vendorId === vendorId);
};

export interface EventData {
	slug: string;
	title: string;
	category: string;
	location: string;
	date: string;
	time: string;
	imageUrl: string;
	priceFrom: number;
	organizer: string;
	description: string;
	status: "upcoming" | "ongoing" | "past";
}

export const events: EventData[] = [
	{
		slug: "music-fest-2026",
		title: "Jakarta Summer Music Fest 2026",
		category: "Konser Musik",
		location: "GBK Senayan, Jakarta",
		date: "2026-08-20",
		time: "15:00 - 23:00 WIB",
		imageUrl: "https://placehold.co/800x600/3E2882/FFF.png?text=Music+Festival",
		priceFrom: 250000,
		organizer: "Live Nation Indonesia",
		description:
			"Festival musik musim panas terbesar di Jakarta menampilkan deretan artis ternama dari dalam dan luar negeri. Nikmati pengalaman konser yang tak terlupakan bersama ribuan penikmat musik lainnya.",
		status: "upcoming",
	},
	{
		slug: "tech-startup-summit",
		title: "Tech & Startup Summit 2026",
		category: "Konferensi",
		location: "JCC Senayan, Jakarta",
		date: "2026-09-10",
		time: "09:00 - 17:00 WIB",
		imageUrl: "https://placehold.co/800x600/3E2882/FFF.png?text=Tech+Summit",
		priceFrom: 150000,
		organizer: "TechIndo Media",
		description:
			"Konferensi teknologi tahunan yang mempertemukan para founder startup, investor, dan tech enthusiast. Dapatkan insight terbaru dari para ahli di industri teknologi.",
		status: "upcoming",
	},
	{
		slug: "food-carnival",
		title: "Nusantara Food Carnival",
		category: "Pameran & Bazar",
		location: "Lapangan Banteng, Jakarta",
		date: "2026-07-25",
		time: "10:00 - 22:00 WIB",
		imageUrl: "https://placehold.co/800x600/3E2882/FFF.png?text=Food+Carnival",
		priceFrom: 35000,
		organizer: "Kuliner Kita",
		description:
			"Jelajahi keanekaragaman kuliner Nusantara dalam satu tempat. Terdapat lebih dari 100 tenant makanan dan minuman tradisional hingga kekinian.",
		status: "upcoming",
	},
	{
		slug: "indie-art-market",
		title: "Indie Art Market & Workshop",
		category: "Seni & Budaya",
		location: "M Bloc Space, Jakarta",
		date: "2026-08-05",
		time: "13:00 - 21:00 WIB",
		imageUrl: "https://placehold.co/800x600/3E2882/FFF.png?text=Art+Market",
		priceFrom: 50000,
		organizer: "Kolektif Seni JKT",
		description:
			"Bazar seni independen yang menghadirkan karya-karya seniman lokal, mulai dari ilustrasi, keramik, hingga pakaian eksklusif. Tersedia juga berbagai kelas workshop kreatif.",
		status: "upcoming",
	},
];
