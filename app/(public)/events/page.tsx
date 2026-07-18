"use client";

import { motion } from "framer-motion";
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	MapPin,
	Search,
	SlidersHorizontal,
	X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { events } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

const allCategories = Array.from(new Set(events.map((e) => e.category)));
const allLocations = Array.from(
	new Set(events.map((e) => e.location.split(",")[0].trim())),
);

const ITEMS_PER_PAGE = 4;

export default function EventsPage() {
	const [search, setSearch] = useState("");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
	const [selectedLocation, setSelectedLocation] = useState("Semua Lokasi");
	const [priceRange, setPriceRange] = useState(100);
	const [currentPage, setCurrentPage] = useState(1);
	const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

	const filteredEvents = useMemo(() => {
		let result = events;

		if (search) {
			const q = search.toLowerCase();
			result = result.filter(
				(e) =>
					e.title.toLowerCase().includes(q) ||
					e.category.toLowerCase().includes(q) ||
					e.location.toLowerCase().includes(q),
			);
		}

		if (selectedCategories.length > 0) {
			result = result.filter((e) => selectedCategories.includes(e.category));
		}

		if (selectedLocation !== "Semua Lokasi") {
			result = result.filter((e) =>
				e.location.toLowerCase().includes(selectedLocation.toLowerCase()),
			);
		}

		if (priceRange < 100) {
			const maxPrice = (priceRange / 100) * 50000000;
			result = result.filter((e) => e.priceFrom <= maxPrice);
		}

		return result;
	}, [search, selectedCategories, selectedLocation, priceRange]);

	const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
	const paginatedEvents = filteredEvents.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	function toggleCategory(cat: string) {
		setCurrentPage(1);
		setSelectedCategories((prev) =>
			prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
		);
	}

	function resetFilters() {
		setSearch("");
		setSelectedCategories([]);
		setSelectedLocation("Semua Lokasi");
		setPriceRange(100);
		setCurrentPage(1);
	}

	const hasActiveFilters =
		search ||
		selectedCategories.length > 0 ||
		selectedLocation !== "Semua Lokasi" ||
		priceRange < 100;

	function FilterSidebar() {
		return (
			<div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 flex flex-col gap-6 shadow-sm">
				<div className="pb-2">
					<h2 className="font-quick font-bold text-white mb-1">Filters</h2>
					<p className="font-sans text-xs text-neutral-400">
						Refine your search
					</p>
				</div>

				<div>
					<label className="block font-sans text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
						Kata Kunci
					</label>
					<div className="relative">
						<Search
							size={18}
							className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
						/>
						<input
							type="text"
							placeholder="Cari vendor..."
							value={search}
							onChange={(e) => {
								setSearch(e.target.value);
								setCurrentPage(1);
							}}
							className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2.5 text-sm font-sans text-white placeholder:text-neutral-500 focus:border-c-blue focus:ring-1 focus:ring-c-blue/15 outline-none transition-all"
						/>
					</div>
				</div>

				<div>
					<label className="block font-sans text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
						Kategori
					</label>
					<div className="space-y-2.5">
						{allCategories.map((cat) => (
							<label
								key={cat}
								className="flex items-center gap-3 cursor-pointer group"
							>
								<Checkbox
									checked={selectedCategories.includes(cat)}
									onCheckedChange={() => toggleCategory(cat)}
									className="border-neutral-700 data-[state=checked]:bg-c-blue data-[state=checked]:border-c-blue"
								/>
								<span className="font-sans text-sm text-neutral-400 group-hover:text-white transition-colors">
									{cat}
								</span>
							</label>
						))}
					</div>
				</div>

				<div>
					<label className="block font-sans text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
						Rentang Harga
					</label>
					<input
						type="range"
						min={0}
						max={100}
						value={priceRange}
						onChange={(e) => {
							setPriceRange(Number(e.target.value));
							setCurrentPage(1);
						}}
						className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-c-blue"
					/>
					<div className="flex justify-between mt-2 font-sans text-xs text-neutral-500">
						<span>Rp 0</span>
						<span>Rp 50jt+</span>
					</div>
				</div>

				<div>
					<label className="block font-sans text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
						Lokasi
					</label>
					<select
						value={selectedLocation}
						onChange={(e) => {
							setSelectedLocation(e.target.value);
							setCurrentPage(1);
						}}
						className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-sm font-sans text-white focus:border-c-blue focus:ring-1 focus:ring-c-blue/15 outline-none transition-all"
					>
						<option>Semua Lokasi</option>
						{allLocations.map((loc) => (
							<option key={loc}>{loc}</option>
						))}
					</select>
				</div>

				{hasActiveFilters && (
					<button
						type="button"
						onClick={resetFilters}
						className="w-full font-sans text-sm font-medium text-c-red hover:text-c-red/80 transition-colors py-1"
					>
						Reset Semua Filter
					</button>
				)}

				<button
					type="button"
					onClick={() => setMobileFilterOpen(false)}
					className="lg:hidden w-full bg-c-blue text-white py-3 rounded-lg font-quick font-bold text-sm hover:bg-c-blue/90 transition-opacity"
				>
					Terapkan Filter
				</button>
			</div>
		);
	}

	return (
		<div className="bg-neutral-50 min-h-screen">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
				<section className="mb-10">
					<motion.h1
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="font-quick font-extrabold text-4xl md:text-5xl text-c-blue mb-4 tracking-tight"
					>
						Temukan Event Seru
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="font-sans text-lg text-neutral-500 max-w-2xl"
					>
						Jelajahi ribuan vendor event profesional mulai dari lighting tech
						hingga sound system terbaik untuk mewujudkan perayaan impian Anda.
					</motion.p>
				</section>

				<div className="flex flex-col lg:flex-row gap-6">
					<aside className="lg:w-1/4 hidden lg:block">
						<div className="sticky top-24">
							<FilterSidebar />
						</div>
					</aside>

					<div className="lg:hidden mb-4">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setMobileFilterOpen(true)}
							className="gap-2"
						>
							<SlidersHorizontal size={16} />
							Filter
							{hasActiveFilters && (
								<span className="w-2 h-2 rounded-full bg-c-blue" />
							)}
						</Button>
					</div>

					{mobileFilterOpen && (
						<div className="lg:hidden fixed inset-0 z-50">
							<div
								className="absolute inset-0 bg-black/50 backdrop-blur-sm"
								onClick={() => setMobileFilterOpen(false)}
								onKeyDown={() => {}}
							/>
							<div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-6 overflow-y-auto">
								<div className="flex items-center justify-between mb-6">
									<h2 className="font-quick font-bold text-lg text-c-blue">
										Filters
									</h2>
									<button
										type="button"
										onClick={() => setMobileFilterOpen(false)}
										className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
									>
										<X size={20} className="text-neutral-500" />
									</button>
								</div>
								<FilterSidebar />
							</div>
						</div>
					)}

					<div className="lg:w-3/4">
						{filteredEvents.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-20 text-center">
								<div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
									<Search size={32} className="text-neutral-400" />
								</div>
								<h3 className="font-quick font-semibold text-neutral-900 text-lg mb-1">
									Tidak ada event ditemukan
								</h3>
								<p className="font-sans text-sm text-neutral-500 max-w-sm mb-4">
									Coba ubah filter pencarian Anda atau reset semua filter.
								</p>
								<button
									type="button"
									onClick={resetFilters}
									className="font-quick font-semibold text-sm text-c-blue hover:underline"
								>
									Reset Filter
								</button>
							</div>
						) : (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									{paginatedEvents.map((evt, index) => (
										<motion.div
											key={evt.slug}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.4,
												delay: index * 0.05,
											}}
										>
											<Link
												href={`/events/${evt.slug}`}
												className="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-c-blue/50 transition-all duration-300 shadow-sm block h-full"
											>
												<div className="relative h-60 overflow-hidden">
													{evt.imageUrl ? (
														<Image
															src={evt.imageUrl}
															alt={evt.title}
															fill
															className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100"
															sizes="(max-width: 768px) 100vw, 50vw"
														/>
													) : (
														<div className="w-full h-full bg-gradient-to-br from-c-blue/20 to-neutral-800 flex items-center justify-center">
															<span className="text-6xl">🎉</span>
														</div>
													)}
												</div>

												<div className="p-6">
													<h3 className="font-quick font-bold text-lg text-white leading-tight mb-2 group-hover:text-c-blue transition-colors">
														{evt.title}
													</h3>
													<div className="flex items-center gap-2 text-neutral-400 mb-4 text-xs font-sans">
														<Calendar size={14} className="shrink-0" />
														<span>{formatDate(evt.date)}</span>
														<span className="text-neutral-600">&middot;</span>
														<MapPin size={14} className="shrink-0" />
														<span>{evt.location}</span>
													</div>
													<div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-800">
														<div className="flex flex-col">
															<span className="text-xs text-neutral-500 font-sans">
																Mulai dari
															</span>
															<span className="font-quick font-bold text-lg text-c-green">
																{formatCurrency(evt.priceFrom)}
															</span>
														</div>
														<span className="bg-neutral-800 text-neutral-300 border border-neutral-700 px-6 py-2 rounded-full font-quick font-bold text-xs group-hover:bg-c-green group-hover:text-neutral-900 group-hover:border-c-green transition-all">
															Lihat Detail
														</span>
													</div>
												</div>
											</Link>
										</motion.div>
									))}
								</div>

								{totalPages > 1 && (
									<nav className="flex items-center justify-center gap-2 mt-16">
										<button
											type="button"
											onClick={() =>
												setCurrentPage((p) => Math.max(1, p - 1))
											}
											disabled={currentPage === 1}
											className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 hover:border-c-blue transition-colors text-neutral-500 disabled:opacity-40 disabled:cursor-not-allowed"
										>
											<ChevronLeft size={18} />
										</button>
										{Array.from({ length: totalPages }, (_, i) => i + 1).map(
											(page) => (
												<button
													key={page}
													type="button"
													onClick={() => setCurrentPage(page)}
													className={`w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm transition-colors ${
														page === currentPage
															? "bg-c-blue text-white"
															: "border border-neutral-200 hover:border-c-blue text-neutral-600"
													}`}
												>
													{page}
												</button>
											),
										)}
										<button
											type="button"
											onClick={() =>
												setCurrentPage((p) => Math.min(totalPages, p + 1))
											}
											disabled={currentPage === totalPages}
											className="w-10 h-10 flex items-center justify-center rounded-lg border border-neutral-200 hover:border-c-blue transition-colors text-neutral-500 disabled:opacity-40 disabled:cursor-not-allowed"
										>
											<ChevronRight size={18} />
										</button>
									</nav>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
