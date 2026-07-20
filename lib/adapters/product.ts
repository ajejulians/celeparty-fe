import type { StrapiProduct } from "@/types/strapi";
import type { Product } from "@/lib/data";

export function adaptStrapiProductToProduct(sp: StrapiProduct): Product {
	const totalStock =
		sp.variant?.reduce((sum, v) => sum + Number(v.quota || 0), 0) || 0;

	return {
		slug: sp.documentId,
		name: sp.title,
		category: sp.category?.title || "",
		city: sp.kota_event || "",
		date: sp.event_date || "",
		imageUrl: getStrapiMediaUrl(sp.main_image?.[0]?.url || ""),
		priceFrom: sp.main_price || 0,
		rentalUnit: "Hari",
		isNegotiable: false,
		isActive: sp.is_active,
		escrow: sp.escrow,
		stock: totalStock - (sp.sold_count || 0),
		totalStock,
		status: computeStatus(sp),
		variants:
			sp.variant?.map((v) => ({
				name: v.name || "",
				price: v.price || 0,
			})) || [],
		description: sp.description || "",
		vendorName:
			sp.users_permissions_user?.name ||
			sp.users_permissions_user?.username ||
			"",
		vendorId: sp.users_permissions_user?.documentId || "",
	};
}

function computeStatus(sp: StrapiProduct): Product["status"] {
	if (!sp.is_active) return "inactive";
	if (sp.state !== "approved") return "inactive";
	if (sp.escrow) return "escrow_badge";
	const totalStock =
		sp.variant?.reduce((sum, v) => sum + Number(v.quota || 0), 0) || 0;
	if (totalStock - (sp.sold_count || 0) === 0) return "sold_out";
	return "active";
}

const API_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export function getStrapiMediaUrl(url: string): string {
	if (!url) return "";
	if (url.startsWith("http")) return url;
	return `${API_BASE}${url}`;
}
