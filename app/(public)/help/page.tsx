import Link from 'next/link';
import { HelpCircle, Ticket, User, Store, RefreshCcw, ChevronDown, Search } from 'lucide-react';

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Hero Section */}
      <section className="bg-c-blue py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-quick text-3xl md:text-4xl font-bold text-white mb-6">
            Halo, ada yang bisa kami bantu?
          </h1>
          <div className="relative max-w-2xl mx-auto">
            <input 
              type="text" 
              placeholder="Cari artikel atau topik bantuan..." 
              className="w-full h-14 pl-12 pr-14 rounded-xl font-sans text-lg focus:outline-none focus:ring-2 focus:ring-c-green shadow-lg text-neutral-900"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-neutral-400" />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-c-blue rounded-lg text-white hover:bg-c-blue/90 transition-colors">
              <span className="sr-only">Cari</span>
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { icon: Ticket, title: 'Tiket', desc: 'Panduan e-ticket & pembayaran' },
            { icon: User, title: 'Akun', desc: 'Pengaturan profil & password' },
            { icon: Store, title: 'Vendor', desc: 'Cara berjualan & kelola event' },
            { icon: RefreshCcw, title: 'Refund', desc: 'Kebijakan pengembalian dana' },
          ].map((cat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-card border border-neutral-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 cursor-pointer flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-c-blue-50 flex items-center justify-center text-c-blue mb-4">
                <cat.icon className="w-7 h-7" />
              </div>
              <h3 className="font-quick font-semibold text-neutral-900 text-lg mb-2">{cat.title}</h3>
              <p className="font-sans text-sm text-neutral-500">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-4 mt-20">
        <div className="text-center mb-10">
          <h2 className="font-quick text-2xl md:text-3xl font-bold text-neutral-900">Pertanyaan Populer</h2>
          <p className="font-sans text-neutral-500 mt-2">Jawaban cepat untuk masalah yang sering ditanyakan.</p>
        </div>
        
        <div className="space-y-4">
          {[
            { q: 'Bagaimana cara membeli tiket di Celeparty?', a: 'Anda dapat mencari event di halaman utama, pilih kategori atau lokasi, lalu klik "Beli Tiket". Ikuti instruksi pembayaran hingga selesai.' },
            { q: 'Kapan tiket saya akan dikirim?', a: 'E-ticket akan langsung dikirim ke email Anda setelah pembayaran terkonfirmasi (berstatus Lunas).' },
            { q: 'Apakah tiket bisa di-refund?', a: 'Kebijakan refund bergantung pada masing-masing penyelenggara event (Vendor). Silakan cek halaman event terkait untuk detailnya.' },
            { q: 'Bagaimana cara mendaftar sebagai Vendor?', a: 'Klik menu "Daftar Vendor" di navigasi atas, lengkapi profil usaha Anda, dan tunggu verifikasi maksimal 2x24 jam.' },
          ].map((faq, i) => (
            <details key={i} className="group bg-white border border-neutral-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex justify-between items-center font-quick font-semibold text-lg cursor-pointer p-5 text-neutral-900 hover:bg-neutral-50 transition-colors">
                {faq.q}
                <span className="transition group-open:rotate-180">
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                </span>
              </summary>
              <div className="p-5 pt-0 text-neutral-600 font-sans text-base leading-relaxed border-t border-neutral-100">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Support */}
      <section className="max-w-3xl mx-auto px-4 mt-20">
        <div className="text-center bg-c-blue-50 rounded-2xl p-10 border border-c-blue-100">
          <HelpCircle className="w-12 h-12 text-c-blue mx-auto mb-4" />
          <h2 className="font-quick text-2xl font-bold text-neutral-900 mb-3">Masih Butuh Bantuan?</h2>
          <p className="font-sans text-neutral-600 mb-6">Tim support kami siap membantu Anda menyelesaikan masalah apa pun.</p>
          <Link href="/contact" className="inline-flex items-center justify-center gap-2 bg-c-blue text-white font-quick font-semibold text-base px-8 py-3 rounded-lg min-h-[44px] transition-all duration-200 hover:bg-c-blue/90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-c-blue">
            Hubungi Kami
          </Link>
        </div>
      </section>
    </div>
  );
}
