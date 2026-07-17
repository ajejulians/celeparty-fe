export interface TicketCategory {
	name: string;
	price: number;
	quota: number;
	sold: number;
	saleStart: string;
	saleEnd: string;
	benefits: string;
}

export interface TicketEntry {
	id: string;
	barcode: string;
	buyerName: string;
	buyerEmail: string;
	category: string;
	price: number;
	verificationStatus: "unused" | "verified" | "invalid" | "duplicate";
	paymentStatus: "pending" | "paid" | "refunded" | "cancelled";
	ticketStatus: "active" | "used" | "cancelled";
	status:
		| "pending"
		| "checked_in"
		| "invalid"
		| "duplicate"
		| "cancelled"
		| "refunded";
	purchaseDate: string;
	eventId: string;
}

export function computeTicketDisplayStatus(ticket: {
	verificationStatus: string;
	ticketStatus: string;
	paymentStatus: string;
}): TicketEntry["status"] {
	if (ticket.ticketStatus === "cancelled") return "cancelled";
	if (ticket.paymentStatus === "refunded") return "refunded";
	if (ticket.verificationStatus === "duplicate") return "duplicate";
	if (ticket.verificationStatus === "invalid") return "invalid";
	if (
		ticket.verificationStatus === "verified" ||
		ticket.ticketStatus === "used"
	)
		return "checked_in";
	return "pending";
}

export interface EventStatus {
	label: string;
	className: string;
}

export interface VendorEvent {
	id: string;
	name: string;
	venue: string;
	gmapsLink: string;
	date: string;
	time: string;
	endDate: string;
	endTime: string;
	vendorId: string;
	banner: string | null;
	eventCategory: string;
	description: string;
	terms: string;
	state: "pending" | "approved" | "rejected";
	isActive: boolean;
	publishedAt: string | null;
	status: "upcoming" | "ongoing" | "finished" | "draft" | "rejected";
	categories: TicketCategory[];
}

export function computeEventStatus(event: {
	state: string;
	isActive: boolean;
	publishedAt: string | null;
	date: string;
	endDate: string;
}): VendorEvent["status"] {
	if (event.state === "rejected") return "rejected";
	if (event.publishedAt === null || event.state === "pending") return "draft";
	if (!event.isActive) return "finished";
	const now = new Date();
	const start = new Date(event.date);
	const end = new Date(event.endDate);
	if (now < start) return "upcoming";
	if (now >= start && now <= end) return "ongoing";
	return "finished";
}

export const CATEGORY_BADGE_COLORS: Record<string, string> = {
	VIP: "bg-indigo-100 text-indigo-700 border-indigo-200",
	VVIP: "bg-purple-100 text-purple-700 border-purple-200",
	Reguler: "bg-emerald-100 text-emerald-700 border-emerald-200",
	"Early Bird": "bg-amber-100 text-amber-700 border-amber-200",
	"Presale 1": "bg-sky-100 text-sky-700 border-sky-200",
	"Presale 2": "bg-rose-100 text-rose-700 border-rose-200",
	Tribun: "bg-teal-100 text-teal-700 border-teal-200",
	Festival: "bg-orange-100 text-orange-700 border-orange-200",
	Platinum: "bg-violet-100 text-violet-700 border-violet-200",
};

export const EVENT_STATUS_MAP: Record<VendorEvent["status"], EventStatus> = {
	upcoming: {
		label: "Akan Datang",
		className: "bg-indigo-100 text-indigo-700 border-indigo-200",
	},
	ongoing: {
		label: "Aktif",
		className: "bg-emerald-100 text-emerald-700 border-emerald-200",
	},
	finished: {
		label: "Selesai",
		className: "bg-slate-100 text-slate-700 border-slate-200",
	},
	draft: {
		label: "Draft",
		className: "bg-amber-100 text-amber-700 border-amber-200",
	},
	rejected: {
		label: "Ditolak",
		className: "bg-red-100 text-red-700 border-red-200",
	},
};

export const EVENT_CATEGORIES = [
	"Konser Musik",
	"Seminar & Konferensi",
	"Pameran & Bazar",
	"Festival",
	"Workshop",
	"Olahraga",
	"Teater & Seni",
	"Lainnya",
] as const;

