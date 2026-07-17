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
		relatedProductSlugs: ["sound-system-profesional", "lighting-panggung"],
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
		relatedProductSlugs: ["dekorasi-pernikahan", "fotografer-event"],
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
		relatedProductSlugs: ["catering-gathering", "mc-acara"],
	},
	"fotografi-event-yang-instagrammable": {
		slug: "fotografi-event-yang-instagrammable",
		title: "Cara Membuat Fotografi Event yang Instagrammable",
		excerpt:
			"Foto adalah kenangan abadi dari setiap event. Ketahui teknik dan pose yang membuat dokumentasi acara Anda terlihat profesional dan layak dibagikan ke media sosial.",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&h=533&fit=crop",
		date: "2026-07-02",
		author: "Tim Celeparty",
		category: "Fotografi",
		content: [
			{
				type: "heading",
				value: "Mengapa Dokumentasi Foto Itu Penting?",
			},
			{
				type: "paragraph",
				value:
					"Di era media sosial, dokumentasi foto yang baik bukan sekadar kenangan — ini adalah konten. Foto berkualitas dari sebuah event bisa menjangkau ribuan orang, meningkatkan reputasi penyelenggara, dan menjadi referensi bagi peserta di masa depan. Investasi pada fotografer profesional adalah keputusan strategis, bukan sekadar pengeluaran tambahan.",
			},
			{
				type: "heading",
				value: "Teknik Dasar yang Harus Diketahui Fotografer Event",
			},
			{
				type: "list",
				value: "Lima teknik utama untuk foto event yang memukau:",
				items: [
					"Rule of Thirds: Posisikan subjek di titik persimpangan grid imajiner untuk komposisi yang lebih dinamis daripada sekadar foto tengah-tengah.",
					"Ambient Light: Manfaatkan cahaya alami dari jendela atau pencahayaan venue sebelum menambahkan flash. Hasilnya lebih natural dan hangat.",
					"Moment Hunting: Foto terbaik sering kali adalah yang tidak dipose — tawa spontan, jabat tangan, ekspresi terkejut. Selalu siap siaga.",
					"Depth of Field: Gunakan aperture besar (f/1.8 - f/2.8) untuk memblur background dan menonjolkan subjek utama.",
					"Leading Lines: Manfaatkan elemen arsitektur venue (tangga, koridor, meja panjang) sebagai garis panduan menuju subjek.",
				],
			},
			{
				type: "heading",
				value: "Tips Membuat Foto Layak Instagram",
			},
			{
				type: "paragraph",
				value:
					"Foto instagrammable bukan berarti filter berlebihan. Kuncinya ada di tiga hal: komposisi yang bersih, pencahayaan yang baik, dan momen yang tepat. Untuk event, pastikan ada 'hero shot' — satu foto ikonik yang mewakili keseluruhan acara. Ini bisa berupa foto venue dari sudut terbaik, foto keramaian peserta dari ketinggian, atau momen emosional yang kuat seperti prosesi atau penghargaan.",
			},
			{
				type: "heading",
				value: "Memilih Fotografer yang Tepat",
			},
			{
				type: "paragraph",
				value:
					"Periksa portofolio fotografer — pastikan gaya editingnya sesuai dengan visi Anda. Diskusikan deliverable: berapa jumlah foto final yang diedit, dalam format apa, dan kapan deadline pengirimannya. Di Celeparty, Anda bisa menemukan fotografer event profesional dengan portofolio terverifikasi dan review dari klien sebelumnya.",
			},
		],
		relatedProductSlugs: ["fotografer-event", "videografer-event"],
	},
	"checklist-event-pertama": {
		slug: "checklist-event-pertama",
		title: "Checklist Lengkap untuk Event Pertama Anda",
		excerpt:
			"Merencanakan event pertama bisa terasa menakutkan. Ikuti checklist ini agar tidak ada yang terlewat — dari venue, vendor, hingga hari-H.",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=533&fit=crop",
		date: "2026-06-28",
		author: "Tim Celeparty",
		category: "Tips Event",
		content: [
			{
				type: "heading",
				value: "H-60: Fondasi Event",
			},
			{
				type: "list",
				value: "Yang harus diselesaikan 2 bulan sebelum event:",
				items: [
					"Tentukan konsep, tema, dan target peserta dengan jelas.",
					"Buat anggaran awal — alokasikan 40% untuk venue, 25% untuk catering, 20% untuk dekorasi & hiburan, 15% contingency.",
					"Survey dan booking venue. Venue yang baik akan habis dipesan jauh-jauh hari.",
					"Buat timeline master dan distribusikan ke semua tim.",
				],
			},
			{
				type: "heading",
				value: "H-30: Konfirmasi Vendor",
			},
			{
				type: "list",
				value: "Satu bulan sebelum event, pastikan semua ini sudah beres:",
				items: [
					"Kontrak vendor sudah ditandatangani: catering, fotografer, MC, dekorasi, sound system.",
					"Undangan sudah dikirim — baik digital maupun fisik.",
					"Rundown acara sudah final dan dibagikan ke semua pihak terkait.",
					"Sistem pendaftaran peserta sudah berjalan (tiket, RSVP, atau daftar tamu).",
				],
			},
			{
				type: "heading",
				value: "H-7: Final Check",
			},
			{
				type: "paragraph",
				value:
					"Seminggu sebelum hari-H adalah waktu kritis. Konfirmasi ulang semua vendor tentang waktu kedatangan dan kebutuhan teknis. Lakukan site visit untuk memastikan setup venue sesuai rencana. Brief seluruh tim panitia — pastikan setiap orang tahu peran dan tanggung jawab masing-masing. Siapkan plan B untuk hal-hal kritis seperti cuaca (jika outdoor) dan kemungkinan vendor batal.",
			},
			{
				type: "heading",
				value: "Hari-H: Eksekusi",
			},
			{
				type: "paragraph",
				value:
					"Tiba di venue minimal 3 jam sebelum acara dimulai. Lakukan pengecekan terakhir: sound, lighting, dekorasi, jalur evakuasi, dan area registrasi. Delegasikan — Anda tidak bisa mengerjakan segalanya sendiri. Percayakan pada tim dan fokuslah pada pengalaman peserta. Dan yang terpenting: nikmati momen. Event pertama Anda adalah pelajaran berharga, apapun hasilnya.",
			},
		],
		relatedProductSlugs: [
			"sound-system-profesional",
			"mc-acara",
			"fotografer-event",
		],
	},
	"lighting-panggung-pemula": {
		slug: "lighting-panggung-pemula",
		title: "Dasar-Dasar Lighting Panggung untuk Pemula",
		excerpt:
			"Lighting yang tepat bisa mengubah atmosfer acara secara drastis. Pelajari jenis-jenis lampu panggung dan kapan menggunakannya.",
		thumbnailUrl:
			"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=533&fit=crop",
		date: "2026-06-25",
		author: "Tim Celeparty",
		category: "Audio & Sound",
		content: [
			{
				type: "heading",
				value: "Mengapa Lighting Panggung Penting?",
			},
			{
				type: "paragraph",
				value:
					"Lighting bukan sekadar penerangan — ini adalah alat storytelling. Bayangkan pertunjukan teater tanpa perubahan cahaya, atau konser tanpa sorotan lampu yang mengikuti artis. Lighting yang dirancang dengan baik dapat memandu perhatian penonton, membangun emosi, dan menciptakan momen yang tak terlupakan. Bahkan untuk event korporat yang sederhana sekalipun, lighting yang tepat akan membuat presentasi terlihat lebih profesional.",
			},
			{
				type: "heading",
				value: "Jenis-Jenis Lampu Panggung",
			},
			{
				type: "list",
				value: "Kenali jenis lampu yang umum digunakan:",
				items: [
					"PAR Can / LED Par: Lampu sorot dasar berbentuk silinder. Cocok untuk pencahayaan umum panggung dan wash lighting. Tersedia dalam berbagai warna.",
					"Moving Head: Lampu yang bisa bergerak dan berputar secara otomatis. Memberikan efek dinamis, ideal untuk konser dan event entertainment.",
					"Fresnel: Lampu dengan sorotan yang bisa diatur dari spot (sempit) hingga flood (lebar). Standar untuk teater dan produksi video.",
					"Follow Spot: Lampu besar yang dioperasikan manual untuk mengikuti pergerakan performer di panggung.",
					"Strobe: Lampu kilat yang menciptakan efek freeze-frame. Gunakan dengan hemat — bisa mengganggu penonton yang sensitif cahaya.",
				],
			},
			{
				type: "heading",
				value: "Tiga Warna Dasar yang Harus Anda Pahami",
			},
			{
				type: "paragraph",
				value:
					"Dalam lighting panggung, warna memiliki peran psikologis yang kuat. Biru menciptakan suasana dingin, misterius, dan profesional — cocok untuk corporate event dan seminar. Merah dan oranye memberikan energi dan kehangatan — ideal untuk entertainment dan pesta. Hijau sering digunakan untuk efek dramatis atau supernatural. Putih bersih (daylight) adalah pilihan aman untuk semua jenis acara karena memberikan pencahayaan natural.",
			},
			{
				type: "heading",
				value: "Tips Memilih Vendor Lighting",
			},
			{
				type: "paragraph",
				value:
					"Saat memilih vendor lighting panggung, tanyakan tentang kapasitas daya listrik yang dibutuhkan — pastikan venue mampu menampungnya. Diskusikan tentang jumlah dan posisi titik lampu yang direkomendasikan untuk venue Anda. Di Celeparty, vendor lighting kami sudah berpengalaman di berbagai jenis venue dan dapat memberikan rekomendasi setup yang sesuai dengan budget dan konsep acara Anda.",
			},
		],
		relatedProductSlugs: ["lighting-panggung", "sound-system-profesional"],
	},
};
