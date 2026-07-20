import { products as dummyProducts, type Product } from "@/lib/data";
import type {
	StrapiCategory,
	StrapiPaginatedResponse,
	StrapiProduct,
	StrapiResponse,
} from "@/types/strapi";

interface ProductFilters {
	category?: string;
	city?: string;
	priceMin?: number;
	priceMax?: number;
	search?: string;
	page?: number;
	pageSize?: number;
	sort?: string;
}

export function productToStrapiProduct(p: Product, index: number): StrapiProduct {
	return {
		id: index + 1,
		documentId: p.slug,
		title: p.name,
		description: p.description,
		main_price: p.priceFrom,
		rate: 5,
		kabupaten: p.city,
		region: p.city,
		lokasi_event: p.city,
		kota_event: p.city,
		event_date: p.date,
		waktu_event: "10:00 - 18:00 WIB",
		end_date: p.date,
		end_time: "18:00 WIB",
		sold_count: Math.max(0, (p.totalStock || 10) - (p.stock || 0)),
		escrow: p.escrow,
		state: "approved",
		is_active: p.isActive,
		terms_conditions: "Syarat & ketentuan penyewaan berlaku.",
		main_image: p.imageUrl
			? [{ id: index + 1, name: p.name, url: p.imageUrl, mime: "image/jpeg" }]
			: [],
		variant: (p.variants || []).map((v, idx) => ({
			id: idx + 1,
			name: v.name,
			price: v.price,
			quota: String(p.totalStock || 10),
			purchase_deadline: p.date,
			active: true,
			image: null,
		})),
		category: {
			id: 1,
			documentId: (p.category || "").toLowerCase().replace(/\s+/g, "-"),
			title: p.category || "Umum",
			image: null,
		},
		user_event_type: null,
		users_permissions_user: {
			id: 100,
			documentId: p.vendorId || "v-001",
			username: p.vendorName || "Jakarta Audio Pro",
			email: `${p.vendorId || "v-001"}@celeparty.id`,
			provider: "local",
			confirmed: true,
			blocked: false,
			role: { id: 2, name: "Vendor", type: "vendor" },
			name: p.vendorName || "Jakarta Audio Pro",
		},
	};
}

export async function getProducts(
	filters?: ProductFilters,
): Promise<StrapiPaginatedResponse<StrapiProduct>> {
	let list = dummyProducts.map((p, idx) => productToStrapiProduct(p, idx));

	list = list.filter((p) => p.is_active && p.state === "approved");

	if (filters?.category) {
		const catLower = filters.category.toLowerCase();
		list = list.filter((p) => p.category?.title.toLowerCase() === catLower);
	}

	if (filters?.city) {
		const cityLower = filters.city.toLowerCase();
		list = list.filter((p) => p.kota_event.toLowerCase() === cityLower);
	}

	if (filters?.priceMin !== undefined) {
		list = list.filter((p) => p.main_price >= filters.priceMin!);
	}

	if (filters?.priceMax !== undefined) {
		list = list.filter((p) => p.main_price <= filters.priceMax!);
	}

	if (filters?.search) {
		const s = filters.search.toLowerCase();
		list = list.filter(
			(p) =>
				p.title.toLowerCase().includes(s) ||
				p.description.toLowerCase().includes(s) ||
				p.kota_event.toLowerCase().includes(s) ||
				(p.users_permissions_user?.name || "").toLowerCase().includes(s),
		);
	}

	if (filters?.sort) {
		if (filters.sort === "main_price:asc") {
			list.sort((a, b) => a.main_price - b.main_price);
		} else if (filters.sort === "main_price:desc") {
			list.sort((a, b) => b.main_price - a.main_price);
		}
	}

	const total = list.length;
	const page = filters?.page || 1;
	const pageSize = filters?.pageSize || 10;
	const pageCount = Math.ceil(total / pageSize) || 1;
	const startIndex = (page - 1) * pageSize;
	const sliced = list.slice(startIndex, startIndex + pageSize);

	return {
		data: sliced,
		meta: {
			pagination: {
				page,
				pageSize,
				pageCount,
				total,
			},
		},
	};
}

export async function getAllProducts(): Promise<
	StrapiPaginatedResponse<StrapiProduct>
