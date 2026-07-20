import {
	ArrowRight,
	Calendar,
	CheckCircle2,
	ShoppingBag,
	Ticket,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

interface SuccessPageProps {
	searchParams: Promise<{ order?: string; order_id?: string }>;
}

export default async function CheckoutSuccessPage({
	searchParams,
}: SuccessPageProps) {
	const resolvedSearchParams = await searchParams;
	const orderId = resolvedSearchParams.order || resolvedSearchParams.order_id || "";

	if (!orderId) {
		return (
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
				<h1 className="font-quick font-bold text-2xl text-neutral-900">
					Pesanan tidak ditemukan
				</h1>
				<p className="font-sans text-sm text-neutral-500 mt-2 mb-4">
					Tautan tidak valid atau pesanan sudah kadaluarsa.
				</p>
				<Link
					href="/products"
					className="inline-block text-c-blue font-quick font-semibold text-sm hover:underline"
				>
					&larr; Kembali ke Katalog
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center mb-8">
					<div className="w-16 h-16 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-4">
						<CheckCircle2 className="w-8 h-8 text-status-success" />
					</div>
					<h1 className="font-quick font-bold text-2xl text-neutral-900 mb-2">
						Pesanan Berhasil!
					</h1>
					<p className="font-sans text-sm text-neutral-500 max-w-md mx-auto">
						Pesanan Anda telah dibuat. E-ticket akan dikirim ke email penerima
						setelah pembayaran dikonfirmasi vendor.
					</p>
				</div>

				<Card>
					<CardHeader className="pb-4">
						<div className="flex items-center justify-between">
							<CardTitle>Detail Pesanan</CardTitle>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="bg-neutral-50 rounded-xl p-4 space-y-3">
							<div>
								<p className="text-xs font-sans text-neutral-500 mb-0.5">
									No. Order
								</p>
								<p className="font-mono font-semibold text-sm text-neutral-900">
									{orderId}
								</p>
							</div>
						</div>

						<div className="bg-c-blue-50 border border-c-blue-100 rounded-xl p-4">
							<p className="text-xs font-sans text-c-blue">
								E-ticket akan dikirim setelah vendor mengkonfirmasi pesanan
								Anda.
							</p>
						</div>
					</CardContent>
				</Card>

				<div className="flex flex-col sm:flex-row gap-3 mt-6">
					<Button
						variant="outline"
						size="lg"
						className="flex-1 min-h-[44px]"
						asChild
					>
						<Link href="/products">
							<ShoppingBag className="w-4 h-4 mr-2" />
							Lanjut Belanja
						</Link>
					</Button>
					<Button
						variant="cta"
						size="lg"
						className="flex-1 min-h-[44px]"
						asChild
					>
						<Link href="/">
							Kembali ke Beranda
							<ArrowRight className="w-4 h-4 ml-2" />
						</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
