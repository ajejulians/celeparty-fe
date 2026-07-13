"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useSession } from "@/lib/session";
import { products } from "@/lib/data";
import { TicketCard } from "@/components/product/TicketCard";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
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
  Quote,
  ArrowRight
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
  { name: "Rizki Pratama", type: "Music Festival", review: "Booking sound system dan lighting gampang banget. Kualitas alat top, teknisi profesional, acara lancar tanpa kendala.", rating: 5 },
  { name: "Maya Indah", type: "Wedding", review: "Dekorasi pernikahan persis seperti yang saya bayangkan. Tim Celeparty membantu dari awal sampai hari-H.", rating: 5 },
];

const heroBgImages = [
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&h=1080&fit=crop",
];

const vendorAvatars = [
  "https://images.unsplash.com/photo-1516280440502-8610eb675005?w=128&h=128&fit=crop",
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=128&h=128&fit=crop",
  "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&h=128&fit=crop",
  "https://images.unsplash.com/photo-1555244162-803834f70033?w=128&h=128&fit=crop",
  "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=128&h=128&fit=crop",
  "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=128&h=128&fit=crop",
];

function FadeInSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerChildren({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {},
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FloatingVendor() {
  return (
    <div className="relative w-full h-full min-h-[320px] md:min-h-[400px] flex items-center justify-center">
      <motion.div
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-4 left-2 md:top-6 md:left-4 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg"
      >
        <Image src={vendorAvatars[0]} alt="" fill className="object-cover" sizes="64px" />
      </motion.div>
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute top-8 right-4 md:top-10 md:right-6 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg"
      >
        <Image src={vendorAvatars[1]} alt="" fill className="object-cover" sizes="56px" />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="w-24 h-24 md:w-32 md:h-32 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-xl"
      >
        <Image src={vendorAvatars[2]} alt="" fill className="object-cover" sizes="128px" />
      </motion.div>
      <motion.div
        animate={{ y: [8, -8, 8] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-6 left-6 md:bottom-8 md:left-8 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg"
      >
        <Image src={vendorAvatars[3]} alt="" fill className="object-cover" sizes="48px" />
      </motion.div>
      <motion.div
        animate={{ y: [-6, 6, -6] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute bottom-10 right-8 md:bottom-12 md:right-10 w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shadow-lg"
      >
        <Image src={vendorAvatars[4]} alt="" fill className="object-cover" sizes="64px" />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-1/2 right-0 md:right-2 w-10 h-10 md:w-11 md:h-11 rounded-full bg-c-green/30 backdrop-blur-sm border border-c-green/40 flex items-center justify-center shadow-lg"
      >
        <Star className="w-5 h-5 text-c-green" fill="#CBD002" />
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  const session = useSession();
  const isVendorOrAdmin = session.isAuthenticated && (session.role === "vendor" || session.role === "admin");
  const isCustomer = session.isAuthenticated && session.role !== "vendor" && session.role !== "admin";
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroBgImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-50">
      {/* Hero with Carousel Background + 2-col layout */}
      <section className="relative overflow-hidden min-h-[600px] md:min-h-[620px] flex items-center">
        {heroBgImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === currentBgIndex ? 1 : 0 }}
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-cover"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-c-blue/85" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(203,208,2,0.15),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="font-quick font-bold text-4xl lg:text-5xl text-white leading-tight mb-4"
              >
                Temukan Jasa Event Terbaik untuk Momen Spesial Anda
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                className="font-sans text-lg text-white/80 mb-8 max-w-xl"
              >
                Dari sound system, dekorasi, catering, hingga dokumentasi —
                semua vendor event terbaik ada di satu tempat.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.25, ease: "easeOut" }}
                className="relative max-w-lg mb-6"
              >
                <div className="relative group">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-white/50 group-focus-within:text-c-green transition-colors z-10" />
                  <input
                    type="text"
                    placeholder="Cari jasa event... (contoh: sound system, fotografer, catering)"
                    className="w-full pl-12 pr-5 py-4 text-base font-sans rounded-2xl bg-white/15 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:border-c-green focus:bg-white/20 focus:ring-4 focus:ring-c-green/20 transition-all shadow-lg backdrop-blur-sm"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: "easeOut" }}
                className="flex flex-col sm:flex-row gap-3 items-start"
              >
                <Link href="/products">
                  <Button variant="cta" size="lg" className="shadow-lg shadow-c-green/20">
                    Jelajahi Marketplace <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                {isVendorOrAdmin && (
                  <Link href="/user/vendor/dashboard">
                    <Button variant="outline" size="lg" className="bg-white text-purple-700 hover:bg-gray-100 border-white/30">
                      Buat Event
                    </Button>
                  </Link>
                )}
                {isCustomer && (
                  <Link href="/auth/register-vendor">
                    <Button variant="outline" size="lg" className="bg-white text-purple-700 hover:bg-gray-100 border-white/30">
                      Jadi Vendor
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="hidden lg:block"
            >
              <FloatingVendor />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <StaggerChildren className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            {trustMetrics.map((metric) => (
              <StaggerItem key={metric.label} className="text-center flex flex-col items-center">
                <div className="w-12 h-12 bg-c-blue-50 rounded-2xl flex items-center justify-center text-c-blue hover:scale-110 hover:bg-c-blue hover:text-white transition-all duration-300 mb-3">
                  {metric.icon}
                </div>
                <p className="font-quick font-bold text-2xl text-neutral-900">{metric.value}</p>
                <p className="text-sm font-sans text-neutral-500 mt-0.5">{metric.label}</p>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Categories — Bento Grid */}
      <FadeInSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2 className="font-quick font-bold text-3xl md:text-4xl text-neutral-900 mb-3">
              Kategori Populer
            </h2>
            <p className="font-sans text-base text-neutral-500">
              Pilih kategori jasa event sesuai kebutuhan Anda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[180px]">
            <Link
              href={categories[0].href}
              className="md:col-span-2 md:row-span-2 bg-c-blue rounded-2xl p-8 flex flex-col justify-end relative overflow-hidden group hover:brightness-95 active:scale-[0.99] transition-all duration-300 shadow-md hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-c-blue/95 via-c-blue/50 to-transparent z-0" />
              <div className="absolute top-6 right-6 w-20 h-20 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 z-10">
                {categories[0].icon}
              </div>
              <div className="relative z-10">
                <h3 className="font-quick font-bold text-2xl text-white mb-2">{categories[0].name}</h3>
                <p className="font-sans text-base text-white/80 max-w-sm">{categories[0].description}</p>
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
                  <p className="font-sans text-sm text-neutral-500 mt-1 line-clamp-2">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </FadeInSection>

      {/* Popular Events */}
      <section className="bg-white py-20 border-y border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-quick font-bold text-3xl md:text-4xl text-neutral-900 mb-3">
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
          </FadeInSection>
          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product, index) => (
              <StaggerItem key={product.slug}>
                <TicketCard
                  product={product}
                  variant="landing"
                  priority={index === 0}
                />
              </StaggerItem>
            ))}
          </StaggerChildren>
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

      {/* Why Choose Us */}
      <FadeInSection>
        <section className="bg-slate-50 py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-quick font-bold text-3xl md:text-4xl text-neutral-900 mb-4">Mengapa Memilih Celeparty?</h2>
            <p className="font-sans text-base text-neutral-500 max-w-2xl mx-auto mb-16">
              Platform terpercaya yang menghubungkan Anda dengan ribuan vendor profesional di seluruh Indonesia. Dari perencanaan hingga pelaksanaan, kami ada untuk Anda.
            </p>
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { icon: <ShieldCheck className="w-8 h-8" />, title: "Transaksi Aman", desc: "Pembayaran dijamin aman dengan sistem escrow terintegrasi.", color: "bg-emerald-50 text-emerald-600" },
                { icon: <Star className="w-8 h-8" />, title: "Kualitas Terjamin", desc: "Vendor yang telah dikurasi dengan ulasan pelanggan asli yang valid.", color: "bg-c-blue-50 text-c-blue" },
                { icon: <Headphones className="w-8 h-8" />, title: "Dukungan 24/7", desc: "Tim support kami siap membantu Anda kapan saja tanpa henti.", color: "bg-amber-50 text-amber-600" }
              ].map((feature, i) => (
                <StaggerItem key={i}>
                  <div className="bg-white rounded-3xl p-8 border border-neutral-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
                    <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                      {feature.icon}
                    </div>
                    <h3 className="font-quick font-bold text-xl text-neutral-900 mb-3">{feature.title}</h3>
                    <p className="font-sans text-sm text-neutral-500 leading-relaxed">{feature.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>
      </FadeInSection>

      {/* Testimonials Carousel */}
      <FadeInSection>
        <section className="bg-white py-24 border-t border-neutral-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-quick font-bold text-3xl md:text-4xl text-neutral-900 mb-4">Apa Kata Mereka?</h2>
              <p className="font-sans text-base text-neutral-500">
                Ribuan acara telah sukses diselenggarakan bersama Celeparty.
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {testimonials.map((t, idx) => (
                    <CarouselItem key={idx} className="pl-4 md:basis-1/2 lg:basis-1/3">
                      <div className="bg-slate-50 rounded-3xl p-8 border border-neutral-100 relative h-full">
                        <Quote className="absolute top-6 right-6 w-10 h-10 text-c-blue-100 opacity-50" />
                        <div className="flex gap-1 mb-6">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < t.rating ? "text-c-orange fill-c-orange" : "text-neutral-300"}`} />
                          ))}
                        </div>
                        <p className="font-sans text-neutral-700 leading-relaxed mb-8 min-h-[80px]">
                          &ldquo;{t.review}&rdquo;
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-c-blue text-white rounded-full flex items-center justify-center font-quick font-bold text-lg shrink-0">
                            {t.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-quick font-bold text-neutral-900">{t.name}</p>
                            <p className="text-xs font-sans text-neutral-500">{t.type}</p>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center gap-3 mt-8">
                  <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full border-neutral-200 hover:bg-c-blue hover:text-white hover:border-c-blue transition-colors" />
                  <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full border-neutral-200 hover:bg-c-blue hover:text-white hover:border-c-blue transition-colors" />
                </div>
              </Carousel>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Featured Vendors */}
      <FadeInSection>
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

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 px-4 -mx-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
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
                    className="bg-white rounded-2xl border border-neutral-100 p-6 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group min-w-[240px] flex-shrink-0 snap-center"
                  >
                    <div className="w-16 h-16 relative rounded-full overflow-hidden mb-4 shadow-sm mx-auto group-hover:scale-105 transition-transform bg-neutral-100 flex items-center justify-center">
                      <Image
                        src={imgUrl}
                        alt={vendor.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                    <h3 className="font-quick font-semibold text-base text-neutral-900 group-hover:text-c-blue transition-colors text-center truncate">
                      {vendor.name}
                    </h3>
                    <div className="flex items-center justify-center gap-1 mt-1.5 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="text-sm font-sans text-neutral-500">{vendor.city}</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="px-3 py-1 bg-c-blue-50 text-c-blue text-xs font-semibold rounded-full">
                        {vendor.count} Layanan
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
