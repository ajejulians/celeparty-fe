"use client";

import { motion, useInView } from "framer-motion";
import {
	ArrowRight,
	Headphones,
	MapPin,
	Quote,
	Search,
	ShieldCheck,
	Star,
	Calendar,
	ArrowRightLeft,
	ShoppingCart,
	Globe,
	ChevronLeft,
	ChevronRight,
	Speaker,
	Theater,
	Cast,
	Tent,
	Utensils,
	Lightbulb,
	StarsIcon,
	Camera,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TicketCard } from "@/components/product/TicketCard";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/data";
import { useSession } from "@/lib/session";

const uniqueVendors = Array.from(
	new Map(
		products.map((p) => [p.vendorName, { name: p.vendorName, city: p.city }]),
	).values(),
);

const vendorProductCounts = uniqueVendors.map((v) => ({
	...v,
	count: products.filter((p) => p.vendorName === v.name).length,
}));

function FadeInSection({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
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

function StaggerChildren({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
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

function StaggerItem({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<motion.div
			variants={{
				hidden: { opacity: 0, y: 30 },
				visible: {
					opacity: 1,
					y: 0,
					transition: { duration: 0.5, ease: "easeOut" },
				},
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

const heroBgImages = [
	"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=1080&fit=crop",
	"https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop",
	"https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1920&h=1080&fit=crop",
	"https://images.unsplash.com/photo-1555244162-803834f70033?w=1920&h=1080&fit=crop",
];

export default function HomePage() {
	const session = useSession();
	const isVendorOrAdmin =
		session.isAuthenticated &&
		(session.role === "vendor" || session.role === "admin");
	const isCustomer =
		session.isAuthenticated &&
		session.role !== "vendor" &&
		session.role !== "admin";

	const [currentBgIndex, setCurrentBgIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentBgIndex((prev) => (prev + 1) % heroBgImages.length);
		}, 5000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div className="bg-[#131313] text-[#e5e2e1] overflow-x-hidden font-sans">
			{/* Custom Styles */}
			<style jsx global>{`
				.glass-card {
					background: rgba(255, 255, 255, 0.05);
					backdrop-filter: blur(20px);
					border: 1px solid rgba(255, 255, 255, 0.1);
				}
				.glow-chartreuse {
					box-shadow: 0 0 20px rgba(210, 240, 0, 0.3);
				}
				.glow-chartreuse:hover {
					box-shadow: 0 0 30px rgba(210, 240, 0, 0.5);
				}
			`}</style>

			{/* Hero Section */}
			<section className="pt-32 pb-24 relative overflow-hidden min-h-[600px] flex items-center justify-center">
				{/* Background Carousel */}
				<div className="absolute inset-0 z-0">
					{heroBgImages.map((img, i) => (
						<motion.div
							key={img}
							initial={{ opacity: 0 }}
							animate={{ opacity: i === currentBgIndex ? 0.35 : 0 }}
							transition={{ duration: 1 }}
							className="absolute inset-0"
						>
							<Image
								src={img}
								alt="Background"
								fill
								className="object-cover"
								priority={i === 0}
							/>
						</motion.div>
					))}
					<div className="absolute inset-0 bg-gradient-to-b from-[#4b0082]/90 via-[#131313]/95 to-[#131313]" />
				</div>

				<div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
					{/* OSS Hero Animation with Framer Motion */}
					<motion.div
						initial="hidden"
						animate="visible"
						variants={{
							hidden: { opacity: 0 },
							visible: {
								opacity: 1,
								transition: {
									staggerChildren: 0.2,
								},
							},
						}}
						className="flex flex-col items-center"
					>
						<motion.h1
							variants={{
								hidden: { opacity: 0, y: 50 },
								visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
							}}
							className="font-extrabold text-4xl md:text-6xl text-white mb-6 max-w-4xl tracking-tight leading-tight"
						>
							Temukan Jasa Event Terbaik untuk Momen Spesial Anda
						</motion.h1>

						{/* Compact Search Bar */}
						<motion.div
							variants={{
								hidden: { opacity: 0, scale: 0.9 },
								visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 120 } }
							}}
							className="w-full max-w-2xl bg-[#2a2a2a]/90 backdrop-blur-md rounded-full p-2 flex items-center mb-12 border border-[#4c4451] focus-within:border-[#d2f000] focus-within:ring-2 focus-within:ring-[#d2f000]/20 transition-all shadow-xl"
						>
							<Search className="px-4 text-[#978d9d] w-14 h-6" />
							<input
								className="bg-transparent border-none focus:ring-0 text-[#e5e2e1] w-full placeholder:text-neutral-500 focus:outline-none"
								placeholder="Cari vendor musik, catering, atau fotografer..."
								type="text"
							/>
							<button className="bg-[#d2f000] hover:bg-[#b8d300] text-[#191e00] font-bold px-8 py-3 rounded-full mr-1 transition-colors">
								Cari
							</button>
						</motion.div>

						{/* Stats */}
						<motion.div
							variants={{
								hidden: { opacity: 0 },
								visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
							}}
							className="flex flex-wrap justify-center gap-12 mb-16"
						>
							<motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col">
								<span className="text-4xl md:text-5xl font-bold text-[#d2f000]">500+</span>
								<span className="text-sm text-[#cec3d3] mt-1">Vendor Terpercaya</span>
							</motion.div>
							<motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col">
								<span className="text-4xl md:text-5xl font-bold text-[#d2f000]">200+</span>
								<span className="text-sm text-[#cec3d3] mt-1">Kategori Jasa</span>
							</motion.div>
							<motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} className="flex flex-col">
								<span className="text-4xl md:text-5xl font-bold text-[#d2f000]">10k+</span>
								<span className="text-sm text-[#cec3d3] mt-1">Event Sukses</span>
							</motion.div>
						</motion.div>

						{/* Personalized Card */}
						<motion.div
							variants={{
								hidden: { opacity: 0, y: 30 },
								visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
							}}
							className="glass-card rounded-2xl p-6 flex items-center gap-6 text-left max-w-lg border-[#ddb7ff]/20 shadow-2xl"
						>
							<div className="w-16 h-16 rounded-full bg-[#d2f000] flex items-center justify-center flex-shrink-0">
								<Calendar className="text-[#191e00] w-8 h-8" />
							</div>
							<div>
								<h4 className="text-lg font-bold text-white mb-1">Halo, Rekan Celeparty!</h4>
								<p className="text-sm text-[#cec3d3]">
									Rencanakan event impian Anda bersama vendor kurasi terbaik kami hari ini.
								</p>
							</div>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* Kategori Jasa & Produk - New from Stitch Design */}
			<section className="py-12 bg-[#131313] border-b border-white/5 relative z-30">
				<div className="max-w-7xl mx-auto px-6">
					<FadeInSection>
						<div className="flex justify-between items-center mb-8">
							<h2 className="text-xl md:text-2xl font-bold text-white">Kategori Jasa &amp; Produk</h2>
							<Link href="/products" className="text-[#d2f000] hover:underline flex items-center gap-2 text-sm font-bold">
								Lihat Semua <ArrowRight className="w-4 h-4" />
							</Link>
						</div>
					</FadeInSection>
					<StaggerChildren className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-6">
						{[
							{ name: "Sound System", icon: <Speaker className="w-6 h-6 text-[#d2f000]" />, href: "/products?category=Audio+%26+Sound" },
							{ name: "Lighting", icon: <Lightbulb className="w-6 h-6 text-[#d2f000]" />, href: "/products?category=Lighting" },
							{ name: "Panggung", icon: <Theater className="w-6 h-6 text-[#d2f000]" />, href: "/products?category=Panggung" },
							{ name: "LED Screen", icon: <Cast className="w-6 h-6 text-[#d2f000]" />, href: "/products?category=LED+Screen" },
							{ name: "Dekorasi", icon: <StarsIcon className="w-6 h-6 text-[#d2f000]" />, href: "/products?category=Dekorasi" },
							{ name: "Dokumentasi", icon: <Camera className="w-6 h-6 text-[#d2f000]" />, href: "/products?category=Fotografi" },
							{ name: "Tenda", icon: <Tent className="w-6 h-6 text-[#d2f000]" />, href: "/products?category=Tenda" },
							{ name: "Entertainment", icon: <Star className="w-6 h-6 text-[#d2f000]" />, href: "/products?category=Entertainment" },
							{ name: "Catering", icon: <Utensils className="w-6 h-6 text-[#d2f000]" />, href: "/products?category=Catering" },
						].map((cat) => (
							<StaggerItem key={cat.name} className="flex flex-col items-center gap-3">
								<Link href={cat.href} className="flex flex-col items-center gap-3 group cursor-pointer">
									<div className="w-16 h-16 rounded-2xl bg-[#2a2a2a] flex items-center justify-center group-hover:scale-110 group-hover:shadow-[0_0_15px_rgba(210,240,0,0.3)] transition-all">
										{cat.icon}
									</div>
									<span className="text-xs font-semibold text-[#cec3d3] group-hover:text-white transition-colors text-center">{cat.name}</span>
								</Link>
							</StaggerItem>
						))}
					</StaggerChildren>
				</div>
			</section>

			{/* Bento Categories */}
			<section className="bg-white text-[#131313] pt-24 pb-24 rounded-t-[48px] -mt-12 relative z-20 shadow-inner">
				<div className="max-w-7xl mx-auto px-6">
					<FadeInSection>
						<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
							<div>
								<h2 className="text-3xl md:text-4xl font-extrabold text-[#131313] mb-2">Kategori Populer</h2>
								<p className="text-lg text-[#353534]">Temukan spesialisasi yang tepat untuk tema acara Anda.</p>
							</div>
							<Link
								href="/products"
								className="text-[#4b0082] font-bold hover:underline flex items-center gap-2 group transition-all"
							>
								Lihat Semua <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
							</Link>
						</div>
					</FadeInSection>

					{/* Bento Grid */}
					<StaggerChildren className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[600px]">
						{/* Large Box 1: Musik */}
						<StaggerItem className="md:col-span-7 group relative overflow-hidden rounded-3xl bg-[#4b0082] text-white p-8 flex flex-col justify-end min-h-[300px]">
							<div className="absolute inset-0 opacity-40 group-hover:scale-110 transition-transform duration-700">
								<Image
									src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&fit=crop"
									alt="Musik & Sound"
									fill
									className="object-cover"
								/>
							</div>
							<div className="relative z-10">
								<div className="flex items-center gap-3 mb-4">
									<h3 className="text-2xl font-bold">Musik &amp; Sound</h3>
								</div>
								<p className="text-sm text-purple-200 max-w-md">Dari band jazz elegan hingga DJ festival yang menggetarkan, temukan ritme yang pas untuk audiens Anda.</p>
							</div>
						</StaggerItem>

						{/* Small Box 1: Kuliner */}
						<StaggerItem className="md:col-span-5 group relative overflow-hidden rounded-3xl bg-[#d2f000] p-8 flex flex-col justify-between min-h-[250px]">
							<div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700">
								<Image
									src="https://images.unsplash.com/photo-1555244162-803834f70033?w=600&fit=crop"
									alt="Kuliner"
									fill
									className="object-cover"
								/>
							</div>
							<div className="relative z-10 flex flex-col h-full justify-between">
								<span className="text-[#191e00] text-xl font-bold">Catering</span>
								<div>
									<h3 className="text-xl font-bold text-[#191e00] mt-16">Kuliner &amp; Sajian</h3>
									<p className="text-sm text-[#191e00]/80">Menu kurasi dari koki bintang lima untuk segala skala acara.</p>
								</div>
							</div>
						</StaggerItem>

						{/* Small Box 2: Seni & Dekorasi */}
						<StaggerItem className="md:col-span-5 group relative overflow-hidden rounded-3xl bg-[#003a19] text-[#00e475] p-8 flex flex-col justify-between min-h-[250px]">
							<div className="absolute inset-0 opacity-20 group-hover:scale-110 transition-transform duration-700">
								<Image
									src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&fit=crop"
									alt="Seni & Dekorasi"
									fill
									className="object-cover"
								/>
							</div>
							<div className="relative z-10 flex flex-col h-full justify-between">
								<span className="text-[#00e475] text-xl font-bold">Dekorasi</span>
								<div>
									<h3 className="text-xl font-bold text-[#00e475] mt-16">Seni &amp; Dekorasi</h3>
									<p className="text-sm text-[#00e475]/80">Transformasi ruang dengan estetika modern yang magis.</p>
								</div>
							</div>
						</StaggerItem>

						{/* Large Box 2: Fotografi */}
						<StaggerItem className="md:col-span-7 group relative overflow-hidden rounded-3xl bg-[#131313] text-white p-8 flex flex-col justify-end min-h-[300px]">
							<div className="absolute inset-0 opacity-50 group-hover:scale-110 transition-transform duration-700">
								<Image
									src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&fit=crop"
									alt="Fotografi"
									fill
									className="object-cover"
								/>
							</div>
							<div className="relative z-10">
								<div className="flex items-center gap-3 mb-4">
									<h3 className="text-2xl font-bold">Dokumentasi</h3>
								</div>
								<p className="text-sm text-[#cec3d3] max-w-md">Dokumentasi sinematik yang menangkap setiap emosi and detail berharga secara abadi.</p>
							</div>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Event Tersedia - New from Stitch Design */}
			<section className="py-24 bg-[#131313] border-b border-white/5 relative z-30">
				<div className="max-w-7xl mx-auto px-6">
					<FadeInSection>
						<div className="flex justify-between items-center mb-12">
							<h2 className="text-3xl font-bold text-white">Event Tersedia</h2>
							<Link href="/products" className="text-[#d2f000] hover:underline flex items-center gap-2 text-sm font-bold">
								Lihat Semua <ArrowRight className="w-4 h-4" />
							</Link>
						</div>
					</FadeInSection>
					<StaggerChildren className="grid grid-cols-1 md:grid-cols-4 gap-6">
						{[
							{
								title: "Summer Jazz Night",
								date: "15 Agustus 2024",
								img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&fit=crop"
							},
							{
								title: "Tech Innovators Gala",
								date: "22 Agustus 2024",
								img: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&fit=crop"
							},
							{
								title: "Modern Art Showcase",
								date: "05 September 2024",
								img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&fit=crop"
							},
							{
								title: "Grand Wedding Expo",
								date: "12 September 2024",
								img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=600&fit=crop"
							}
						].map((evt) => (
							<StaggerItem key={evt.title}>
								<div className="group bg-[#1c1b1b] rounded-2xl overflow-hidden border border-white/5 hover:border-[#d2f000]/30 transition-all">
									<div className="h-40 overflow-hidden relative">
										<Image src={evt.img} alt={evt.title} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
									</div>
									<div className="p-4">
										<h4 className="text-lg font-bold text-white mb-1">{evt.title}</h4>
										<p className="text-xs text-[#cec3d3]">{evt.date}</p>
									</div>
								</div>
							</StaggerItem>
						))}
					</StaggerChildren>
				</div>
			</section>

			{/* Escrow Section */}
			<section className="py-24 bg-[#0e0e0e] overflow-hidden">
				<div className="max-w-7xl mx-auto px-6">
					<FadeInSection>
						<div className="text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Alur Transaksi Aman Celeparty (Escrow)</h2>
							<p className="text-lg text-[#cec3d3]">Melindungi kenyamanan User dan keamanan Vendor di setiap langkah.</p>
						</div>
					</FadeInSection>

					<StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
						<StaggerItem className="flex flex-col items-center text-center p-6 bg-[#1c1b1b] rounded-2xl border border-white/5 hover:scale-105 transition-transform duration-300">
							<div className="w-16 h-16 rounded-full bg-[#d2f000]/10 border-2 border-[#d2f000] flex items-center justify-center mb-6">
								<ShoppingCart className="text-[#d2f000] w-8 h-8" />
							</div>
							<h4 className="text-lg font-bold text-white mb-2">User Bayar</h4>
							<p className="text-sm text-[#cec3d3]">Pembayaran via sistem checkout Celeparty</p>
						</StaggerItem>

						<StaggerItem className="flex flex-col items-center text-center p-6 bg-[#1c1b1b] rounded-2xl border border-white/5 hover:scale-105 transition-transform duration-300">
							<div className="w-16 h-16 rounded-full bg-[#d2f000]/10 border-2 border-[#d2f000] flex items-center justify-center mb-6">
								<ShieldCheck className="text-[#d2f000] w-8 h-8" />
							</div>
							<h4 className="text-lg font-bold text-white mb-2">Dana Ditampung</h4>
							<p className="text-sm text-[#cec3d3]">Dana disimpan aman di rekening bersama (escrow)</p>
						</StaggerItem>

						<StaggerItem className="flex flex-col items-center text-center p-6 bg-[#1c1b1b] rounded-2xl border border-white/5 hover:scale-105 transition-transform duration-300">
							<div className="w-16 h-16 rounded-full bg-white/5 border-2 border-neutral-600 flex items-center justify-center mb-6">
								<Calendar className="text-neutral-400 w-8 h-8" />
							</div>
							<h4 className="text-lg font-bold text-white mb-2">Vendor Bekerja</h4>
							<p className="text-sm text-[#cec3d3]">Pengerjaan jasa sesuai tanggal &amp; kesepakatan</p>
						</StaggerItem>

						<StaggerItem className="flex flex-col items-center text-center p-6 bg-[#1c1b1b] rounded-2xl border border-white/5 hover:scale-105 transition-transform duration-300">
							<div className="w-16 h-16 rounded-full bg-white/5 border-2 border-neutral-600 flex items-center justify-center mb-6">
								<Star className="text-neutral-400 w-8 h-8" />
							</div>
							<h4 className="text-lg font-bold text-white mb-2">User Konfirmasi</h4>
							<p className="text-sm text-[#cec3d3]">Review &amp; konfirmasi setelah pengerjaan selesai</p>
						</StaggerItem>

						<StaggerItem className="flex flex-col items-center text-center p-6 bg-[#1c1b1b] rounded-2xl border border-white/5 hover:scale-105 transition-transform duration-300">
							<div className="w-16 h-16 rounded-full bg-white/5 border-2 border-neutral-600 flex items-center justify-center mb-6">
								<ArrowRightLeft className="text-neutral-400 w-8 h-8" />
							</div>
							<h4 className="text-lg font-bold text-white mb-2">Dana Cair</h4>
							<p className="text-sm text-[#cec3d3]">Dana diteruskan langsung ke saldo Vendor</p>
						</StaggerItem>
					</StaggerChildren>
				</div>
			</section>

			{/* Products Grid */}
			<section className="py-24 bg-white text-[#131313]">
				<div className="max-w-7xl mx-auto px-6">
					<FadeInSection>
						<div className="flex justify-between items-end mb-12">
							<div>
								<h2 className="text-3xl md:text-4xl font-extrabold">Event Populer</h2>
								<p className="text-[#353534] mt-2">Temukan jasa event yang paling diminati untuk menyukseskan acara Anda.</p>
							</div>
							<div className="flex gap-4">
								<Link
									href="/products"
									className="font-bold text-[#4b0082] bg-[#4b0082]/10 hover:bg-[#4b0082]/20 px-6 py-3 rounded-full transition-colors"
								>
									Lihat Semua
								</Link>
							</div>
						</div>
					</FadeInSection>

					<StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{products.slice(0, 4).map((product, idx) => (
							<StaggerItem key={product.slug}>
								<div className="group rounded-3xl overflow-hidden border border-neutral-100 hover:shadow-2xl transition-all duration-300">
									<TicketCard
										product={product}
										variant="landing"
										priority={idx === 0}
									/>
								</div>
							</StaggerItem>
						))}
					</StaggerChildren>
				</div>
			</section>

			{/* Vendor Headshots */}
			<section className="py-20 bg-[#1c1b1b] border-t border-white/5">
				<div className="max-w-7xl mx-auto px-6 text-center">
					<FadeInSection>
						<h2 className="text-2xl md:text-3xl font-bold text-white mb-12">Bekerja Sama dengan Vendor Terbaik</h2>
					</FadeInSection>
					<StaggerChildren className="flex flex-wrap justify-center gap-8 md:gap-12 items-center opacity-80">
						{vendorProductCounts.slice(0, 5).map((vendor, index) => {
							const vendorImages = [
								"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop",
								"https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=128&h=128&fit=crop",
								"https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&h=128&fit=crop",
								"https://images.unsplash.com/photo-1555244162-803834f70033?w=128&h=128&fit=crop",
								"https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=128&h=128&fit=crop",
							];
							const imgUrl = vendorImages[index % vendorImages.length];

							return (
								<StaggerItem key={vendor.name}>
									<div className="flex flex-col items-center gap-3">
										<div className="w-20 h-20 rounded-full border-2 border-[#d2f000] p-1 overflow-hidden relative bg-neutral-800">
											<Image
												src={imgUrl}
												alt={vendor.name}
												fill
												className="object-cover rounded-full"
											/>
										</div>
										<span className="text-sm font-semibold text-[#cec3d3]">{vendor.name}</span>
									</div>
								</StaggerItem>
							);
						})}
					</StaggerChildren>
				</div>
			</section>
		</div>
	);
}

