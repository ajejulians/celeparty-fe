"use client";

import { ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentSimulator } from "@/components/checkout/PaymentSimulator";
import { ProgressSteps } from "@/components/checkout/ProgressSteps";
import { RecipientForm } from "@/components/ticket/RecipientForm";
import { Button } from "@/components/ui/button";
import { createTransaction } from "@/lib/api/transactions";
import { generateOrderId } from "@/lib/checkout-data";
import type { Product } from "@/lib/data";
import { type RecipientFormData, recipientSchema } from "@/lib/validators";

interface CheckoutFormWrapperProps {
	product: Product;
	productSlug: string;
	variantIndex: number;
	qty: number;
	totalPrice: number;
	variant: { name: string; price: number };
}

export function CheckoutFormWrapper({
	product,
	productSlug,
	variantIndex,
	qty,
	totalPrice,
	variant,
}: CheckoutFormWrapperProps) {
	const router = useRouter();

	const [recipients, setRecipients] = useState<Partial<RecipientFormData>[]>(
		() =>
			Array.from({ length: qty }, () => ({
				name: "",
				email: "",
				whatsapp: "",
				identityType: undefined,
				identityNumber: "",
			})),
	);
	const [errors, setErrors] = useState<
		Partial<Record<keyof RecipientFormData, string>>[]
	>(() => Array.from({ length: qty }, () => ({})));
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPayment, setShowPayment] = useState(false);
	const [currentStep, setCurrentStep] = useState(0);

	const updateRecipient = useCallback(
		(index: number, data: Partial<RecipientFormData>) => {
			setRecipients((prev) => {
				const next = [...prev];
				next[index] = data;
				return next;
			});
			setErrors((prev) => {
				const next = [...prev];
				next[index] = {};
				return next;
			});
		},
		[],
	);

	const validateAll = (): boolean => {
		const newErrors: Partial<Record<keyof RecipientFormData, string>>[] = [];
		let isValid = true;

		recipients.forEach((r) => {
			const result = recipientSchema.safeParse(r);
			if (!result.success) {
				isValid = false;
				const fieldErrors: Partial<
					Record<keyof RecipientFormData, string>
				> = {};
				result.error.issues.forEach((issue) => {
					const field = issue.path[0] as keyof RecipientFormData;
					fieldErrors[field] = issue.message;
				});
				newErrors.push(fieldErrors);
			} else {
				newErrors.push({});
			}
		});

		setErrors(newErrors);
		return isValid;
	};

	const handlePaymentSuccess = async () => {
		const validRecipients = recipients as RecipientFormData[];
		setIsSubmitting(true);

		try {
			const orderId = generateOrderId(product.date);
			const res = await createTransaction({
				product_id: productSlug,
				product_name: product.name,
				variant_id: String(variantIndex),
				variant: variant.name,
				price: String(variant.price),
				quantity: String(qty),
				customer_name: validRecipients[0]?.name ?? "",
				telp: validRecipients[0]?.whatsapp ?? "",
				total_price: String(totalPrice),
				event_date: product.date,
				event_type: product.category,
				note: "",
			});

			setIsSubmitting(false);
			setShowPayment(false);
			setCurrentStep(2);
			toast.success("Pesanan berhasil dibuat!");
			router.push(
				`/checkout/success?order_id=${res.data.order_id || orderId}`,
			);
		} catch {
			toast.error("Gagal membuat pesanan. Silakan coba lagi.");
			setIsSubmitting(false);
			setShowPayment(false);
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (isSubmitting) return;

		if (!validateAll()) {
			toast.error("Mohon lengkapi data semua penerima dengan benar.");
			return;
		}

		setIsSubmitting(true);
		setShowPayment(true);
		setCurrentStep(1);
		setIsSubmitting(false);
	};

	const handlePaymentClose = () => {
		setShowPayment(false);
	};

	return (
		<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
			<Link
				href={`/products/${productSlug}`}
				className="inline-flex items-center gap-1 text-sm font-sans text-neutral-500 hover:text-c-blue transition-colors mb-6"
			>
				<ArrowLeft className="w-4 h-4" />
				Kembali ke Detail Produk
			</Link>

			<div className="mb-8">
				<ProgressSteps
					steps={["Isi Data", "Ringkasan", "Bayar"]}
					currentStep={currentStep}
				/>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
					<div>
						<h1 className="font-quick font-bold text-2xl text-neutral-900 mb-1">
							Isi Data Penerima
						</h1>
						<p className="font-sans text-sm text-neutral-500">
							{product.name} &mdash; {variant.name} &times; {qty}
						</p>
					</div>

					{recipients.map((recipient, i) => (
						<RecipientForm
							key={i}
							index={i}
							value={recipient}
							errors={errors[i] ?? {}}
							onChange={(data) => updateRecipient(i, data)}
						/>
					))}

					<div className="flex items-center gap-2 text-sm font-sans text-neutral-500">
						<ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
						Data Anda aman dan hanya digunakan untuk keperluan verifikasi
						tiket.
					</div>

					<div className="flex gap-3 lg:hidden">
						<Button
							type="button"
							variant="outline"
							size="lg"
							className="flex-1 min-h-[44px]"
							onClick={() => router.push(`/products/${productSlug}`)}
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
							Lanjut ke Pembayaran
						</Button>
					</div>

					<div className="hidden lg:block">
						<Button
							type="submit"
							variant="cta"
							size="lg"
							className="w-full min-h-[44px]"
							disabled={isSubmitting}
						>
							Lanjut ke Pembayaran
						</Button>
					</div>
				</form>

				<aside className="lg:col-span-1">
					<OrderSummary
						product={product}
						variantIndex={variantIndex}
						qty={qty}
					/>
				</aside>
			</div>

			<PaymentSimulator
				open={showPayment}
				amount={totalPrice}
				productName={`${product.name} - ${variant.name}`}
				onSuccess={handlePaymentSuccess}
				onClose={handlePaymentClose}
			/>
		</div>
	);
}