export const vendorEvents: VendorEvent[] = [
	{
		id: "evt-001",
		name: "Java Jazz Festival 2026",
		venue: "JIExpo Kemayoran, Jakarta",
		gmapsLink: "https://maps.google.com/?q=JIExpo+Kemayoran",
		date: "2026-07-15",
		time: "15:00 - 23:00 WIB",
		endDate: "2026-07-20",
		endTime: "23:00 WIB",
		vendorId: "v-001",
		banner: null,
		eventCategory: "Konser Musik",
		description:
			"Festival jazz tahunan terbesar di Asia Tenggara menampilkan puluhan musisi jazz internasional dan lokal dalam tiga panggung simultan.",
		terms:
			"Tiket tidak dapat dikembalikan. Anak di bawah 12 tahun wajib didampingi. Tiket VIP termasuk akses lounge eksklusif dan welcome drink.",
		state: "approved",
		isActive: true,
		publishedAt: "2026-06-01",
		status: "ongoing",
		categories: [
			{
				name: "VIP",
				price: 750000,
				quota: 500,
				sold: 412,
				saleStart: "2026-06-01",
				saleEnd: "2026-08-14",
				benefits:
					"Akses lounge eksklusif, welcome drink, merchandise eksklusif",
			},
			{
				name: "Reguler",
				price: 250000,
				quota: 3000,
				sold: 2841,
				saleStart: "2026-06-01",
				saleEnd: "2026-08-14",
				benefits: "Akses seluruh panggung, area festival",
			},
			{
				name: "VVIP",
				price: 1500000,
				quota: 100,
				sold: 89,
				saleStart: "2026-06-01",
				saleEnd: "2026-08-14",
				benefits: "Backstage pass, dinner with artists, limited edition vinyl",
			},
		],
	},
	{
		id: "evt-002",
		name: "Ultra Beach Bali 2026",
		venue: "Pantai Kuta, Bali",
		gmapsLink: "https://maps.google.com/?q=Pantai+Kuta+Bali",
		date: "2026-09-20",
		time: "17:00 - 02:00 WITA",
		endDate: "2026-09-21",
		endTime: "02:00 WITA",
		vendorId: "v-001",
		banner: null,
		eventCategory: "Festival",
		description:
			"Festival musik elektronik di tepi pantai dengan DJ kelas dunia, lighting spectacular, dan after party eksklusif.",
		terms:
			"Usia minimum 18 tahun. Dilarang membawa makanan & minuman dari luar. Tiket Presale tidak dapat di-refund.",
		state: "approved",
		isActive: true,
		publishedAt: "2026-07-01",
		status: "upcoming",
		categories: [
			{
				name: "VIP",
				price: 1200000,
				quota: 300,
				sold: 178,
				saleStart: "2026-07-01",
				saleEnd: "2026-09-19",
				benefits:
					"Fast track entry, VIP deck dengan view panggung terbaik, free flow drinks",
			},
			{
				name: "Presale 1",
				price: 400000,
				quota: 1000,
				sold: 1000,
				saleStart: "2026-07-01",
				saleEnd: "2026-08-01",
				benefits: "Harga spesial early bird, tidak termasuk merchandise",
			},
			{
				name: "Presale 2",
				price: 600000,
				quota: 1500,
				sold: 843,
				saleStart: "2026-08-02",
				saleEnd: "2026-09-19",
				benefits: "Harga spesial tahap 2, tidak termasuk merchandise",
			},
		],
	},
	{
		id: "evt-003",
		name: "Comic Con Indonesia 2026",
		venue: "ICE BSD, Tangerang",
		gmapsLink: "https://maps.google.com/?q=ICE+BSD+Tangerang",
		date: "2026-10-05",
		time: "10:00 - 21:00 WIB",
		endDate: "2026-10-06",
		endTime: "21:00 WIB",
		vendorId: "v-001",
		banner: null,
		eventCategory: "Pameran & Bazar",
		description:
			"Konvensi pop culture terbesar di Indonesia. Cosplay competition, exclusive merchandise, artist alley, dan panel diskusi.",
		terms:
			"Tiket berlaku untuk 1 hari. Cosplayer wajib mendaftar di entrance khusus. Merchandise eksklusif terbatas.",
		state: "approved",
		isActive: true,
		publishedAt: "2026-08-15",
		status: "upcoming",
		categories: [
			{
				name: "VIP",
				price: 500000,
				quota: 200,
				sold: 95,
				saleStart: "2026-08-15",
				saleEnd: "2026-10-04",
				benefits: "Early entry, exclusive comic book, meet & greet prioritas",
			},
			{
				name: "Reguler",
				price: 150000,
				quota: 5000,
				sold: 1876,
				saleStart: "2026-08-15",
				saleEnd: "2026-10-04",
				benefits: "Akses seluruh area pameran & panel",
			},
			{
				name: "Early Bird",
				price: 100000,
				quota: 2000,
				sold: 2000,
				saleStart: "2026-08-15",
				saleEnd: "2026-09-01",
				benefits: "Harga promo terbatas, akses seluruh area",
			},
		],
	},
	{
		id: "evt-004",
		name: "Soundrenaline 2026",
		venue: "Parkir Timur Senayan, Jakarta",
		gmapsLink: "https://maps.google.com/?q=Parkir+Timur+Senayan+Jakarta",
		date: "2026-11-14",
		time: "14:00 - 00:00 WIB",
		endDate: "2026-11-15",
		endTime: "00:00 WIB",
		vendorId: "v-001",
		banner: null,
		eventCategory: "Konser Musik",
		description:
			"Festival musik multi-genre menghadirkan band indie, rock, pop dan electronic dari seluruh Indonesia.",
		terms:
			"Tiket tidak dapat dipindahtangankan. Gate dibuka pukul 13:00. Bawa KTP asli untuk verifikasi.",
		state: "pending",
		isActive: false,
		publishedAt: null,
		status: "draft",
		categories: [
			{
				name: "Festival",
				price: 350000,
				quota: 5000,
				sold: 0,
				saleStart: "2026-09-10",
				saleEnd: "2026-11-13",
				benefits: "Akses all stage, area festival",
			},
			{
				name: "VIP",
				price: 900000,
				quota: 500,
				sold: 0,
				saleStart: "2026-09-10",
				saleEnd: "2026-11-13",
				benefits: "Viewing deck eksklusif, merchandise bundle, fast track",
			},
		],
	},
	{
		id: "evt-005",
		name: "Tech Leaders Summit Jakarta 2026",
		venue: "Balai Kartini, Jakarta",
		gmapsLink: "https://maps.google.com/?q=Balai+Kartini+Jakarta",
		date: "2026-12-02",
		time: "09:00 - 17:00 WIB",
		endDate: "2026-12-03",
		endTime: "17:00 WIB",
		vendorId: "v-001",
		banner: null,
		eventCategory: "Seminar & Konferensi",
		description:
			"Konferensi teknologi terkemuka yang menghadirkan pembicara dari Google, AWS, GoTo, dan startup unicorn Indonesia.",
		terms:
			"Tiket berlaku untuk 1 hari. Rekaman sesi tersedia 7 hari pasca acara. Sertifikat digital untuk semua peserta.",
		state: "approved",
		isActive: false,
		publishedAt: "2026-10-01",
		status: "finished",
		categories: [
			{
				name: "Platinum",
				price: 2500000,
				quota: 50,
				sold: 50,
				saleStart: "2026-10-01",
				saleEnd: "2026-12-01",
				benefits:
					"Lunch with speakers, front row seat, exclusive networking dinner",
			},
			{
				name: "Reguler",
				price: 750000,
				quota: 300,
				sold: 287,
				saleStart: "2026-10-01",
				saleEnd: "2026-12-01",
				benefits: "Akses semua sesi, coffee break, e-certificate",
			},
		],
	},
	{
		id: "evt-006",
		name: "Indie Music Fest 2026",
		venue: "Lapangan Banteng, Jakarta",
		gmapsLink: "https://maps.google.com/?q=Lapangan+Banteng+Jakarta",
		date: "2026-08-01",
		time: "10:00 - 22:00 WIB",
		endDate: "2026-08-02",
		endTime: "22:00 WIB",
		vendorId: "v-001",
		banner: null,
		eventCategory: "Konser Musik",
		description:
			"Festival musik indie terbesar dengan puluhan band lokal dan internasional.",
		terms: "Tiket tidak dapat dikembalikan. Usia minimum 15 tahun.",
		state: "rejected",
		isActive: false,
		publishedAt: null,
		status: "rejected",
		categories: [
			{
				name: "VIP",
				price: 500000,
				quota: 100,
				sold: 0,
				saleStart: "2026-06-01",
				saleEnd: "2026-07-31",
				benefits: "Akses backstage, meet & greet",
			},
			{
				name: "Reguler",
				price: 150000,
				quota: 1000,
				sold: 0,
				saleStart: "2026-06-01",
				saleEnd: "2026-07-31",
				benefits: "Akses seluruh area festival",
			},
		],
	},
];

