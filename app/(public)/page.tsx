"use client";

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

export default function HomePage() {
  const session = useSession();
  const canCreateEvent = session.isAuthenticated && (session.role === "vendor" || session.role === "admin");

  return (
    <div className="bg-neutral-50">
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
                className="inline-flex items-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-8 py-3 rounded-lg min-h-[44px] hover:brightness-95 active:scale-[0.98] transition-all"
              >
                Jelajahi Marketplace
              </Link>
              {canCreateEvent && (
                <Link
                  href="/user/vendor/dashboard"
                  className="inline-flex items-center gap-2 border-2 border-white/30 text-white font-quick font-semibold text-sm px-8 py-3 rounded-lg min-h-[44px] hover:bg-white/10 active:scale-[0.98] transition-all"
                >
                  Buat Event
                </Link>
              )}
            </div>
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-3 text-white/50" />
              <input
                type="text"
                placeholder="Cari jasa event..."
                className="w-full pl-10 pr-4 py-2.5 text-sm font-sans rounded-lg bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:border-white/60 focus:ring-2 focus:ring-white/20 transition-all"
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
              <div key={metric.label} className="text-center">
                <div className="w-10 h-10 bg-c-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 text-c-blue">
                  {metric.icon}
                </div>
                <p className="font-quick font-bold text-2xl text-neutral-900">
                  {metric.value}
                </p>
                <p className="text-xs font-sans text-neutral-500 mt-0.5">
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-quick font-bold text-3xl text-neutral-900 mb-2">
            Kategori Populer
          </h2>
          <p className="font-sans text-sm text-neutral-500">
            Pilih kategori jasa event sesuai kebutuhan Anda
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[160px]">
          <Link
            href={categories[0].href}
            className="md:col-span-2 md:row-span-2 bg-c-blue rounded-xl p-6 flex flex-col justify-end relative overflow-hidden group hover:brightness-95 active:scale-[0.98] transition-all duration-200"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-c-blue/90 via-c-blue/40 to-transparent" />
            <div className="absolute top-4 right-4 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              {categories[0].icon}
            </div>
            <div className="relative z-10">
              <h3 className="font-quick font-bold text-xl text-white mb-1">
                {categories[0].name}
              </h3>
              <p className="font-sans text-sm text-white/70">
                {categories[0].description}
              </p>
            </div>
          </Link>
          {categories.slice(1).map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="bg-white rounded-xl border border-neutral-200 p-5 flex flex-col justify-between hover:shadow-card-hover hover:-translate-y-0.5 hover:border-c-blue/30 transition-all duration-200 group"
            >
              <div className="w-10 h-10 bg-c-blue-50 rounded-lg flex items-center justify-center text-c-blue group-hover:bg-c-blue group-hover:text-white transition-colors">
                {cat.icon}
              </div>
              <div>
                <h3 className="font-quick font-semibold text-sm text-neutral-900 group-hover:text-c-blue transition-colors">
                  {cat.name}
                </h3>
                <p className="font-sans text-xs text-neutral-500 mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Popular Events */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-quick font-bold text-3xl text-neutral-900 mb-2">
                Event Populer
              </h2>
              <p className="font-sans text-sm text-neutral-500">
                Jasa event terbaik yang paling diminati bulan ini
              </p>
            </div>
            <Link
              href="/products"
              className="hidden sm:inline-flex font-quick font-semibold text-sm text-c-blue hover:underline"
            >
              Lihat Semua &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product, index) => (
              <TicketCard
                key={product.slug}
                product={product}
                variant="landing"
                priority={index === 0}
              />
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link
              href="/products"
              className="font-quick font-semibold text-sm text-c-blue hover:underline"
            >
              Lihat Semua &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Banner */}
      <section className="bg-gradient-to-r from-c-blue to-[#2A1854] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="font-quick font-bold text-3xl md:text-4xl text-white mb-6">Wujudkan Event Impian Anda Bersama Celeparty</h2>
          <p className="font-sans text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Platform terpercaya yang menghubungkan Anda dengan ribuan vendor profesional di seluruh Indonesia. Dari perencanaan hingga pelaksanaan, kami ada untuk Anda.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-c-green rounded-full flex items-center justify-center mx-auto mb-4 text-c-blue">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-quick font-bold text-xl text-white mb-2">Transaksi Aman</h3>
              <p className="font-sans text-sm text-white/70">Pembayaran dijamin aman dengan sistem escrow terintegrasi.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-c-green rounded-full flex items-center justify-center mx-auto mb-4 text-c-blue">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="font-quick font-bold text-xl text-white mb-2">Kualitas Terjamin</h3>
              <p className="font-sans text-sm text-white/70">Vendor yang telah dikurasi dengan ulasan pelanggan asli.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 bg-c-green rounded-full flex items-center justify-center mx-auto mb-4 text-c-blue">
                <Headphones className="w-6 h-6" />
              </div>
              <h3 className="font-quick font-bold text-xl text-white mb-2">Dukungan 24/7</h3>
              <p className="font-sans text-sm text-white/70">Tim support kami siap membantu Anda kapan saja.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vendors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="font-quick font-bold text-3xl text-neutral-900 mb-2">
            Vendor Unggulan
          </h2>
          <p className="font-sans text-sm text-neutral-500">
            Vendor terpercaya dengan rating terbaik dari customer
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
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
            return (
            <div
              key={vendor.name}
              className="bg-white rounded-xl border border-neutral-200 p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
            >
              <div className="w-12 h-12 relative rounded-lg overflow-hidden mb-3 shadow-sm group-hover:scale-105 transition-transform">
                <Image src={imgUrl} alt={vendor.name} fill className="object-cover" sizes="48px" />
              </div>
              <h3 className="font-quick font-semibold text-sm text-neutral-900 group-hover:text-c-blue transition-colors">
                {vendor.name}
              </h3>
              <div className="flex items-center gap-1 mt-1 mb-2">
                <MapPin className="w-3 h-3 text-neutral-400" />
                <span className="text-xs font-sans text-neutral-500">
                  {vendor.city}
                </span>
              </div>
              <p className="text-xs font-sans text-neutral-500">
                {vendor.count} Produk
              </p>
            </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
