export interface StrapiUser {
	id: number;
	documentId: string;
	username: string;
	email: string;
	provider: string;
	confirmed: boolean;
	blocked: boolean;
	role: {
		id: number;
		name: string;
		type: string;
	};
	phone?: string;
	address?: string;
	name?: string;
	companyName?: string;
	bankName?: string;
	accountNumber?: string;
	accountName?: string;
	saldo_active?: string;
	saldo_refund?: string;
	image?: StrapiMedia | null;
}

export interface StrapiMedia {
	id: number;
	name: string;
	url: string;
	mime: string;
	width?: number;
	height?: number;
}

export interface StrapiCategory {
	id: number;
	documentId: string;
	title: string;
	image: StrapiMedia | null;
}

export interface StrapiUserEventType {
	id: number;
	documentId: string;
	name: string;
	image: StrapiMedia;
	is_ticket: boolean;
}

export interface StrapiVariant {
	id: number;
	name: string;
	price: number;
	quota: string;
	purchase_deadline: string;
	active: boolean;
	image: StrapiMedia | null;
}

export interface StrapiProduct {
	id: number;
	documentId: string;
	title: string;
	description: string;
	main_price: number;
	rate: number;
	kabupaten: string;
	region: string;
	lokasi_event: string;
	kota_event: string;
	event_date: string;
	waktu_event: string;
	end_date: string;
	end_time: string;
	sold_count: number;
	escrow: boolean;
	state: "pending" | "rejected" | "approved";
	is_active: boolean;
	terms_conditions: string;
	main_image: StrapiMedia[];
	variant: StrapiVariant[];
	category: StrapiCategory | null;
	user_event_type: StrapiUserEventType | null;
	users_permissions_user: StrapiUser | null;
}

export interface StrapiTicket {
	id: number;
	documentId: string;
	title: string;
	description: string;
	main_image: StrapiMedia[];
	variant: StrapiVariant[];
	event_date: string;
	waktu_event: string;
	end_date: string;
	end_time: string;
	lokasi_event: string;
	kota_event: string;
	rate: number;
	sold_count: number;
	escrow: boolean;
	state: "pending" | "rejected" | "approved";
	is_active: boolean;
	users_permissions_user: StrapiUser;
	user_event_type: StrapiUserEventType | null;
}

export interface StrapiTransactionTicket {
	id: number;
	documentId: string;
	product_id: string;
	product_name: string;
	variant_id: string;
	variant: string;
	price: string;
	quantity: string;
	customer_name: string;
	telp: string;
	total_price: string;
	payment_status: string;
	event_date: string;
	event_type: string;
	note: string;
	order_id: string;
	customer_mail: string;
	verification: boolean;
	vendor_doc_id: string;
	recipients: unknown;
	products: unknown;
	guest_email: string;
	product_description: string;
}

export interface StrapiBlog {
	id: number;
	documentId: string;
	title: string;
	content: string;
	image: StrapiMedia;
	category: StrapiCategory | null;
	products: StrapiProduct[];
	tickets: StrapiTicket[];
	state: "pending" | "rejected" | "approved";
}

export interface StrapiResponse<T> {
	data: T;
}

export interface StrapiPaginatedResponse<T> {
	data: T[];
	meta: {
		pagination: {
			page: number;
			pageSize: number;
			pageCount: number;
			total: number;
		};
	};
}

export interface AuthResponse {
	jwt: string;
	user: StrapiUser;
}
