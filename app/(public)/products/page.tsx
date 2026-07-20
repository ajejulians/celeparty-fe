"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TicketCard } from "@/components/product/TicketCard";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getProducts, getCategories } from "@/lib/api/products";
import { adaptStrapiProductToProduct } from "@/lib/adapters/product";
import type { Product } from "@/lib/data";
import { useFilterStore } from "@/lib/store";

const priceRanges = [
	{ label: "Di bawah Rp 5.000.000", value: "under5m", min: 0, max: 5_000_000 },
	{ label: "Rp 5.000.000 – Rp 10.000.000", value: "5to10m", min: 5_000_000, max: 10_000_000 },
	{ label: "Di atas Rp 10.000.000", value: "above10m", min: 10_000_001, max: undefined },
];

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [products, setProducts] = useState<Product[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [apiCategories, setApiCategories] = useState<string[]>([]);
	const [apiCities, setApiCities] = useState<string[]>([]);
	const [sortBy, setSortBy] = useState("newest");
	const [search, setSearch] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

	const {
		selectedCategories,
		selectedCities,
		priceRange,
		toggleCategory,
		toggleCity,
		setPriceRange,
		resetFilters,
	} = useFilterStore();

	const activeFilterCount =
		selectedCategories.length + selectedCities.length + (priceRange ? 1 : 0);

	const hasActiveFilters = activeFilterCount > 0 || search.length > 0;

	useEffect(() => {
		let cancelled = false;
		setIsLoading(true);

		const range = priceRange ? priceRanges.find((r) => r.value === priceRange) : null;
		const sort = sortBy === "price-low" ? "main_price:asc" : sortBy === "price-high" ? "main_price:desc" : undefined;

		getProducts({
			category: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
			city: selectedCities.length === 1 ? selectedCities[0] : undefined,
			priceMin: range?.min,
			priceMax: range?.max,
			search: search || undefined,
			page: currentPage,
			pageSize: ITEMS_PER_PAGE,
			sort,
		})
			.then((res) => {
				if (cancelled) return;
				setProducts(res.data.map(adaptStrapiProductToProduct));
				setTotalCount(res.meta.pagination.total);
				setTotalPages(res.meta.pagination.pageCount);
			})
			.catch(() => {})
			.finally(() => {
				if (!cancelled) setIsLoading(false);
			});

		return () => { cancelled = true; };
	}, [selectedCategories, selectedCities, priceRange, sortBy, search, currentPage]);

	useEffect(() => {
		getCategories()
			.then((res) => {
				const cats = res.data.map((c) => c.title);
				setApiCategories(cats);
			})
			.catch(() => {});
	}, []);

	useEffect(() => {
		getProducts({ pageSize: 100 })
			.then((res) => {
				const cities = [...new Set(res.data
					.map((p) => p.kota_event)
					.filter(Boolean))].sort() as string[];
				setApiCities(cities);
			})
			.catch(() => {});
	}, []);

	function FilterSidebar() {
		return (
			<div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col gap-6 shadow-sm">
				<div className="flex items-center justify-between pb-2">
					<h3 className="font-quick font-bold text-white">Filters</h3>
					{hasActiveFilters && (
						<button
							type="button"
							onClick={() => {
								resetFilters();
								setSearch("");
								setCurrentPage(1);
							}}
							className="text-xs font-sans text-c-green hover:underline flex items-center gap-1"
						>
							<X size={12} /> Reset
						</button>
					)}
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
						{apiCategories.map((cat) => (
							<label
								key={cat}
								className="flex items-center gap-3 cursor-pointer group"
							>
								<Checkbox
									checked={selectedCategories.includes(cat)}
									onCheckedChange={() => {
										toggleCategory(cat);
										setCurrentPage(1);
									}}
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
						Wilayah
					</label>
					<div className="space-y-2.5">
						{apiCities.map((city) => (
							<label
								key={city}
								className="flex items-center gap-3 cursor-pointer group"
							>
								<Checkbox
									checked={selectedCities.includes(city)}
									onCheckedChange={() => {
										toggleCity(city);
										setCurrentPage(1);
									}}
									className="border-neutral-700 data-[state=checked]:bg-c-blue data-[state=checked]:border-c-blue"
								/>
								<span className="font-sans text-sm text-neutral-400 group-hover:text-white transition-colors">
									{city}
								</span>
							</label>
						))}
					</div>
				</div>

				<div>
					<label className="block font-sans text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
						Harga
					</label>
					<div className="space-y-2.5">
						{priceRanges.map((range) => (
							<label
								key={range.value}
								className="flex items-center gap-3 cursor-pointer group"
							>
								<Checkbox
									checked={priceRange === range.value}
									onCheckedChange={() => {
										setPriceRange(range.value);
										setCurrentPage(1);
									}}
									className="border-neutral-700 data-[state=checked]:bg-c-blue data-[state=checked]:border-c-blue"
								/>
								<span className="font-sans text-sm text-neutral-400 group-hover:text-white transition-colors">
									{range.label}
								</span>
							</label>
						))}
					</div>
				</div>

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
						Katalog Produk
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="font-sans text-lg text-neutral-500 max-w-2xl"
					>
						Temukan jasa event terbaik untuk perayaan Anda
					</motion.p>
				</section>

				<div className="flex flex-col lg:flex-row gap-6">
					<aside className="lg:w-64 shrink-0 hidden lg:block">
						<div className="sticky top-24">
							<FilterSidebar />
						</div>
					</aside>

					<div className="lg:hidden mb-4">
						<button
							type="button"
							onClick={() => setMobileFilterOpen(true)}
							className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 px-4 py-2.5 rounded-lg text-sm font-sans hover:border-c-blue/50 transition-colors shadow-sm"
						>
							<SlidersHorizontal size={16} />
							Filter
							{hasActiveFilters && (
								<span className="w-2 h-2 rounded-full bg-c-blue" />
							)}
						</button>
					</div>

					{mobileFilterOpen && (
						<div className="lg:hidden fixed inset-0 z-50">
							<div
								className="absolute inset-0 bg-black/50 backdrop-blur-sm"
								onClick={() => setMobileFilterOpen(false)}
								onKeyDown={() => {}}
							/>
							<div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white p-6 overflow-y-auto border-l border-neutral-200">
								<div className="flex items-center justify-between mb-6">
									<h2 className="font-quick font-bold text-lg text-neutral-900">
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

					<div className="flex-1 min-w-0">
						<div className="flex items-center justify-between mb-6 flex-wrap gap-3">
							<p className="text-sm font-sans text-neutral-500">
								Menampilkan {totalCount} produk
							</p>
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[220px] h-10 text-sm bg-white border border-neutral-200 text-neutral-700 focus:border-c-blue focus:ring-1 focus:ring-c-blue/15">
									<SelectValue placeholder="Urutkan" />
								</SelectTrigger>
								<SelectContent className="bg-white border border-neutral-200 text-neutral-700">
									<SelectItem value="newest" className="focus:bg-neutral-100 focus:text-neutral-900">
										Urutkan: Terbaru
									</SelectItem>
									<SelectItem value="price-low" className="focus:bg-neutral-100 focus:text-neutral-900">
										Harga: Rendah ke Tinggi
									</SelectItem>
									<SelectItem value="price-high" className="focus:bg-neutral-100 focus:text-neutral-900">
										Harga: Tinggi ke Rendah
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{isLoading ? (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{Array.from({ length: 8 }).map((_, i) => (
									<div
										key={i}
										className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm"
									>
										<Skeleton className="aspect-[4/3] rounded-none" />
										<div className="p-4 space-y-3">
											<Skeleton className="h-3 w-24" />
											<Skeleton className="h-5 w-full" />
											<Skeleton className="h-5 w-3/4" />
											<Skeleton className="h-9 w-full mt-3" />
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{products.map((product) => (
									<TicketCard
										key={product.slug}
										product={product}
										variant="catalog"
									/>
								))}
							</div>
						)}

						{products.length === 0 && !isLoading && (
							<div className="flex flex-col items-center justify-center py-20 text-center">
								<div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
									<Search size={32} className="text-neutral-400" />
								</div>
								<h3 className="font-quick font-semibold text-neutral-900 text-lg mb-1">
									Tidak ada produk ditemukan
								</h3>
								<p className="font-sans text-sm text-neutral-500 max-w-sm mb-4">
									Coba ubah filter pencarian Anda atau reset semua filter.
								</p>
								<button
									type="button"
									onClick={() => {
										resetFilters();
										setSearch("");
										setCurrentPage(1);
									}}
									className="font-quick font-semibold text-sm text-c-blue hover:underline"
								>
									Reset Filter
								</button>
							</div>
						)}

						{totalPages > 1 && (
							<nav className="flex items-center justify-center gap-2 mt-16">
								<button
									type="button"
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
					</div>
				</div>
			</div>
		</div>
	);
}
