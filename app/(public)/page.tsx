"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "../../lib/session";
import { products } from "../../lib/data";
import { TicketCard } from "../../components/product/TicketCard";
import {
  Music,
  UtensilsCrossed,
  Palette,
  Star,
  ShieldCheck,
  Headphones,
  MapPin,
  Search,
  Store,
  Quote
} from "lucide-react";

const categories = [
  { name: "Musik & Sound", icon: <Music className="w-8 h-8" />, href: "/products?category=Audio+%26+Sound", description: "Sound system, lighting, dan band untuk event Anda", size: "lg" },
  { name: "Kuliner", icon: <UtensilsCrossed className="w-8 h-8" />, href: "/products?category=Catering", description: "Catering dan hidangan terbaik", size: "sm" },
  { name: "Seni & Dekorasi", icon: <Palette className="w-8 h-8" />, href: "/products?category=Dekorasi", description: "Dekorasi dan tata rias profesional", size: "sm" },
  { name: "Fotografi", icon: <Star className="w-8 h-8" />, href: "/products?category=Fotografi", description: "Foto, video, dan dokumentasi cinematic", size: "sm" },
];

const uniqueVendors = Array.from(
  new Map(
    products.map((p) => [p.vendorName, { name: p.vendorName, city: p.city }])
  ).values()
);

const vendorProductCounts = uniqueVendors.map((v) => ({
  ...v,
  count: products.filter((p) => p.vendorName === v.name).length,
}));

const trustMetrics = [
  { value: "500+", label: "Event Sukses", icon: <Star className="w-5 h-5" /> },
  { value: "200+", label: "Vendor Terpercaya", icon: <ShieldCheck className="w-5 h-5" /> },
  { value: "10k+", label: "Customer Puas", icon: <Headphones className="w-5 h-5" /> },
];

const testimonials = [
  { name: "Sarah Amalia", type: "Pernikahan", review: "Sangat membantu menemukan vendor dekorasi dan sound system profesional. Transaksi aman dan kualitas terjamin!", rating: 5 },
  { name: "Budi Tabuti", type: "Corporate Event", review: "Pesan catering untuk acara kantor jadi sangat mudah. Prosesnya cepat dan customer service sangat responsif 24/7.", rating: 5 },
  { name: "Diana Putri", type: "Ulang Tahun", review: "Koleksi fotografer di Celeparty luar biasa. Saya bisa dengan mudah membandingkan portofolio sebelum memilih.", rating: 4 },
];

const VendorCard = ({ vendor, imgUrl }: { vendor: any; imgUrl: string }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-w-[240px] flex-shrink-0 snap-center">
      <div className="w-16 h-16 relative rounded-full overflow-hidden mb-4 shadow-sm mx-auto group-hover:scale-105 transition-transform bg-neutral-100 flex items-center justify-center">
        {!imgError ? (
          <Image 
            src={imgUrl} 
            alt={vendor.name} 
            fill 
            className="object-cover" 
            sizes="64px" 
            onError={() => setImgError(true)}
          />
        ) : (
          <Store className="w-8 h-8 text-neutral-400" />
        )}
      </div>
      <h3 className="font-quick font-semibold text-base text-neutral-900 group-hover:text-c-blue transition-colors text-center truncate">
        {vendor.name}
      </h3>
      <div className="flex items-center justify-center gap-1 mt-1.5 mb-3">
        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
        <span className="text-sm font-sans text-neutral-500">
          {vendor.city}
        </span>
      </div>
      <div className="flex items-center justify-center">
        <span className="px-3 py-1 bg-c-blue-50 text-c-blue text-xs font-semibold rounded-full">
          {vendor.count} Layanan
        </span>
      </div>
    </div>
  );
};

