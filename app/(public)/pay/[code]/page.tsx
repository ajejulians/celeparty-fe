import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface PayPageProps {
	params: Promise<{ code: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
	const resolvedParams = await params;

	return (
		<div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
			<div className="max-w-md w-full text-center">
				<div className="w-16 h-16 rounded-full bg-c-blue-50 flex items-center justify-center mx-auto mb-4">
					<span className="text-3xl">💳</span>
				</div>
				<h1 className="font-quick font-bold text-2xl text-neutral-900 mb-2">
					Halaman Pembayaran
				</h1>
				<p className="font-sans text-sm text-neutral-500 mb-6">
					Silakan lakukan pembayaran melalui checkout untuk menyelesaikan
					pesanan Anda.
				</p>
				<Link href="/products">
					<Button variant="outline" size="lg" className="min-h-[44px]">
						Jelajahi Produk
					</Button>
				</Link>
			</div>
		</div>
	);
}
