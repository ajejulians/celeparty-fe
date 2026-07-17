"use client";

import { CheckCircle2, ChevronLeft, Clock, Ticket } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { orders } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function BookingsPage() {
	const [filter, setFilter] = useState("Semua");
	const filters = ["Semua", "Menunggu Pembayaran", "Dibayar", "Selesai"];

	// Mocking the user's orders, in a real app this would be filtered by user ID
	const userOrders = orders.filter((o) => o.customer === "Budi Santoso"); // using Budi Santoso as mock logged in user

	const filteredOrders = userOrders.filter((order) => {
		if (filter === "Semua") return true;
		if (filter === "Menunggu Pembayaran")
			return (
				order.paymentStatus === "pending" ||
				order.paymentStatus === "dp_pending"
			);
		if (filter === "Dibayar")
			return (
				(order.paymentStatus === "settlement" ||
					order.paymentStatus === "dp_paid" ||
					order.paymentStatus === "fully_paid") &&
				order.vendorStatus === "pending"
			);
		if (filter === "Selesai")
			return (
				(order.paymentStatus === "settlement" ||
					order.paymentStatus === "fully_paid") &&
				order.vendorStatus === "approved"
			);
		return true;
	});

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
			<Link
				href="/"
				className="inline-flex items-center gap-2 text-neutral-500 hover:text-c-blue transition-colors font-sans text-sm mb-6"
			>
				<ChevronLeft className="w-4 h-4" />
				Kembali ke Beranda
			</Link>

			<h1 className="font-quick font-bold text-3xl text-neutral-900 mb-6">
				Booking Saya
			</h1>

			{/* Filters */}
			<div className="flex flex-wrap gap-2 mb-8">
				{filters.map((f) => (
					<button
						key={f}
						onClick={() => setFilter(f)}
						className={`px-4 py-2 rounded-full text-sm font-sans font-medium transition-all ${
							filter === f
								? "bg-c-blue text-white shadow-md"
								: "bg-white text-neutral-600 border border-neutral-200 hover:border-c-blue hover:text-c-blue"
						}`}
					>
						{f}
					</button>
				))}
			</div>

			{/* Orders List */}
			<div className="space-y-4">
				{filteredOrders.length === 0 ? (
					<div className="text-center py-20 bg-white rounded-2xl border border-neutral-200">
						<Ticket className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
						<p className="text-neutral-500 font-sans">
							Tidak ada transaksi ditemukan.
						</p>
					</div>
				) : (
					filteredOrders.map((order) => (
						<Link
							href={`/bookings/${order.id}`}
							key={order.id}
							className="block group"
						>
							<div className="bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center group-hover:shadow-card-hover group-hover:border-c-blue/30 transition-all">
								<div>
									<div className="flex items-center gap-3 mb-2">
										<span className="text-xs font-sans text-neutral-500 font-medium bg-neutral-100 px-2.5 py-1 rounded-full group-hover:bg-c-blue-50 group-hover:text-c-blue transition-colors">
											{order.orderId}
										</span>
										<span className="text-xs font-sans text-neutral-500">
											{new Date(order.orderDate).toLocaleDateString("id-ID")}
										</span>
									</div>
									<h3 className="font-quick font-bold text-lg text-neutral-900 mb-1 group-hover:text-c-blue transition-colors">
										{order.product}
									</h3>
									<p className="font-sans text-sm text-neutral-500 mb-2">
										Variant: {order.variant} • Qty: {order.qty}
									</p>
									<div className="flex items-center gap-2">
										{order.paymentStatus === "pending" ||
										order.paymentStatus === "dp_pending" ? (
											<span className="flex items-center gap-1.5 text-xs font-sans text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
												<Clock className="w-3.5 h-3.5" /> Menunggu Pembayaran
											</span>
										) : (order.paymentStatus === "settlement" ||
												order.paymentStatus === "dp_paid" ||
												order.paymentStatus === "fully_paid") &&
											order.vendorStatus === "pending" ? (
											<span className="flex items-center gap-1.5 text-xs font-sans text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
												<CheckCircle2 className="w-3.5 h-3.5" /> Dibayar
											</span>
										) : (
											<span className="flex items-center gap-1.5 text-xs font-sans text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
												<CheckCircle2 className="w-3.5 h-3.5" /> Selesai
											</span>
										)}
									</div>
								</div>

								<div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-neutral-100 flex flex-col md:items-end justify-center">
									<p className="text-sm font-sans text-neutral-500 mb-1">
										Total Belanja
									</p>
									<p className="font-quick font-bold text-xl text-c-blue">
										{formatCurrency(order.total)}
									</p>
									<span className="mt-2 text-xs font-quick font-bold text-c-blue opacity-0 group-hover:opacity-100 transition-opacity">
										Lihat Detail &rarr;
									</span>
								</div>
							</div>
						</Link>
					))
				)}
			</div>
		</div>
	);
}