export default function HomePage() {
  const session = useSession();
  const isVendorOrAdmin = session.isAuthenticated && (session.role === "vendor" || session.role === "admin");
  const isCustomer = session.isAuthenticated && session.role !== "vendor" && session.role !== "admin";

  return (
    <div className="bg-slate-50">
      {/* Hero */}
      <section className="relative bg-c-blue overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-c-blue via-c-blue to-neutral-900 opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(203,208,2,0.15),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <h1 className="font-quick font-bold text-4xl lg:text-5xl text-white leading-tight mb-4">
              Temukan Jasa Event Terbaik untuk Momen Spesial Anda
            </h1>
            <p className="font-sans text-lg text-white/80 mb-8 max-w-xl">
              Dari sound system, dekorasi, catering, hingga dokumentasi —
              semua vendor event terbaik ada di satu tempat.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-start mb-10">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-8 py-3 rounded-lg min-h-[44px] hover:brightness-95 active:scale-[0.98] transition-all shadow-lg shadow-c-green/20"
              >
                Jelajahi Marketplace
              </Link>
              {isVendorOrAdmin && (
                <Link
                  href="/user/vendor/dashboard"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-quick font-semibold text-sm px-8 py-3 rounded-lg min-h-[44px] hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  Buat Event
                </Link>
              )}
              {isCustomer && (
                <Link
                  href="/auth/register-vendor"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-quick font-semibold text-sm px-8 py-3 rounded-lg min-h-[44px] hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  Jadi Vendor
                </Link>
              )}
            </div>
            <div className="relative max-w-md group">
              <Search className="w-4 h-4 absolute left-4 top-3.5 text-white/50 group-focus-within:text-c-green transition-colors" />
              <input
                type="text"
                placeholder="Cari jasa event..."
                className="w-full pl-12 pr-4 py-3 text-sm font-sans rounded-xl bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:border-c-green focus:bg-white/15 focus:ring-4 focus:ring-c-green/20 transition-all shadow-inner"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {trustMetrics.map((metric) => (
              <div key={metric.label} className="text-center group">
                <div className="w-12 h-12 bg-c-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-3 text-c-blue group-hover:scale-110 group-hover:bg-c-blue group-hover:text-white transition-all duration-300">
                  {metric.icon}
                </div>
                <p className="font-quick font-bold text-2xl text-neutral-900">
                  {metric.value}
                </p>
                <p className="text-sm font-sans text-neutral-500 mt-0.5">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="font-quick font-bold text-3xl text-neutral-900 mb-3">
            Kategori Populer
          </h2>
          <p className="font-sans text-base text-neutral-500">
            Pilih kategori jasa event sesuai kebutuhan Anda
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[180px]">
          <Link
            href={categories[0].href}
            className="md:col-span-2 md:row-span-2 bg-c-blue rounded-2xl p-8 flex flex-col justify-end relative overflow-hidden group hover:brightness-95 active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-xl"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-c-blue/95 via-c-blue/50 to-transparent z-0" />
            <div className="absolute top-6 right-6 w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 z-10">
              {categories[0].icon}
            </div>
            <div className="relative z-10">
              <h3 className="font-quick font-bold text-2xl text-white mb-2">
                {categories[0].name}
              </h3>
              <p className="font-sans text-base text-white/80 max-w-sm">
                {categories[0].description}
              </p>
            </div>
          </Link>
          {categories.slice(1).map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="bg-white rounded-2xl border border-neutral-100 p-6 flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-1 hover:border-c-blue/30 transition-all duration-300 group"
            >
              <div className="w-12 h-12 bg-c-blue-50 rounded-xl flex items-center justify-center text-c-blue group-hover:bg-c-blue group-hover:text-white transition-colors">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-quick font-semibold text-base text-neutral-900 group-hover:text-c-blue transition-colors">
                  {cat.name}
                </h3>
                <p className="font-sans text-sm text-neutral-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Events */}
      <section className="bg-white py-20 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-quick font-bold text-3xl text-neutral-900 mb-3">
                Event Populer
              </h2>
              <p className="font-sans text-base text-neutral-500">
                Jasa event terbaik yang paling diminati bulan ini
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex font-quick font-semibold text-sm text-c-blue hover:text-c-blue/80 bg-c-blue-50 px-5 py-2.5 rounded-full transition-colors"
            >
              Lihat Semua &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, index) => (
              <TicketCard
                key={product.slug}
                product={product}
                variant="landing"
                priority={index === 0}
              />
            ))}
          </div>
          <div className="text-center mt-10 sm:hidden">
            <Link
              href="/products"
              className="inline-flex font-quick font-semibold text-sm text-c-blue bg-c-blue-50 px-6 py-3 rounded-full hover:bg-c-blue-100 transition-colors"
            >
              Lihat Semua &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Features - Why Choose Us */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-quick font-bold text-3xl md:text-4xl text-neutral-900 mb-4">Mengapa Memilih Celeparty?</h2>
          <p className="font-sans text-base text-neutral-500 max-w-2xl mx-auto mb-16">
            Platform terpercaya yang menghubungkan Anda dengan ribuan vendor profesional di seluruh Indonesia. Dari perencanaan hingga pelaksanaan, kami ada untuk Anda.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { icon: <ShieldCheck className="w-8 h-8" />, title: "Transaksi Aman", desc: "Pembayaran dijamin aman dengan sistem escrow terintegrasi.", color: "bg-emerald-50 text-emerald-600" },
              { icon: <Star className="w-8 h-8" />, title: "Kualitas Terjamin", desc: "Vendor yang telah dikurasi dengan ulasan pelanggan asli yang valid.", color: "bg-c-blue-50 text-c-blue" },
              { icon: <Headphones className="w-8 h-8" />, title: "Dukungan 24/7", desc: "Tim support kami siap membantu Anda kapan saja tanpa henti.", color: "bg-c-orange/10 text-c-orange" }
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 border border-neutral-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="font-quick font-bold text-xl text-neutral-900 mb-3">{feature.title}</h3>
                <p className="font-sans text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-24 border-t border-neutral-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-c-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-quick font-bold text-3xl md:text-4xl text-neutral-900 mb-4">Apa Kata Mereka?</h2>
            <p className="font-sans text-base text-neutral-500">
              Ribuan acara telah sukses diselenggarakan bersama Celeparty.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-slate-50 rounded-3xl p-8 border border-neutral-100 relative">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-c-blue-100 opacity-50" />
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < t.rating ? "text-c-orange fill-c-orange" : "text-neutral-300"}`} />
                  ))}
                </div>
                <p className="font-sans text-neutral-700 leading-relaxed mb-8 min-h-[80px]">
                  "{t.review}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-c-blue text-white rounded-full flex items-center justify-center font-quick font-bold text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-quick font-bold text-neutral-900">{t.name}</p>
                    <p className="text-xs font-sans text-neutral-500">{t.type}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vendors with Horizontal Scroll/Snap */}
      <section className="bg-slate-50 py-24 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-quick font-bold text-3xl text-neutral-900 mb-3">
              Vendor Unggulan
            </h2>
            <p className="font-sans text-base text-neutral-500">
              Jelajahi vendor terpercaya dengan rating terbaik dari customer kami.
            </p>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-6 pb-8 pt-4 px-4 -mx-4">
            {vendorProductCounts.map((vendor, index) => {
              const vendorImages = [
                "https://images.unsplash.com/photo-1516280440502-8610eb675005?w=128&h=128&fit=crop",
                "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=128&h=128&fit=crop",
                "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&h=128&fit=crop",
                "https://images.unsplash.com/photo-1555244162-803834f70033?w=128&h=128&fit=crop",
                "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=128&h=128&fit=crop",
                "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=128&h=128&fit=crop"
              ];
              const imgUrl = vendorImages[index % vendorImages.length];
              
              // Simulate broken images for the ones requested
              const isBroken = vendor.name === "Jakarta Audio Pro" || vendor.name === "Bandung Stage Lighting";
              const finalImgUrl = isBroken ? "https://broken-image.link.invalid" : imgUrl;

              return (
                <VendorCard key={vendor.name} vendor={vendor} imgUrl={finalImgUrl} />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
