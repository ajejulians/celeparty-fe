"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowDownLeft, ArrowUpRight, Download, Wallet, X } from "lucide-react";
import { useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";

const transactions = [
	{
		id: "trx-001",
		type: "credit",
		description: "Pembayaran INV-20260812-001",
		amount: 2500000,
		date: "2026-07-10",
	},
	{
		id: "trx-002",
		type: "debit",
		description: "Penarikan ke Bank BCA",
		amount: 1000000,
		date: "2026-07-08",
	},
	{
		id: "trx-003",
		type: "credit",
		description: "Pembayaran INV-20260905-002",
		amount: 6000000,
		date: "2026-07-05",
	},
];

export default function VendorWalletPage() {
	const [saldoActive, _setSaldoActive] = useState(21500000);
	const [saldoRefund, _setSaldoRefund] = useState(1500000);
	const [withdrawAmount, setWithdrawAmount] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleWithdraw = (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		setTimeout(() => {
			alert("Permintaan penarikan berhasil diajukan!");
			setIsSubmitting(false);
			setIsDialogOpen(false);
			setWithdrawAmount("");
		}, 1000);
	};

	return (
		<>
			<ErpHeader
				breadcrumbs={[
					{ label: "Dashboard", href: "/user/vendor/dashboard" },
					{ label: "Wallet & Saldo" },
				]}
			/>
			<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="font-quick font-bold text-2xl text-neutral-900">
						Wallet & Saldo
					</h1>
					<p className="font-sans text-sm text-neutral-500 mt-1">
						Kelola saldo dan riwayat transaksi Anda
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{/* Active Balance */}
					<div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between">
						<div className="flex items-start justify-between mb-6">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-c-blue-50 rounded-xl flex items-center justify-center">
									<Wallet className="w-6 h-6 text-c-blue" />
								</div>
								<div>
									<p className="font-sans text-sm text-neutral-500">
										Saldo Aktif (Tersedia)
									</p>
									<p className="font-quick font-bold text-3xl text-neutral-900">
										{formatCurrency(saldoActive)}
									</p>
								</div>
							</div>
						</div>

						<Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<Dialog.Trigger asChild>
								<button className="inline-flex items-center justify-center gap-2 bg-c-green text-neutral-900 font-quick font-semibold text-sm px-6 py-3 rounded-lg min-h-[44px] hover:brightness-95 active:scale-[0.98] transition-all w-full md:w-auto">
									<ArrowUpRight className="w-4 h-4" /> Tarik Saldo
								</button>
							</Dialog.Trigger>
							<Dialog.Portal>
								<Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 animate-fade-in" />
								<Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 p-6 animate-slide-up focus:outline-none">
									<div className="flex items-center justify-between mb-6">
										<Dialog.Title className="font-quick font-bold text-xl text-neutral-900">
											Tarik Saldo
										</Dialog.Title>
										<Dialog.Close asChild>
											<button className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 transition-colors">
												<X className="w-5 h-5" />
											</button>
										</Dialog.Close>
									</div>

									<form onSubmit={handleWithdraw} className="space-y-6">
										<div className="space-y-2">
											<Label className="font-sans text-neutral-700">
												Jumlah Penarikan (Rp)
											</Label>
											<Input
												type="number"
												value={withdrawAmount}
												onChange={(e) => setWithdrawAmount(e.target.value)}
												placeholder="Minimal Rp 50.000"
												className="font-sans text-base h-11"
												required
												min={50000}
												max={saldoActive}
											/>
											<p className="text-xs font-sans text-neutral-500">
												Maksimal penarikan: {formatCurrency(saldoActive)}
											</p>
										</div>

										<div className="space-y-2">
											<Label className="font-sans text-neutral-700">
												Bank Tujuan
											</Label>
											<select className="w-full px-3 py-2.5 h-11 border border-neutral-200 rounded-lg bg-white font-sans text-base focus:outline-none focus:border-c-blue">
												<option>BCA - 1234567890 a/n Vendor</option>
												<option>Mandiri - 0987654321 a/n Vendor</option>
											</select>
										</div>

										<Button
											type="submit"
											disabled={isSubmitting || !withdrawAmount}
											className="w-full h-11 font-quick font-semibold bg-c-blue text-white hover:brightness-95 text-base"
										>
											{isSubmitting ? "Memproses..." : "Ajukan Penarikan"}
										</Button>
									</form>
								</Dialog.Content>
							</Dialog.Portal>
						</Dialog.Root>
					</div>

					{/* Refund/Escrow Balance */}
					<div className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between">
						<div className="flex items-center gap-4 mb-6">
							<div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
								<Wallet className="w-6 h-6 text-amber-600" />
							</div>
							<div>
								<p className="font-sans text-sm text-neutral-500">
									Saldo Tertahan (Escrow/Refund)
								</p>
								<p className="font-quick font-bold text-3xl text-neutral-900">
									{formatCurrency(saldoRefund)}
								</p>
							</div>
						</div>
						<p className="font-sans text-sm text-neutral-500 leading-relaxed">
							Dana ini sedang ditahan dalam sistem Escrow menunggu konfirmasi
							pesanan selesai atau dalam proses pengembalian ke pelanggan.
						</p>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4 mb-8">
					<StatCard
						label="Total Masuk"
						value={formatCurrency(
							transactions
								.filter((t) => t.type === "credit")
								.reduce((s, t) => s + t.amount, 0),
						)}
						icon={<ArrowDownLeft className="w-5 h-5" />}
						variant="green"
					/>
					<StatCard
						label="Total Keluar"
						value={formatCurrency(
							transactions
								.filter((t) => t.type === "debit")
								.reduce((s, t) => s + t.amount, 0),
						)}
						icon={<ArrowUpRight className="w-5 h-5" />}
						variant="red"
					/>
				</div>

				<div className="bg-white rounded-lg border border-neutral-200">
					<div className="p-4 border-b border-neutral-100 flex items-center justify-between">
						<h2 className="font-quick font-bold text-lg text-neutral-900">
							Riwayat Transaksi
						</h2>
						<button className="flex items-center gap-1.5 text-xs font-sans font-medium text-neutral-600 hover:text-neutral-900 border rounded-lg px-3 py-1.5">
							<Download className="w-3.5 h-3.5" />
							Export CSV
						</button>
					</div>
					<div className="overflow-x-auto min-w-[640px]">
						<table className="w-full">
							<thead>
								<tr className="bg-neutral-50 border-b border-neutral-200">
									<th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
										Deskripsi
									</th>
									<th className="text-left text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
										Tanggal
									</th>
									<th className="text-center text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
										Tipe
									</th>
									<th className="text-right text-xs font-sans font-semibold text-neutral-500 uppercase tracking-wide px-4 py-3">
										Jumlah
									</th>
								</tr>
							</thead>
							<tbody>
								{transactions.map((t, i) => (
									<tr
										key={t.id}
										className={`border-b border-neutral-100 last:border-0 hover:bg-neutral-50 transition-colors ${i % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}
									>
										<td className="px-4 py-3 font-sans text-sm text-neutral-900">
											{t.description}
										</td>
										<td className="px-4 py-3 font-sans text-xs text-neutral-500">
											{new Date(t.date).toLocaleDateString("id-ID", {
												day: "numeric",
												month: "long",
												year: "numeric",
											})}
										</td>
										<td className="px-4 py-3 text-center">
											<span
												className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-sans font-semibold ${t.type === "credit" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
											>
												{t.type === "credit" ? (
													<ArrowDownLeft className="w-3 h-3" />
												) : (
													<ArrowUpRight className="w-3 h-3" />
												)}
												{t.type === "credit" ? "Masuk" : "Keluar"}
											</span>
										</td>
										<td
											className={`px-4 py-3 font-quick font-semibold text-sm text-right ${t.type === "credit" ? "text-status-success" : "text-c-red"}`}
										>
											{t.type === "credit" ? "+" : "-"}
											{formatCurrency(t.amount)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	);
}
