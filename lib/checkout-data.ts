import { getProductByDocumentId } from "@/lib/api/products";
import { adaptStrapiProductToProduct } from "@/lib/adapters/product";
import type { Product } from "@/lib/data";

export interface Recipient {
	name: string;
	email: string;
	whatsapp: string;
	identityType: "KTP" | "SIM" | "Paspor";
	identityNumber: string;
}

export interface CheckoutParams {
	productSlug: string;
	variantIndex: number;
	qty: number;
}

export interface PaymentLink {
	code: string;
	productSlug: string;
	variantIndex: number;
	amount: number;
	type: "dp" | "remaining" | "full";
	validUntil: string;
	orderId: string;
}

import { products } from "@/lib/data";

export async function getProductBySlug(slug: string): Promise<Product | null> {
	try {
		const res = await getProductByDocumentId(slug);
		const adapted = adaptStrapiProductToProduct(res.data);
		if (adapted) return adapted;
	} catch {
		// fallback
	}
	const found = products.find((p) => p.slug === slug);
	return found || products[0] || null;
}

export function generateOrderId(dateStr: string, counter = 1): string {
	const date = new Date(dateStr);
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	const n = String(counter).padStart(3, "0");
	return `INV-${y}${m}${d}-${n}`;
}

export function createPaymentLink(
	orderId: string,
	productSlug: string,
	variantIndex: number,
	price: number,
	qty: number = 1,
	isEscrow: boolean = false,
): PaymentLink | null {
	const totalAmount = price * qty;
	const code = `PAY-${Date.now().toString(36).toUpperCase()}`;

	if (isEscrow) {
		const dp = Math.ceil(totalAmount * 0.3);
		return {
			code: `${code}-DP`,
			productSlug,
			variantIndex,
			amount: dp,
			type: "dp",
			validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
			orderId,
		};
	}

	return {
		code,
		productSlug,
		variantIndex,
		amount: totalAmount,
		type: "full" as const,
		validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
		orderId,
	};
}
