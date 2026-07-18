"use client";

import { Calendar, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../../../../components/feedback/StatusBadge";
import { EscrowBreakdown } from "../../../../components/payment/EscrowBreakdown";
import { Button } from "../../../../components/ui/button";
import { products } from "../../../../lib/data";
import { useSession } from "../../../../lib/session";
import { formatCurrency, formatDate } from "../../../../lib/utils";
import {
	type RentalFormData,
	rentalFormSchema,
} from "../../../../lib/validators";

const eventTypeOptions = [
	"Pernikahan",
	"Corporate Gathering",
	"Ulang Tahun",
	"Product Launch",
	"Seminar & Workshop",
	"Festival & Konser",
	"Expo & Pameran",
	"Lainnya",
];

export default function ProductDetailPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const resolvedParams = use(params);
	const router = useRouter();
	const session = useSession();
	const product = products.find((p) => p.slug === resolvedParams.slug);

	const [selectedVariant, setSelectedVariant] = useState(0);
	const [qty, setQty] = useState(1);
	const [showForm, setShowForm] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [form, setForm] = useState<RentalFormData>({
		customerName: "",
		customerEmail: "",
		whatsapp: "",
		eventDate: "",
		eventType: "",
		note: "",
	});
	const [formErrors, setFormErrors] = useState<
		Partial<Record<keyof RentalFormData, string>>
	>({});

	useEffect(() => {
		if (product) {
			document.title = `${product.name} | Celeparty`;
		}
	}, [product]);

	if (!product) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
				<h1 className="font-quick font-bold text-2xl text-neutral-900">
					Produk tidak ditemukan
				</h1>
				<Link
					href="/products"
					className="inline-block mt-4 text-c-blue font-quick font-semibold text-sm hover:underline"
				>
					&larr; Kembali ke Katalog
				</Link>
			</div>
		);
	}

	const isSoldOut = product.status === "sold_out";
	const isEscrow = product.status === "escrow_badge";
	const currentVariant = product.variants[selectedVariant];
	const _totalPrice = currentVariant.price * qty;
	const maxQty = isSoldOut ? 0 : 10;

	const decrementQty = () => setQty((q) => Math.max(1, q - 1));
	const incrementQty = () => setQty((q) => Math.min(maxQty, q + 1));

	function updateForm(field: keyof RentalFormData, value: string) {
		setForm((prev) => ({ ...prev, [field]: value }));
		setFormErrors((prev) => ({ ...prev, [field]: undefined }));
	}

	function validateForm(): boolean {
		const result = rentalFormSchema.safeParse(form);
		if (!result.success) {
			const fieldErrors: Partial<Record<keyof RentalFormData, string>> = {};
			result.error.issues.forEach((issue) => {
				const field = issue.path[0] as keyof RentalFormData;
				fieldErrors[field] = issue.message;
			});
			setFormErrors(fieldErrors);
			return false;
		}
		setFormErrors({});
		return true;
	}

	function handleSewaSekarang() {
		if (!session.isAuthenticated) {
			router.push(
				`/auth/login?redirect=${encodeURIComponent(`/products/${product!.slug}`)}`,
			);
			return;
		}
		if (session.role === "vendor" || session.role === "admin") {
			toast.error("Akun vendor/admin tidak dapat melakukan penyewaan. Silakan gunakan akun customer.");
			return;
		}
		setShowForm(true);
	}

	function handleSubmitSewa(e: React.FormEvent) {
		e.preventDefault();
		if (!validateForm()) {
			toast.error("Mohon lengkapi data penyewa dengan benar.");
			return;
		}
		setIsSubmitting(true);

		const payload = {
			product_id: product!.slug,
			product_name: product!.name,
			variant_id: String(selectedVariant),
			variant: currentVariant.name,
			price: String(currentVariant.price),
			quantity: String(qty),
			customer_name: form.customerName,
			telp: form.whatsapp,
			total_price: String(currentVariant.price * qty),
			event_date: form.eventDate,
			event_type: form.eventType,
			note: form.note || "",
		};

		console.log("Rental payload:", payload);
		toast.success("Data penyewa berhasil dikirim!");
		setIsSubmitting(false);
		setShowForm(false);
		router.push(
			`/checkout?product=${encodeURIComponent(product!.slug)}&variant=${selectedVariant}&qty=${qty}`,
		);
	}

	return (
		<div className="bg-neutral-50 min-h-screen pb-24 lg:pb-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<Link
					href="/products"
					className="inline-flex items-center gap-1 text-sm font-sans text-neutral-500 hover:text-c-blue transition-colors mb-6"
				>
					&larr; Kembali ke Katalog
				</Link>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
					<div className="relative aspect-[4/3] bg-neutral-100 rounded-xl overflow-hidden">
						<Image
							src={product.imageUrl}
							alt={product.name}
							fill
							className="object-cover"
						/>
						<StatusBadge status={product.status} />
					</div>

					<div className="flex flex-col">
						<div className="flex items-center gap-2 mb-1">
							<span className="text-xs font-sans text-neutral-500">
								{product.category}
							</span>
							<span className="text-neutral-300">&middot;</span>
							<span className="text-xs font-sans text-neutral-500">
								{product.city}
							</span>
						</div>

						<h1 className="font-quick font-bold text-2xl text-neutral-900 mb-1">
							{product.name}
						</h1>

						<p className="font-quick font-semibold text-sm text-neutral-500 mb-4">
							oleh {product.vendorName}
						</p>

						<div className="mb-6">
							<p className="text-xs font-sans text-neutral-500 mb-1">
								Mulai dari
							</p>
							<p className="font-quick font-bold text-3xl text-c-blue">
								{formatCurrency(product.priceFrom)}
							</p>
						</div>

						<hr className="border-neutral-100 mb-6" />

						<div className="mb-6">
							<h3 className="font-quick font-semibold text-sm text-neutral-900 mb-3">
								Pilih Varian
							</h3>
							<div className="flex gap-3">
								{product.variants.map((variant, i) => (
									<button
										key={variant.name}
										onClick={() => setSelectedVariant(i)}
										disabled={isSoldOut}
										className={`flex-1 px-4 py-3 rounded-lg border-2 text-left transition-all duration-150 ${
											i === selectedVariant
												? "border-c-blue bg-c-blue-50"
												: "border-neutral-200 hover:border-neutral-300"
										} ${isSoldOut ? "opacity-50 cursor-not-allowed" : ""}`}
									>
										<p className="font-quick font-semibold text-sm text-neutral-900">
											{variant.name}
										</p>
										<p className="font-quick font-bold text-base text-c-blue mt-0.5">
											{formatCurrency(variant.price)}
										</p>
									</button>
								))}
							</div>
						</div>

						<div className="mb-6">
							<h3 className="font-quick font-semibold text-sm text-neutral-900 mb-3">
								Jumlah
							</h3>
							<div className="inline-flex items-center border border-neutral-200 rounded-lg">
								<button
									onClick={decrementQty}
									disabled={qty <= 1 || isSoldOut}
									className="w-11 h-11 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors rounded-l-lg disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]"
									aria-label="Kurangi jumlah"
								>
									<Minus className="w-4 h-4" />
								</button>
								<span className="w-12 h-11 flex items-center justify-center font-quick font-semibold text-base text-neutral-900 border-x border-neutral-200">
									{qty}
								</span>
								<button
									onClick={incrementQty}
									disabled={qty >= maxQty || isSoldOut}
									className="w-11 h-11 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors rounded-r-lg disabled:opacity-40 disabled:cursor-not-allowed min-h-[44px] min-w-[44px]"
									aria-label="Tambah jumlah"
								>
									<Plus className="w-4 h-4" />
								</button>
							</div>
						</div>

						<div className="mt-auto">
							<button
								onClick={handleSewaSekarang}
								disabled={isSoldOut}
								className={`w-full inline-flex items-center justify-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-6 py-3 rounded-lg min-h-[44px] transition-all duration-200 hover:brightness-95 hover:shadow-md active:scale-[0.98] ${
									isSoldOut ? "opacity-50 cursor-not-allowed" : ""
								}`}
							>
								{isSoldOut ? "Stok Habis" : "Sewa Sekarang"}
							</button>
						</div>

						<p className="text-xs font-sans text-neutral-500 mt-3">
							<Calendar className="w-3.5 h-3.5 inline mr-1" />
							Tersedia untuk {formatDate(product.date)}
						</p>
					</div>
				</div>

				{showForm && (
					<div className="mt-12 border-t border-neutral-200 pt-8">
						<form onSubmit={handleSubmitSewa} className="max-w-2xl space-y-6">
							<div>
								<h2 className="font-quick font-bold text-xl text-neutral-900 mb-1">
									Form Penyewa
								</h2>
								<p className="font-sans text-sm text-neutral-500">
									Lengkapi data diri Anda sebagai penyewa{" "}
									{product.name} &mdash; {currentVariant.name} &times; {qty}
								</p>
							</div>

							<div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-5">
								<div>
									<label className="block text-sm font-sans font-medium text-neutral-700 mb-1.5">
										Nama Lengkap <span className="text-c-red">*</span>
									</label>
									<input
										type="text"
										value={form.customerName}
										onChange={(e) => updateForm("customerName", e.target.value)}
										placeholder="Sesuai KTP"
										className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white text-neutral-900 font-sans text-base placeholder:text-neutral-400 focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 transition-all"
									/>
									{formErrors.customerName && (
										<p className="text-xs font-sans text-c-red mt-1">
											{formErrors.customerName}
										</p>
									)}
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-sans font-medium text-neutral-700 mb-1.5">
											Email <span className="text-c-red">*</span>
										</label>
										<input
											type="email"
											value={form.customerEmail}
											onChange={(e) =>
												updateForm("customerEmail", e.target.value)
											}
											placeholder="email@contoh.com"
											className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white text-neutral-900 font-sans text-base placeholder:text-neutral-400 focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 transition-all"
										/>
										{formErrors.customerEmail && (
											<p className="text-xs font-sans text-c-red mt-1">
												{formErrors.customerEmail}
											</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-sans font-medium text-neutral-700 mb-1.5">
											No. WhatsApp <span className="text-c-red">*</span>
										</label>
										<input
											type="tel"
											value={form.whatsapp}
											onChange={(e) => updateForm("whatsapp", e.target.value)}
											placeholder="08xxxxxxxxxx"
											className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white text-neutral-900 font-sans text-base placeholder:text-neutral-400 focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 transition-all"
										/>
										{formErrors.whatsapp && (
											<p className="text-xs font-sans text-c-red mt-1">
												{formErrors.whatsapp}
											</p>
										)}
									</div>
								</div>

								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-sans font-medium text-neutral-700 mb-1.5">
											Tanggal Event <span className="text-c-red">*</span>
										</label>
										<input
											type="date"
											value={form.eventDate}
											onChange={(e) => updateForm("eventDate", e.target.value)}
											className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white text-neutral-900 font-sans text-base focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 transition-all"
										/>
										{formErrors.eventDate && (
											<p className="text-xs font-sans text-c-red mt-1">
												{formErrors.eventDate}
											</p>
										)}
									</div>
									<div>
										<label className="block text-sm font-sans font-medium text-neutral-700 mb-1.5">
											Jenis Acara <span className="text-c-red">*</span>
										</label>
										<select
											value={form.eventType}
											onChange={(e) => updateForm("eventType", e.target.value)}
											className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white text-neutral-900 font-sans text-base focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 transition-all"
										>
											<option value="">Pilih jenis acara</option>
											{eventTypeOptions.map((opt) => (
												<option key={opt} value={opt}>
													{opt}
												</option>
											))}
										</select>
										{formErrors.eventType && (
											<p className="text-xs font-sans text-c-red mt-1">
												{formErrors.eventType}
											</p>
										)}
									</div>
								</div>

								<div>
									<label className="block text-sm font-sans font-medium text-neutral-700 mb-1.5">
										Catatan <span className="text-neutral-400">(opsional)</span>
									</label>
									<textarea
										value={form.note}
										onChange={(e) => updateForm("note", e.target.value)}
										placeholder="Instruksi tambahan untuk vendor..."
										rows={3}
										className="w-full px-3 py-2.5 border border-neutral-200 rounded-lg bg-white text-neutral-900 font-sans text-base placeholder:text-neutral-400 focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 transition-all resize-none"
									/>
								</div>
							</div>

							<div className="flex gap-3">
								<Button
									type="button"
									variant="outline"
									size="lg"
									className="flex-1 min-h-[44px]"
									onClick={() => setShowForm(false)}
								>
									Batal
								</Button>
								<Button
									type="submit"
									variant="cta"
									size="lg"
									className="flex-1 min-h-[44px]"
									disabled={isSubmitting}
								>
									{isSubmitting ? "Memproses..." : "Lanjut ke Pembayaran"}
								</Button>
							</div>
						</form>
					</div>
				)}

				{!showForm && (
					<div className="mt-12 border-t border-neutral-100 pt-8">
						<div className="max-w-2xl space-y-8">
							<div>
								<h2 className="font-quick font-bold text-xl text-neutral-900 mb-3">
									Deskripsi
								</h2>
								<p className="font-sans text-base text-neutral-700 leading-relaxed">
									{product.description}
								</p>
							</div>

							{isEscrow && (
								<div>
									<EscrowBreakdown
										totalPrice={currentVariant.price * qty}
									/>
								</div>
							)}

							<div>
								<h2 className="font-quick font-bold text-xl text-neutral-900 mb-3">
									Syarat &amp; Ketentuan
								</h2>
								<ul className="space-y-2">
									<li className="flex gap-2 text-sm font-sans text-neutral-600">
										<span className="text-c-blue mt-0.5">&bull;</span>
										Pembayaran dilakukan di muka minimal 50% untuk konfirmasi
										booking.
									</li>
									<li className="flex gap-2 text-sm font-sans text-neutral-600">
										<span className="text-c-blue mt-0.5">&bull;</span>
										Pembatalan H-7 sebelum event dikenakan biaya 30% dari total.
									</li>
									<li className="flex gap-2 text-sm font-sans text-neutral-600">
										<span className="text-c-blue mt-0.5">&bull;</span>
										Perubahan tanggal dapat dilakukan maksimal H-14 sebelum event.
									</li>
								</ul>
							</div>

							<div>
								<h2 className="font-quick font-bold text-xl text-neutral-900 mb-3">
									Informasi Vendor
								</h2>
								<div className="flex items-center gap-3 bg-white rounded-xl border border-neutral-200 p-4">
									<div className="w-12 h-12 bg-c-blue-50 rounded-full flex items-center justify-center shrink-0">
										<span className="font-quick font-bold text-c-blue text-lg">
											{product.vendorName.charAt(0)}
										</span>
									</div>
									<div>
										<p className="font-quick font-semibold text-neutral-900">
											{product.vendorName}
										</p>
										<p className="text-xs font-sans text-neutral-500">
											Vendor Terverifikasi &middot; {product.city}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>

			{!showForm && (
				<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 lg:hidden z-40">
					<button
						onClick={handleSewaSekarang}
						disabled={isSoldOut}
						className={`w-full inline-flex items-center justify-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-6 py-3 rounded-lg min-h-[44px] transition-all duration-200 hover:brightness-95 active:scale-[0.98] ${
							isSoldOut ? "opacity-50 cursor-not-allowed" : ""
						}`}
					>
						{isSoldOut ? "Stok Habis" : "Sewa Sekarang"}
					</button>
				</div>
			)}
		</div>
	);
}