export const ticketManifest: TicketEntry[] = [
	{
		id: "t-001",
		barcode: "CP-JJ26-0001A",
		buyerName: "Budi Santoso",
		buyerEmail: "budi@email.com",
		category: "VIP",
		price: 750000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-07-10",
		eventId: "evt-001",
	},
	{
		id: "t-002",
		barcode: "CP-JJ26-0002B",
		buyerName: "Siti Nurhaliza",
		buyerEmail: "siti@email.com",
		category: "Reguler",
		price: 250000,
		verificationStatus: "verified",
		paymentStatus: "paid",
		ticketStatus: "used",
		status: "checked_in",
		purchaseDate: "2026-07-11",
		eventId: "evt-001",
	},
	{
		id: "t-003",
		barcode: "CP-JJ26-0003C",
		buyerName: "Ahmad Fauzi",
		buyerEmail: "ahmad@email.com",
		category: "VIP",
		price: 750000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-07-12",
		eventId: "evt-001",
	},
	{
		id: "t-004",
		barcode: "CP-JJ26-0004D",
		buyerName: "Dewi Lestari",
		buyerEmail: "dewi@email.com",
		category: "VVIP",
		price: 1500000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-07-13",
		eventId: "evt-001",
	},
	{
		id: "t-005",
		barcode: "CP-JJ26-0005E",
		buyerName: "Rudi Hartono",
		buyerEmail: "rudi@email.com",
		category: "Reguler",
		price: 250000,
		verificationStatus: "verified",
		paymentStatus: "paid",
		ticketStatus: "used",
		status: "checked_in",
		purchaseDate: "2026-07-14",
		eventId: "evt-001",
	},
	{
		id: "t-006",
		barcode: "CP-JJ26-0006F",
		buyerName: "Indah Permata",
		buyerEmail: "indah@email.com",
		category: "Reguler",
		price: 250000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-07-15",
		eventId: "evt-001",
	},
	{
		id: "t-007",
		barcode: "CP-JJ26-0007G",
		buyerName: "Reza Rahadian",
		buyerEmail: "reza@email.com",
		category: "VIP",
		price: 750000,
		verificationStatus: "verified",
		paymentStatus: "paid",
		ticketStatus: "used",
		status: "checked_in",
		purchaseDate: "2026-07-16",
		eventId: "evt-001",
	},
	{
		id: "t-008",
		barcode: "CP-UB26-0001A",
		buyerName: "Mega Putri",
		buyerEmail: "mega@email.com",
		category: "VIP",
		price: 1200000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-08-01",
		eventId: "evt-002",
	},
	{
		id: "t-009",
		barcode: "CP-UB26-0002B",
		buyerName: "Doni Prasetyo",
		buyerEmail: "doni@email.com",
		category: "Presale 1",
		price: 400000,
		verificationStatus: "verified",
		paymentStatus: "paid",
		ticketStatus: "used",
		status: "checked_in",
		purchaseDate: "2026-08-02",
		eventId: "evt-002",
	},
	{
		id: "t-010",
		barcode: "CP-UB26-0003C",
		buyerName: "Citra Ayu",
		buyerEmail: "citra@email.com",
		category: "Presale 2",
		price: 600000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-08-03",
		eventId: "evt-002",
	},
	{
		id: "t-011",
		barcode: "CP-UB26-0004D",
		buyerName: "Fajar Nugroho",
		buyerEmail: "fajar@email.com",
		category: "VIP",
		price: 1200000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-08-04",
		eventId: "evt-002",
	},
	{
		id: "t-012",
		barcode: "CP-UB26-0005E",
		buyerName: "Luna Maharani",
		buyerEmail: "luna@email.com",
		category: "Presale 1",
		price: 400000,
		verificationStatus: "verified",
		paymentStatus: "paid",
		ticketStatus: "used",
		status: "checked_in",
		purchaseDate: "2026-08-05",
		eventId: "evt-002",
	},
	{
		id: "t-013",
		barcode: "CP-CC26-0001A",
		buyerName: "Andi Wijaya",
		buyerEmail: "andi@email.com",
		category: "Reguler",
		price: 150000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-09-01",
		eventId: "evt-003",
	},
	{
		id: "t-014",
		barcode: "CP-CC26-0002B",
		buyerName: "Putri Amelia",
		buyerEmail: "putri@email.com",
		category: "Early Bird",
		price: 100000,
		verificationStatus: "verified",
		paymentStatus: "paid",
		ticketStatus: "used",
		status: "checked_in",
		purchaseDate: "2026-09-02",
		eventId: "evt-003",
	},
	{
		id: "t-015",
		barcode: "CP-CC26-0003C",
		buyerName: "Dimas Aryo",
		buyerEmail: "dimas@email.com",
		category: "VIP",
		price: 500000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-09-03",
		eventId: "evt-003",
	},
	{
		id: "t-016",
		barcode: "CP-CC26-0004D",
		buyerName: "Rina Saraswati",
		buyerEmail: "rina@email.com",
		category: "Reguler",
		price: 150000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-09-04",
		eventId: "evt-003",
	},
	{
		id: "t-017",
		barcode: "CP-CC26-0005E",
		buyerName: "Hendro Susanto",
		buyerEmail: "hendro@email.com",
		category: "Early Bird",
		price: 100000,
		verificationStatus: "unused",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "pending",
		purchaseDate: "2026-09-05",
		eventId: "evt-003",
	},
	{
		id: "t-018",
		barcode: "CP-INV26-0001A",
		buyerName: "Bambang S",
		buyerEmail: "bambang@email.com",
		category: "VIP",
		price: 750000,
		verificationStatus: "invalid",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "invalid",
		purchaseDate: "2026-07-10",
		eventId: "evt-001",
	},
	{
		id: "t-019",
		barcode: "CP-DUP26-0001A",
		buyerName: "Citra Lestari",
		buyerEmail: "citra@email.com",
		category: "Reguler",
		price: 250000,
		verificationStatus: "duplicate",
		paymentStatus: "paid",
		ticketStatus: "active",
		status: "duplicate",
		purchaseDate: "2026-07-11",
		eventId: "evt-001",
	},
	{
		id: "t-020",
		barcode: "CP-CAN26-0001A",
		buyerName: "Dedi Kurniawan",
		buyerEmail: "dedi@email.com",
		category: "VIP",
		price: 750000,
		verificationStatus: "unused",
		paymentStatus: "cancelled",
		ticketStatus: "cancelled",
		status: "cancelled",
		purchaseDate: "2026-07-12",
		eventId: "evt-001",
	},
	{
		id: "t-021",
		barcode: "CP-REF26-0001A",
		buyerName: "Eka Putri",
		buyerEmail: "eka@email.com",
		category: "Reguler",
		price: 250000,
		verificationStatus: "unused",
		paymentStatus: "refunded",
		ticketStatus: "active",
		status: "refunded",
		purchaseDate: "2026-07-13",
		eventId: "evt-001",
	},
];

