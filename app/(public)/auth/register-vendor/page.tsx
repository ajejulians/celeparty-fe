"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Store } from "lucide-react";

export default function RegisterVendorPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    storeName: "",
    description: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulasi API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-neutral-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 text-center shadow-sm border border-neutral-100">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store className="w-8 h-8" />
          </div>
          <h2 className="font-quick font-bold text-2xl text-neutral-900 mb-3">Pengajuan Berhasil!</h2>
          <p className="font-sans text-neutral-500 mb-8">
            Terima kasih telah mendaftar sebagai vendor di Celeparty. Tim kami akan meninjau pengajuan Anda dalam 1-2 hari kerja.
          </p>
          <button 
            onClick={() => router.push("/")}
            className="w-full bg-c-blue text-white font-quick font-bold py-3.5 rounded-xl hover:bg-c-blue/90 transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="inline-flex items-center gap-2 text-neutral-500 hover:text-c-blue transition-colors font-sans text-sm mb-6">
          <ChevronLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
        
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="bg-c-blue p-8 text-center">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Store className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-quick font-bold text-3xl text-white mb-2">Mulai Perjalanan Anda</h1>
            <p className="font-sans text-white/80">Bergabunglah menjadi vendor Celeparty dan jangkau lebih banyak pelanggan.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-semibold text-neutral-900 mb-2">
                Nama Toko / Nama Vendor
              </label>
              <input
                type="text"
                id="storeName"
                required
                placeholder="Contoh: Jakarta Audio Pro"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-1 focus:ring-c-blue font-sans text-sm transition-all"
                value={formData.storeName}
                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-neutral-900 mb-2">
                Deskripsi Singkat
              </label>
              <textarea
                id="description"
                required
                rows={4}
                placeholder="Ceritakan singkat tentang layanan dan spesialisasi Anda..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-1 focus:ring-c-blue font-sans text-sm transition-all resize-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-neutral-900 mb-2">
                Nomor Kontak (WhatsApp)
              </label>
              <input
                type="tel"
                id="phone"
                required
                placeholder="Contoh: 081234567890"
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-1 focus:ring-c-blue font-sans text-sm transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-neutral-900 mb-2">
                Alamat Lengkap (Operasional)
              </label>
              <textarea
                id="address"
                required
                rows={3}
                placeholder="Tuliskan alamat lengkap kantor atau lokasi operasional Anda..."
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:border-c-blue focus:ring-1 focus:ring-c-blue font-sans text-sm transition-all resize-none"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="pt-4 border-t border-neutral-100">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-c-blue text-white font-quick font-bold text-lg rounded-xl py-4 hover:bg-c-blue/90 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Kirim Pengajuan"
                )}
              </button>
              <p className="text-center font-sans text-xs text-neutral-500 mt-4">
                Dengan menekan tombol di atas, Anda menyetujui Syarat & Ketentuan Vendor Celeparty.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
