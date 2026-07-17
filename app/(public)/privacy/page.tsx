import Link from "next/link";

export default function PrivacyPolicyPage() {
	return (
		<div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-neutral-200">
				<header className="mb-10 pb-6 border-b border-neutral-100">
					<h1 className="font-quick text-3xl font-bold text-neutral-900 mb-2">
						Kebijakan Privasi
					</h1>
					<p className="font-sans text-neutral-500">
						Terakhir diperbarui: 11 Juli 2026
					</p>
				</header>

				<section className="space-y-6 font-sans text-neutral-700 leading-relaxed text-base">
					<p>
						Privasi Anda sangat penting bagi Celeparty. Kami berkomitmen untuk
						melindungi informasi pribadi Anda dan bersikap transparan tentang
						data yang kami kumpulkan dan cara penggunaannya.
					</p>

					<h3 className="font-quick font-semibold text-lg text-neutral-900 mt-8 mb-3">
						1. Pengumpulan Data
					</h3>
					<p>
						Kami mengumpulkan informasi yang Anda berikan secara langsung saat
						Anda menggunakan platform kami, seperti nama, alamat email, nomor
						telepon, dan detail pembayaran ketika mendaftar, membeli tiket, atau
						mendaftar sebagai Vendor.
					</p>

					<h3 className="font-quick font-semibold text-lg text-neutral-900 mt-8 mb-3">
						2. Penggunaan Data
					</h3>
					<p>Data Anda digunakan untuk:</p>
					<ul className="list-disc pl-5 space-y-2">
						<li>Memproses transaksi dan mengirimkan e-ticket.</li>
						<li>
							Memberikan dukungan pelanggan (customer support) yang optimal.
						</li>
						<li>
							Memverifikasi identitas pengguna, khususnya bagi pendaftar Vendor.
						</li>
						<li>
							Mengirimkan pemberitahuan penting mengenai layanan, perubahan
							kebijakan, dan promosi relevan.
						</li>
					</ul>

					<h3 className="font-quick font-semibold text-lg text-neutral-900 mt-8 mb-3">
						3. Berbagi Informasi dengan Pihak Ketiga
					</h3>
					<p>
						Celeparty tidak akan menjual informasi pribadi Anda. Kami hanya
						berbagi data dengan pihak ketiga yang diperlukan untuk menyelesaikan
						transaksi (seperti gateway pembayaran) atau untuk keperluan
						kepatuhan hukum.
					</p>

					<h3 className="font-quick font-semibold text-lg text-neutral-900 mt-8 mb-3">
						4. Keamanan Data
					</h3>
					<p>
						Kami menerapkan berbagai langkah keamanan teknis untuk melindungi
						data Anda dari akses, perubahan, atau penghancuran yang tidak sah.
						Transaksi di platform kami dienkripsi menggunakan teknologi SSL
						terkini.
					</p>

					<div className="mt-12 p-6 bg-c-blue-50 rounded-xl border border-c-blue-100">
						<h4 className="font-quick font-semibold text-c-blue text-lg mb-2">
							Punya pertanyaan tentang privasi Anda?
						</h4>
						<p className="font-sans text-sm text-neutral-600 mb-4">
							Tim support kami dapat membantu Anda terkait pertanyaan privasi
							dan pengelolaan data.
						</p>
						<Link
							href="/contact"
							className="inline-flex font-quick font-semibold text-sm bg-c-blue text-white px-5 py-2.5 rounded-lg hover:bg-c-blue/90 transition-colors"
						>
							Hubungi Tim Kami
						</Link>
					</div>
				</section>
			</div>
		</div>
	);
}
