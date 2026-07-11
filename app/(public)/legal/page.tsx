import Link from 'next/link';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12">
        {/* Sticky Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-24 bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
            <h3 className="font-quick font-bold text-neutral-900 text-lg mb-4">Dokumen Legal</h3>
            <nav className="flex flex-col gap-2">
              <a href="#terms" className="font-sans text-sm font-medium text-c-blue bg-c-blue-50 px-3 py-2 rounded-lg transition-colors">Syarat & Ketentuan</a>
              <a href="#privacy" className="font-sans text-sm font-medium text-neutral-600 hover:text-c-blue hover:bg-neutral-50 px-3 py-2 rounded-lg transition-colors">Kebijakan Privasi</a>
              <a href="#vendor" className="font-sans text-sm font-medium text-neutral-600 hover:text-c-blue hover:bg-neutral-50 px-3 py-2 rounded-lg transition-colors">Ketentuan Vendor</a>
            </nav>
          </div>
        </aside>

        {/* Content Area - Centered Narrow Column for Readability */}
        <div className="flex-1 max-w-3xl bg-white p-8 md:p-12 rounded-xl shadow-sm border border-neutral-200">
          <header className="mb-10 pb-6 border-b border-neutral-100">
            <h1 className="font-quick text-3xl font-bold text-neutral-900 mb-2">Legal & Kebijakan</h1>
            <p className="font-sans text-neutral-500">Terakhir diperbarui: 11 Juli 2026</p>
          </header>

          <section id="terms" className="scroll-mt-24 mb-12">
            <h2 className="font-quick text-2xl font-bold text-neutral-900 mb-4">Syarat & Ketentuan Penggunaan</h2>
            <div className="space-y-4 font-sans text-neutral-700 leading-relaxed text-base">
              <p>Selamat datang di Celeparty. Dengan mengakses dan menggunakan platform kami, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini.</p>
              
              <h3 className="font-quick font-semibold text-lg text-neutral-900 mt-6 mb-2">1. Definisi</h3>
              <p>"Platform" merujuk pada situs web dan aplikasi Celeparty. "Pengguna" adalah siapa saja yang mengakses platform, baik sebagai Customer maupun Vendor.</p>
              
              <h3 className="font-quick font-semibold text-lg text-neutral-900 mt-6 mb-2">2. Kewajiban Pengguna</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Anda wajib memberikan informasi yang akurat saat mendaftar akun.</li>
                <li>Anda tidak diperkenankan menggunakan platform untuk tujuan penipuan.</li>
                <li>Menjaga kerahasiaan kata sandi akun Anda adalah tanggung jawab Anda sendiri.</li>
              </ul>
              
              <h3 className="font-quick font-semibold text-lg text-neutral-900 mt-6 mb-2">3. Transaksi & Pembayaran</h3>
              <p>Seluruh transaksi yang terjadi di Celeparty menggunakan sistem pembayaran resmi kami. Kami tidak bertanggung jawab atas transaksi yang dilakukan di luar platform.</p>
            </div>
          </section>

          <section id="privacy" className="scroll-mt-24 mb-12">
            <h2 className="font-quick text-2xl font-bold text-neutral-900 mb-4">Kebijakan Privasi</h2>
            <div className="space-y-4 font-sans text-neutral-700 leading-relaxed text-base">
              <p>Privasi Anda sangat penting bagi kami. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data pribadi Anda.</p>
              
              <h3 className="font-quick font-semibold text-lg text-neutral-900 mt-6 mb-2">1. Pengumpulan Data</h3>
              <p>Kami mengumpulkan informasi yang Anda berikan secara langsung, seperti nama, alamat email, dan nomor telepon saat mendaftar.</p>
              
              <h3 className="font-quick font-semibold text-lg text-neutral-900 mt-6 mb-2">2. Penggunaan Data</h3>
              <p>Data Anda digunakan untuk memproses transaksi, mengirim tiket, dan memberikan dukungan pelanggan yang optimal.</p>
            </div>
          </section>

          <section id="vendor" className="scroll-mt-24">
            <h2 className="font-quick text-2xl font-bold text-neutral-900 mb-4">Ketentuan Vendor</h2>
            <div className="space-y-4 font-sans text-neutral-700 leading-relaxed text-base">
              <p>Sebagai Vendor di Celeparty, Anda wajib mematuhi standar layanan yang tinggi untuk memastikan kepuasan pelanggan.</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Menyediakan layanan sesuai dengan deskripsi yang tertera pada produk/event.</li>
                <li>Menangani permintaan refund sesuai dengan kebijakan yang disepakati.</li>
                <li>Dilarang menjual tiket palsu atau layanan fiktif.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
