import { orders as dummyOrders } from "@/lib/data";
import type { StrapiPaginatedResponse, StrapiTransactionTicket } from "@/types/strapi";

interface CreateTransactionPayload {
	product_id: string;
	product_name: string;
	variant_id: string;
	variant: string;
	price: string;
	quantity: string;
	customer_name: string;
	telp: string;
	total_price: string;
	event_date: string;
	event_type: string;
	note?: string;
}

interface GuestCheckoutPayload extends CreateTransactionPayload {
	customer_mail: string;
	order_id: string;
	vendor_doc_id: string;
	recipients?: unknown[];
}

function createMockTicket(data: Partial<CreateTransactionPayload>): StrapiTransactionTicket {
	const orderId = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(
		100 + Math.random() * 900,
	)}`;

	return {
		id: Math.floor(Math.random() * 10000) + 1,
		documentId: `tx-${Date.now()}`,
		product_id: data.product_id || "sound-system-profesional",
		product_name: data.product_name || "Sound System Profesional 5000W",
		variant_id: data.variant_id || "0",
		variant: data.variant || "Reguler",
		price: data.price || "2500000",
		quantity: data.quantity || "1",
		customer_name: data.customer_name || "Budi Santoso",
		telp: data.telp || "081234567890",
		total_price: data.total_price || "2500000",
		payment_status: "fully_paid",
		event_date: data.event_date || "2026-08-12",
		event_type: data.event_type || "Audio & Sound",
		note: data.note || "",
		order_id: orderId,
		customer_mail: "budi@email.com",
		verification: true,
		vendor_doc_id: "v-001",
		recipients: [],
		products: [],
		guest_email: "budi@email.com",
		product_description: "Paket sound system profesional",
	};
}

export async function createTransaction(
	data: CreateTransactionPayload,
): Promise<{ data: StrapiTransactionTicket }> {
	return { data: createMockTicket(data) };
}

export async function guestCheckout(
	data: GuestCheckoutPayload,
): Promise<{ data: StrapiTransactionTicket }> {
	return { data: createMockTicket(data) };
}

export async function getTransactions(
	_filters?: Record<string, string>,
): Promise<StrapiPaginatedResponse<StrapiTransactionTicket>> {
	const list: StrapiTransactionTicket[] = dummyOrders.map((o, idx) => ({
		id: idx + 1,
		documentId: o.id,
		product_id: o.productSlug,
		product_name: o.product,
		variant_id: "0",
		variant: o.variant,
		price: String(o.total),
		quantity: String(o.qty),
		customer_name: o.customer,
		telp: "081234567890",
		total_price: String(o.total),
		payment_status: o.paymentStatus,
		event_date: o.eventDate,
		event_type: "Event",
		note: "",
		order_id: o.orderId,
		customer_mail: "customer@email.com",
		verification: true,
		vendor_doc_id: o.vendorId || "v-001",
		recipients: [],
		products: [],
		guest_email: "customer@email.com",
		product_description: o.product,
	}));

	return {
		data: list,
		meta: {
			pagination: {
				page: 1,
				pageSize: 100,
				pageCount: 1,
				total: list.length,
			},
		},
	};
}

export async function getTransactionByOrderId(
	orderId: string,
): Promise<StrapiTransactionTicket | null> {
	const list = (await getTransactions()).data;
	return list.find((t) => t.order_id === orderId) || list[0] || null;
}

export async function getTransactionById(
	documentId: string,
): Promise<{ data: StrapiTransactionTicket }> {
	const list = (await getTransactions()).data;
	const found = list.find((t) => t.documentId === documentId) || list[0];
	return { data: found };
}

export async function generateInvoice(_documentId: string): Promise<Blob> {
	return new Blob(["INVOICE CELEPARTY DUMMY"], { type: "application/pdf" });
}