export const getEventsByVendor = (vendorId: string) =>
	vendorEvents.filter((e) => e.vendorId === vendorId);
export const getEventById = (eventId: string) =>
	vendorEvents.find((e) => e.id === eventId) ?? null;
export const getTicketsByEvent = (eventId: string) =>
	ticketManifest.filter((t) => t.eventId === eventId);

export function getEventStats(event: VendorEvent) {
	const totalQuota = event.categories.reduce((s, c) => s + c.quota, 0);
	const totalSold = event.categories.reduce((s, c) => s + c.sold, 0);
	const totalRevenue = event.categories.reduce(
		(s, c) => s + c.price * c.sold,
		0,
	);
	const ticketsForEvent = getTicketsByEvent(event.id);
	const checkedIn = ticketsForEvent.filter(
		(t) => t.verificationStatus === "verified" || t.ticketStatus === "used",
	).length;
	return { totalQuota, totalSold, totalRevenue, checkedIn };
}

export function getGlobalStats(events: VendorEvent[]) {
	const activeEvents = events.filter((e) => e.status === "ongoing").length;
	const totalSold = events.reduce(
		(s, e) => s + e.categories.reduce((a, c) => a + c.sold, 0),
		0,
	);
	const totalRevenue = events.reduce(
		(s, e) => s + e.categories.reduce((a, c) => a + c.price * c.sold, 0),
		0,
	);
	const checkedIn = events.reduce(
		(s, e) =>
			s +
			getTicketsByEvent(e.id).filter(
				(t) => t.verificationStatus === "verified" || t.ticketStatus === "used",
			).length,
		0,
	);
	return { activeEvents, totalSold, totalRevenue, checkedIn };
}
