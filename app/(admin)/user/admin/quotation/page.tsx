"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calculator, CheckCircle2, Copy, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const quotationSchema = z.object({
	customerName: z.string().min(2, "Nama pelanggan harus diisi"),
	email: z.string().email("Format email tidak valid"),
	wa: z.string().min(10, "Nomor WhatsApp minimal 10 digit"),
	productName: z.string().min(2, "Nama produk harus diisi"),
	price: z.coerce.number().min(10000, "Harga minimal Rp 10.000"),
});

type QuotationFormInput = z.input<typeof quotationSchema>;
type QuotationFormOutput = z.output<typeof quotationSchema>;

export default function AdminQuotationPage() {
	const [generatedLink, setGeneratedLink] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<QuotationFormInput, any, QuotationFormOutput>({
		resolver: zodResolver(quotationSchema),
		mode: "onBlur",
	});

	const onSubmit = async (_data: QuotationFormOutput) => {
		setIsSubmitting(true);
		// Simulate API call
		setTimeout(() => {
			const date = new Date();
			const yyyymmdd = date.toISOString().split("T")[0].replace(/-/g, "");
			const xxxx = Math.floor(1000 + Math.random() * 9000).toString();
			const code = `QT-${yyyymmdd}-${xxxx}`;

			const link = `${window.location.origin}/pay/${code}`;
			setGeneratedLink(link);
			setIsSubmitting(false);
		}, 1000);
	};

	const copyToClipboard = () => {
		if (generatedLink) {
			navigator.clipboard.writeText(generatedLink);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};

	const resetForm = () => {
		reset();
		setGeneratedLink(null);
	};

	return (
		<>
			<ErpHeader
				breadcrumbs={[
					{ label: "Dashboard", href: "/user/admin/dashboard" },
					{ label: "Custom Quotation" },
				]}
			/>
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="font-quick font-bold text-2xl text-neutral-900 flex items-center gap-2">
						<Calculator className="w-6 h-6 text-c-blue" /> Custom Quotation
					</h1>
					<p className="font-sans text-sm text-neutral-500 mt-1">
						Buat penawaran khusus dan hasilkan tautan pembayaran untuk
						pelanggan.
					</p>
				</div>

				{!generatedLink ? (
					<Card>
						<CardHeader>
							<CardTitle className="font-quick text-lg text-c-blue">
								Form Penawaran Baru
							</CardTitle>
							<CardDescription className="font-sans">
								Lengkapi data di bawah ini untuk menghasilkan tautan pembayaran.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<Label className="font-sans text-neutral-700">
											Nama Pelanggan
										</Label>
										<Input
											{...register("customerName")}
											placeholder="Contoh: Budi Santoso"
											className="font-sans text-base h-11"
										/>
										{errors.customerName && (
											<p className="text-xs text-c-red font-sans">
												{errors.customerName.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label className="font-sans text-neutral-700">
											Email Pelanggan
										</Label>
										<Input
											type="email"
											{...register("email")}
											placeholder="Contoh: budi@email.com"
											className="font-sans text-base h-11"
										/>
										{errors.email && (
											<p className="text-xs text-c-red font-sans">
												{errors.email.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label className="font-sans text-neutral-700">
											Nomor WhatsApp
										</Label>
										<Input
											type="tel"
											{...register("wa")}
											placeholder="Contoh: 081234567890"
											className="font-sans text-base h-11"
										/>
										{errors.wa && (
											<p className="text-xs text-c-red font-sans">
												{errors.wa.message}
											</p>
										)}
									</div>

									<div className="space-y-2">
										<Label className="font-sans text-neutral-700">
											Nama Produk Spesifik
										</Label>
										<Input
											{...register("productName")}
											placeholder="Contoh: Sewa Lighting Panggung Full Set"
											className="font-sans text-base h-11"
										/>
										{errors.productName && (
											<p className="text-xs text-c-red font-sans">
												{errors.productName.message}
											</p>
										)}
									</div>

									<div className="space-y-2 md:col-span-2">
										<Label className="font-sans text-neutral-700">
											Harga Kesepakatan (Rp)
										</Label>
										<Input
											type="number"
											{...register("price")}
											placeholder="Contoh: 1500000"
											className="font-sans text-base h-11"
										/>
										{errors.price && (
											<p className="text-xs text-c-red font-sans">
												{errors.price.message}
											</p>
										)}
									</div>
								</div>

								<Button
									type="submit"
									disabled={isSubmitting}
									className="w-full bg-c-green text-neutral-900 hover:brightness-95 font-quick font-semibold h-11 text-base"
								>
									{isSubmitting ? "Memproses..." : "Generate Link"}
								</Button>
							</form>
						</CardContent>
					</Card>
				) : (
					<Card className="border-emerald-100 bg-emerald-50/30">
						<CardHeader className="text-center pb-2">
							<div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
								<CheckCircle2 className="w-8 h-8" />
							</div>
							<CardTitle className="font-quick text-xl text-emerald-700">
								Tautan Berhasil Dibuat!
							</CardTitle>
							<CardDescription className="font-sans text-neutral-600">
								Silakan salin tautan di bawah ini dan kirimkan ke pelanggan.
							</CardDescription>
						</CardHeader>
						<CardContent className="pt-4">
							<div className="flex flex-col sm:flex-row gap-3">
								<Input
									value={generatedLink}
									readOnly
									className="font-mono text-sm bg-white h-12 text-neutral-600"
								/>
								<Button
									onClick={copyToClipboard}
									className="bg-c-blue text-white font-quick font-semibold h-12 shrink-0 gap-2"
								>
									<Copy className="w-4 h-4" />
									{copied ? "Tersalin!" : "Salin Tautan"}
								</Button>
							</div>

							<div className="mt-8 pt-6 border-t border-emerald-100 flex justify-center gap-4">
								<Button
									variant="outline"
									onClick={resetForm}
									className="font-quick font-semibold text-neutral-700 h-11"
								>
									Buat Penawaran Baru
								</Button>
								<a
									href={generatedLink}
									target="_blank"
									rel="noreferrer"
									className="inline-flex items-center gap-2 bg-white border border-neutral-200 text-neutral-700 font-quick font-semibold text-sm px-6 rounded-md hover:bg-neutral-50 h-11 transition-colors"
								>
									<ExternalLink className="w-4 h-4" /> Buka Link
								</a>
							</div>
						</CardContent>
					</Card>
				)}
			</div>
		</>
	);
}
