"use client";

import { X } from "lucide-react";
import { useMemo, useState } from "react";
import { TicketCard } from "@/components/product/TicketCard";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { type Product, products } from "@/lib/data";
import { useFilterStore } from "@/lib/store";

const categories = [
	"Audio & Sound",
	"Fotografi",
	"Dekorasi",
	"Catering",
	"Entertainment",
];

const cities = ["Jakarta", "Bandung", "Surabaya", "Yogyakarta"];

const priceRanges = [
	{
		label: "Di bawah Rp 5.000.000",
		value: "under5m",
		test: (p: Product) => p.priceFrom < 5_000_000,
	},
	{
		label: "Rp 5.000.000 – Rp 10.000.000",
		value: "5to10m",
		test: (p: Product) => p.priceFrom >= 5_000_000 && p.priceFrom <= 10_000_000,
	},
	{
		label: "Di atas Rp 10.000.000",
		value: "above10m",
		test: (p: Product) => p.priceFrom > 10_000_000,
	},
];

export default function ProductsPage() {
	const [isLoading, _setIsLoading] = useState(false);
	const [sortBy, setSortBy] = useState("newest");

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

	const filteredProducts = useMemo(() => {
		let result = [...products];

		if (selectedCategories.length > 0) {
			result = result.filter((p) => selectedCategories.includes(p.category));
		}

		if (selectedCities.length > 0) {
			result = result.filter((p) => selectedCities.includes(p.city));
		}

		if (priceRange) {
			const range = priceRanges.find((r) => r.value === priceRange);
			if (range) result = result.filter(range.test);
		}

		if (sortBy === "price-low") {
			result.sort((a, b) => a.priceFrom - b.priceFrom);
		} else if (sortBy === "price-high") {
			result.sort((a, b) => b.priceFrom - a.priceFrom);
		}

		return result;
	}, [selectedCategories, selectedCities, priceRange, sortBy]);

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<div className="mb-8">
				<h1 className="font-quick font-bold text-3xl text-neutral-900">
					Katalog Produk
				</h1>
				<p className="font-sans text-sm text-neutral-500 mt-1">
					Temukan jasa event terbaik untuk perayaan Anda
				</p>
			</div>

			<div className="flex gap-8">
				<aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start">
					<div className="bg-white rounded-xl border border-neutral-200 p-5">
						<div className="flex items-center justify-between mb-4">
							<h3 className="font-quick font-bold text-sm text-neutral-900">
								Filter
							</h3>
							{activeFilterCount > 0 && (
								<button
									onClick={resetFilters}
									className="text-xs font-sans text-c-blue hover:underline flex items-center gap-1"
								>
									<X size={12} /> Reset
								</button>
							)}
						</div>

						<Accordion
							type="multiple"
							defaultValue={["categories", "cities", "prices"]}
						>
							<AccordionItem value="categories" className="border-neutral-100">
								<AccordionTrigger className="font-quick font-semibold text-sm text-neutral-900 py-3 hover:no-underline">
									Kategori
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2.5">
										{categories.map((cat) => (
											<label
												key={cat}
												className="flex items-center gap-2.5 cursor-pointer group"
											>
												<Checkbox
													checked={selectedCategories.includes(cat)}
													onCheckedChange={() => toggleCategory(cat)}
													className="border-neutral-300 data-[state=checked]:bg-c-blue data-[state=checked]:border-c-blue"
												/>
												<span className="text-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors">
													{cat}
												</span>
											</label>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="cities" className="border-neutral-100">
								<AccordionTrigger className="font-quick font-semibold text-sm text-neutral-900 py-3 hover:no-underline">
									Wilayah
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2.5">
										{cities.map((city) => (
											<label
												key={city}
												className="flex items-center gap-2.5 cursor-pointer group"
											>
												<Checkbox
													checked={selectedCities.includes(city)}
													onCheckedChange={() => toggleCity(city)}
													className="border-neutral-300 data-[state=checked]:bg-c-blue data-[state=checked]:border-c-blue"
												/>
												<span className="text-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors">
													{city}
												</span>
											</label>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>

							<AccordionItem value="prices" className="border-b-0">
								<AccordionTrigger className="font-quick font-semibold text-sm text-neutral-900 py-3 hover:no-underline">
									Harga
								</AccordionTrigger>
								<AccordionContent>
									<div className="space-y-2.5">
										{priceRanges.map((range) => (
											<label
												key={range.value}
												className="flex items-center gap-2.5 cursor-pointer group"
											>
												<Checkbox
													checked={priceRange === range.value}
													onCheckedChange={() => setPriceRange(range.value)}
													className="rounded-full border-neutral-300 data-[state=checked]:bg-c-blue data-[state=checked]:border-c-blue"
												/>
												<span className="text-sm font-sans text-neutral-700 group-hover:text-neutral-900 transition-colors">
													{range.label}
												</span>
											</label>
										))}
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					</div>
				</aside>

				<div className="flex-1 min-w-0">
					<div className="flex items-center justify-between mb-6 flex-wrap gap-3">
						<p className="text-sm font-sans text-neutral-500">
							Menampilkan {filteredProducts.length} produk
						</p>
						<Select value={sortBy} onValueChange={setSortBy}>
							<SelectTrigger className="w-[220px] h-9 text-sm">
								<SelectValue placeholder="Urutkan" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="newest">Urutkan: Terbaru</SelectItem>
								<SelectItem value="price-low">
									Harga: Rendah ke Tinggi
								</SelectItem>
								<SelectItem value="price-high">
									Harga: Tinggi ke Rendah
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{isLoading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
							{Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className="bg-white rounded-lg border border-neutral-100 overflow-hidden"
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
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
							{filteredProducts.map((product) => (
								<TicketCard
									key={product.slug}
									product={product}
									variant="catalog"
								/>
							))}
						</div>
					)}

					<div className="flex items-center justify-center gap-2 mt-10">
						<Button
							variant="outline"
							size="sm"
							className="w-9 h-9 p-0"
							disabled
						>
							&laquo;
						</Button>
						<Button variant="default" size="sm" className="w-9 h-9 p-0">
							1
						</Button>
						<Button variant="outline" size="sm" className="w-9 h-9 p-0">
							2
						</Button>
						<Button variant="outline" size="sm" className="w-9 h-9 p-0">
							&raquo;
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
