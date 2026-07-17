"use client";

import {
	AlertCircle,
	Calendar,
	CheckCircle2,
	ChevronLeft,
	Clock,
	Download,
	MapPin,
	MessageCircle,
	ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// --- 1. TypeScript Interfaces ---

export type BookingStatus =
	| "Menunggu Pembayaran"
	| "Menunggu DP"
	| "DP Dibayar"
	| "Dibayar"
	| "Proses Vendor"
	| "Selesai"
	| "Dibatalkan"
	| "Kadaluarsa"
	| "DP Direfund";

export interface VendorDetail {
	id: string;
	name: string;
	location: string;
	avatarUrl: string;
}

export interface ProductDetail {
	id: string;
	title: string;
	variant: string;
	imageUrl: string;
	qty: number;
}

export interface LogisticsDetail {
	eventDate: string;
	setupTime: string;
	venueAddress: string;
	specialNotes?: string;
}

export interface PriceBreakdown {
	subtotal: number;
	serviceFee: number;
	discount: number;
	grandTotal: number;
}

export interface BookingDetail {
	id: string;
	invoiceId: string;
	orderDate: string;
	status: BookingStatus;
	vendor: VendorDetail;
	product: ProductDetail;
	logistics: LogisticsDetail;
	pricing: PriceBreakdown;
}

// --- 2. Sub-components ---

const StatusTracker = ({ status }: { status: BookingStatus }) => {
	const steps = ["Menunggu Pembayaran", "Dibayar", "Proses Vendor", "Selesai"];

	if (
		status === "Dibatalkan" ||
		status === "Kadaluarsa" ||
		status === "DP Direfund"
	) {
		const errorLabel =
			status === "Dibatalkan"
				? "Pesanan Dibatalkan"
				: status === "Kadaluarsa"
					? "Pesanan Kadaluarsa"
					: "DP Direfund";
		const errorMsg =
			status === "Dibatalkan"
				? "Pesanan ini telah dibatalkan."
				: status === "Kadaluarsa"
					? "Pesanan ini telah kadaluarsa."
					: "DP telah direfund.";
		return (
			<div className="bg-c-red-50 border border-c-red/20 rounded-xl p-4 flex items-center gap-3">
				<AlertCircle className="w-6 h-6 text-c-red" />
				<div>
					<h4 className="font-quick font-bold text-c-red">{errorLabel}</h4>
					<p className="font-sans text-sm text-c-red/80">{errorMsg}</p>
				</div>
			</div>
		);
	}

	let currentIdx = steps.indexOf(status);
	if (status === "Menunggu DP") currentIdx = 0;
	if (status === "DP Dibayar") currentIdx = 1;

	return (
		<div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
			<h3 className="font-quick font-bold text-lg text-neutral-900 mb-6">
				Status Pesanan
			</h3>
			<div className="flex flex-col md:flex-row justify-between relative">
				<div className="absolute left-[15px] md:left-0 md:top-[15px] top-0 bottom-0 md:bottom-auto md:w-full md:h-1 w-1 bg-neutral-100 -z-10 rounded-full" />

				{steps.map((step, idx) => {
					const isCompleted = currentIdx >= idx;
					const isActive = currentIdx === idx;

					return (
						<div
							key={step}
							className="flex md:flex-col items-center gap-4 md:gap-3 mb-6 md:mb-0 z-10 relative"
						>
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
									isCompleted
										? "bg-c-blue border-c-blue text-white"
										: "bg-white border-neutral-200 text-neutral-300"
								} ${isActive ? "ring-4 ring-c-blue-50" : ""}`}
							>
								{isCompleted ? (
									<CheckCircle2 className="w-5 h-5" />
								) : (
									<div className="w-2.5 h-2.5 rounded-full bg-current" />
								)}
							</div>
							<div className="md:text-center">
								<p
									className={`font-quick font-semibold text-sm ${isActive ? "text-c-blue" : isCompleted ? "text-neutral-900" : "text-neutral-400"}`}
								>
									{step}
								</p>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

const VendorAndProductSummary = ({
	vendor,
	product,
}: {
	vendor: VendorDetail;
	product: ProductDetail;
}) => {
	return (
		<div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
			<div className="p-4 bg-slate-50 border-b border-neutral-100 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 relative">
						<Image
							src={vendor.avatarUrl}
							alt={vendor.name}
							fill
							className="object-cover"
						/>
					</div>
					<div>
						<h4 className="font-quick font-bold text-neutral-900 text-sm">
							{vendor.name}
						</h4>
						<div className="flex items-center gap-1 text-neutral-500">
							<MapPin className="w-3 h-3" />
							<span className="font-sans text-xs">{vendor.location}</span>
						</div>
					</div>
				</div>
				<button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 text-sm font-quick font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors">
					<MessageCircle className="w-4 h-4" />
					Chat
				</button>
			</div>
			<div className="p-6 flex flex-col sm:flex-row gap-4">
				<div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-100 relative shrink-0">
					<Image
						src={product.imageUrl}
						alt={product.title}
						fill
						className="object-cover"
					/>
				</div>
				<div className="flex-1">
					<h3 className="font-quick font-bold text-lg text-neutral-900 mb-1">
						{product.title}
					</h3>
					<p className="font-sans text-sm text-neutral-500 mb-3">
						Varian:{" "}
						<span className="font-medium text-neutral-700">
							{product.variant}
						</span>
					</p>
					<div className="inline-flex px-2.5 py-1 rounded-md bg-c-blue-50 text-c-blue font-sans text-xs font-semibold">
						Qty: {product.qty} Hari/Unit
					</div>
				</div>
			</div>
		</div>
	);
};

const LogisticsCard = ({ logistics }: { logistics: LogisticsDetail }) => {
	return (
		<div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm">
			<h3 className="font-quick font-bold text-lg text-neutral-900 mb-6">
				Detail Logistik & Acara
			</h3>

			<div className="space-y-4">
				<div className="flex gap-3">
					<div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
						<Calendar className="w-5 h-5" />
					</div>
					<div>
						<p className="text-xs font-sans text-neutral-500 mb-0.5">
							Tanggal Acara
						</p>
						<p className="font-quick font-semibold text-neutral-900">
							{logistics.eventDate}
						</p>
					</div>
				</div>

				<div className="flex gap-3">
					<div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
						<Clock className="w-5 h-5" />
					</div>
					<div>
						<p className="text-xs font-sans text-neutral-500 mb-0.5">
							Waktu Setup/Loading
						</p>
						<p className="font-quick font-semibold text-neutral-900">
							{logistics.setupTime}
						</p>
					</div>
				</div>

				<div className="flex gap-3">
					<div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
						<MapPin className="w-5 h-5" />
					</div>
					<div>
						<p className="text-xs font-sans text-neutral-500 mb-0.5">
							Alamat Venue
						</p>
						<p className="font-sans text-sm text-neutral-700 leading-relaxed">
							{logistics.venueAddress}
						</p>
					</div>
				</div>

				{logistics.specialNotes && (
					<div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
						<p className="text-xs font-sans text-neutral-500 mb-1">
							Catatan Tambahan:
						</p>
						<p className="font-sans text-sm text-neutral-700 italic">
							"{logistics.specialNotes}"
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

const EscrowSummary = ({
	pricing,
	status,
}: {
	pricing: PriceBreakdown;
	status: BookingStatus;
}) => {
	const formatIDR = (num: number) =>
		new Intl.NumberFormat("id-ID", {
			style: "currency",
			currency: "IDR",
			maximumFractionDigits: 0,
		}).format(num);

	return (
		<div className="bg-white rounded-2xl border border-neutral-100 p-6 shadow-sm sticky top-24">
			<h3 className="font-quick font-bold text-lg text-neutral-900 mb-6">
				Ringkasan Pembayaran
			</h3>

			<div className="space-y-3 font-sans text-sm mb-6">
				<div className="flex justify-between text-neutral-600">
					<span>Subtotal Produk</span>
					<span>{formatIDR(pricing.subtotal)}</span>
				</div>
				<div className="flex justify-between text-neutral-600">
					<span>Biaya Layanan</span>
					<span>{formatIDR(pricing.serviceFee)}</span>
				</div>
				{pricing.discount > 0 && (
					<div className="flex justify-between text-emerald-600">
						<span>Diskon Promo</span>
						<span>-{formatIDR(pricing.discount)}</span>
					</div>
				)}
				<div className="pt-3 border-t border-dashed border-neutral-200 flex justify-between items-center">
					<span className="font-quick font-bold text-neutral-900">
						Total Pembayaran
					</span>
					<span className="font-quick font-bold text-xl text-c-blue">
						{formatIDR(pricing.grandTotal)}
					</span>
				</div>
			</div>

			<div className="flex items-center gap-2 justify-center py-3 bg-emerald-50 rounded-lg text-emerald-700 mb-6">
				<ShieldCheck className="w-5 h-5" />
				<span className="font-sans text-xs font-medium">
					Dana diamankan oleh Celeparty Escrow
				</span>
			</div>

			<div className="flex flex-col gap-3">
				{status === "Menunggu Pembayaran" ? (
					<button className="w-full bg-c-blue text-white font-quick font-bold rounded-xl py-3.5 hover:bg-c-blue/90 transition-colors">
						Bayar Sekarang
					</button>
				) : status === "Selesai" ? (
					<button className="w-full bg-c-green text-c-blue font-quick font-bold rounded-xl py-3.5 hover:brightness-95 transition-all">
						Beri Ulasan
					</button>
				) : (
					<button className="w-full bg-neutral-100 text-neutral-400 font-quick font-bold rounded-xl py-3.5 cursor-not-allowed">
						Menunggu Proses
					</button>
				)}

				<button className="w-full flex items-center justify-center gap-2 border border-neutral-200 text-neutral-700 font-quick font-semibold rounded-xl py-3 hover:bg-neutral-50 transition-colors">
					<Download className="w-4 h-4" />
					Download Invoice
				</button>
			</div>
		</div>
	);
};

const SkeletonLoader = () => (
	<div className="max-w-6xl mx-auto px-4 py-8 animate-pulse">
		<div className="h-6 w-32 bg-neutral-200 rounded mb-8"></div>
		<div className="flex items-center justify-between mb-8">
			<div>
				<div className="h-8 w-64 bg-neutral-200 rounded mb-2"></div>
				<div className="h-4 w-40 bg-neutral-200 rounded"></div>
			</div>
			<div className="h-8 w-24 bg-neutral-200 rounded-full"></div>
		</div>
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div className="lg:col-span-2 space-y-6">
				<div className="h-32 bg-neutral-200 rounded-2xl"></div>
				<div className="h-64 bg-neutral-200 rounded-2xl"></div>
			</div>
			<div>
				<div className="h-96 bg-neutral-200 rounded-2xl"></div>
			</div>
		</div>
	</div>
);

import { orders, products } from "@/lib/data";

// --- 3. Main Page Component ---

export default function BookingDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const [booking, setBooking] = useState<BookingDetail | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchBooking = async () => {
			setLoading(true);
			const resolvedParams = await params;

			const order = orders.find((o) => o.id === resolvedParams.id);

			if (!order) {
				setBooking(null);
				setLoading(false);
				return;
			}

			const product = products.find((p) => p.slug === order.productSlug);

			let status: BookingStatus = "Menunggu Pembayaran";
			if (
				order.paymentStatus === "cancelled" ||
				order.vendorStatus === "rejected"
			) {
				status = "Dibatalkan";
			} else if (order.paymentStatus === "expired") {
				status = "Kadaluarsa";
			} else if (order.paymentStatus === "dp_refunded") {
				status = "DP Direfund";
			} else if (
				order.paymentStatus === "fully_paid" &&
				order.vendorStatus === "approved"
			) {
				status = "Selesai";
			} else if (
				order.paymentStatus === "fully_paid" &&
				order.vendorStatus === "pending"
			) {
				status = "Proses Vendor";
			} else if (order.paymentStatus === "dp_paid") {
				status = "DP Dibayar";
			} else if (order.paymentStatus === "dp_pending") {
				status = "Menunggu DP";
			} else if (
				order.paymentStatus === "settlement" &&
				order.vendorStatus === "approved"
			) {
				status = "Selesai";
			} else if (
				order.paymentStatus === "settlement" &&
				order.vendorStatus === "pending"
			) {
				status = "Dibayar";
			} else if (order.paymentStatus === "pending") {
				status = "Menunggu Pembayaran";
			}

			const vendorAvatar =
				"https://images.unsplash.com/photo-1516280440502-8610eb675005?w=128&h=128&fit=crop"; // Mock avatar
			const productImg =
				product?.imageUrl ||
				"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop";

			setBooking({
				id: order.id,
				invoiceId: order.orderId,
				orderDate: new Date(order.orderDate).toLocaleDateString("id-ID", {
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
				status: status,
				vendor: {
					id: order.vendorId || "v-000",
					name: order.vendorName || "Vendor",
					location: product?.city || "Kota",
					avatarUrl: vendorAvatar,
				},
				product: {
					id: product?.slug || "p-000",
					title: order.product,
					variant: order.variant,
					imageUrl: productImg,
					qty: order.qty,
				},
				logistics: {
					eventDate: new Date(order.eventDate).toLocaleDateString("id-ID", {
						year: "numeric",
						month: "long",
						day: "numeric",
					}),
					setupTime: "08:00 WIB (Sesuai kesepakatan)",
					venueAddress: "Alamat venue yang didaftarkan pelanggan",
					specialNotes: "-",
				},
				pricing: {
					subtotal: order.total,
					serviceFee: order.total * 0.05, // 5% mock fee
					discount: 0,
					grandTotal: order.total + order.total * 0.05,
				},
			});

			setLoading(false);
		};

		fetchBooking();
	}, [params]);

	if (loading) return <SkeletonLoader />;
	if (!booking)
		return (
			<div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col">
				<div className="text-center py-20 font-quick text-lg text-neutral-600">
					Booking tidak ditemukan.
				</div>
				<Link
					href="/bookings"
					className="inline-flex items-center gap-2 text-c-blue font-semibold mt-4 bg-c-blue-50 px-6 py-2 rounded-full"
				>
					Kembali ke Daftar Booking
				</Link>
			</div>
		);

	const statusColors: Record<BookingStatus, string> = {
		"Menunggu Pembayaran": "bg-amber-100 text-amber-700",
		"Menunggu DP": "bg-amber-100 text-amber-700",
		"DP Dibayar": "bg-c-blue-100 text-c-blue-700",
		Dibayar: "bg-blue-100 text-blue-700",
		"Proses Vendor": "bg-purple-100 text-purple-700",
		Selesai: "bg-emerald-100 text-emerald-700",
		Dibatalkan: "bg-red-100 text-red-700",
		Kadaluarsa: "bg-neutral-100 text-neutral-500",
		"DP Direfund": "bg-orange-100 text-orange-700",
	};

	return (
		<div className="min-h-screen bg-slate-50 pb-20">
			<div className="max-w-6xl mx-auto px-4 pt-8">
				{/* Breadcrumb / Back Navigation */}
				<Link
					href="/bookings"
					className="inline-flex items-center gap-2 text-neutral-500 hover:text-c-blue transition-colors font-sans text-sm mb-6"
				>
					<ChevronLeft className="w-4 h-4" />
					Kembali ke Daftar Booking
				</Link>

				{/* Page Header */}
				<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
					<div>
						<h1 className="font-quick font-bold text-3xl text-neutral-900 mb-1">
							Invoice {booking.invoiceId}
						</h1>
						<p className="font-sans text-sm text-neutral-500">
							Dipesan pada {booking.orderDate}
						</p>
					</div>
					<div>
						<span
							className={`px-4 py-1.5 rounded-full font-quick font-bold text-sm ${statusColors[booking.status]}`}
						>
							{booking.status}
						</span>
					</div>
				</div>

				{/* Main Grid Layout */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
					{/* Left Column (Main Details) */}
					<div className="lg:col-span-2 space-y-6">
						<StatusTracker status={booking.status} />
						<VendorAndProductSummary
							vendor={booking.vendor}
							product={booking.product}
						/>
						<LogisticsCard logistics={booking.logistics} />
					</div>

					{/* Right Column (Sidebar Pricing & CTA) */}
					<div className="relative">
						<EscrowSummary pricing={booking.pricing} status={booking.status} />
					</div>
				</div>
			</div>
		</div>
	);
}