> {
	const list = dummyProducts.map((p, idx) => productToStrapiProduct(p, idx));
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

export async function getProductByDocumentId(
	documentId: string,
): Promise<StrapiResponse<StrapiProduct>> {
	const all = dummyProducts.map((p, idx) => productToStrapiProduct(p, idx));
	const found =
		all.find(
			(p) =>
				p.documentId === documentId ||
				p.documentId.toLowerCase() === documentId.toLowerCase(),
		) || all[0];

	return { data: found };
}

export async function getProductsByVendor(
	vendorDocumentId: string,
): Promise<StrapiPaginatedResponse<StrapiProduct>> {
	const all = dummyProducts.map((p, idx) => productToStrapiProduct(p, idx));
	const filtered = all.filter(
		(p) =>
			p.users_permissions_user?.documentId === vendorDocumentId ||
			vendorDocumentId === "v-001",
	);

	return {
		data: filtered,
		meta: {
			pagination: {
				page: 1,
				pageSize: 100,
				pageCount: 1,
				total: filtered.length,
			},
		},
	};
}

export async function createProduct(
	data: Record<string, unknown>,
): Promise<StrapiResponse<StrapiProduct>> {
	const newProduct: Product = {
		slug: `prod-${Date.now()}`,
		name: (data.title as string) || "Produk Baru",
		category: "Audio & Sound",
		city: (data.kota_event as string) || "Jakarta",
		date: new Date().toISOString().split("T")[0],
		imageUrl:
			"https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=450&fit=crop",
		priceFrom: (data.main_price as number) || 1000000,
		rentalUnit: "Hari",
		isNegotiable: false,
		isActive: true,
		escrow: Boolean(data.escrow),
		status: "active",
		variants: [
			{
				name: "Standar",
				price: (data.main_price as number) || 1000000,
			},
		],
		description: (data.description as string) || "Deskripsi produk baru.",
		vendorName: "Jakarta Audio Pro",
		vendorId: "v-001",
		stock: 5,
		totalStock: 5,
	};

	dummyProducts.push(newProduct);
	return { data: productToStrapiProduct(newProduct, dummyProducts.length - 1) };
}

export async function updateProduct(
	documentId: string,
	data: Record<string, unknown>,
): Promise<StrapiResponse<StrapiProduct>> {
	const idx = dummyProducts.findIndex((p) => p.slug === documentId);
	if (idx !== -1) {
		if (data.title !== undefined) dummyProducts[idx].name = data.title as string;
		if (data.description !== undefined)
			dummyProducts[idx].description = data.description as string;
		if (data.main_price !== undefined)
			dummyProducts[idx].priceFrom = data.main_price as number;
		if (data.kota_event !== undefined)
			dummyProducts[idx].city = data.kota_event as string;
		if (data.is_active !== undefined)
			dummyProducts[idx].isActive = data.is_active as boolean;
		if (data.escrow !== undefined)
			dummyProducts[idx].escrow = data.escrow as boolean;
		return { data: productToStrapiProduct(dummyProducts[idx], idx) };
	}
	const fallback = dummyProducts[0];
	return { data: productToStrapiProduct(fallback, 0) };
}

export async function deleteProduct(documentId: string): Promise<void> {
	const idx = dummyProducts.findIndex((p) => p.slug === documentId);
	if (idx !== -1) {
		dummyProducts.splice(idx, 1);
	}
}

export async function getCategories(): Promise<
	StrapiPaginatedResponse<StrapiCategory>
> {
	const uniqueCats = Array.from(
		new Set(dummyProducts.map((p) => p.category).filter(Boolean)),
	);
	const categories: StrapiCategory[] = uniqueCats.map((cat, idx) => ({
		id: idx + 1,
		documentId: cat.toLowerCase().replace(/\s+/g, "-"),
		title: cat,
		image: null,
	}));

	return {
		data: categories,
		meta: {
			pagination: {
				page: 1,
				pageSize: 100,
				pageCount: 1,
				total: categories.length,
			},
		},
	};
}

export async function uploadProductImage(
	_file: File,
): Promise<{ id: number; name: string; url: string }[]> {
	return [
		{
			id: Math.floor(Math.random() * 1000) + 1,
			name: "uploaded_image.jpg",
			url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&h=450&fit=crop",
		},
	];
}

