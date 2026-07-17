import { create } from "zustand";
import type { Product } from "@/lib/data";

interface VendorProductState {
	products: Product[];
	editingProduct: Product | null;
	isEditModalOpen: boolean;
	setProducts: (products: Product[]) => void;
	addProduct: (product: Omit<Product, "slug" | "date">) => void;
	updateProduct: (slug: string, data: Partial<Product>) => void;
	openEditModal: (product: Product) => void;
	closeEditModal: () => void;
	deleteProducts: (slugs: string[]) => void;
	updateProductStatus: (slugs: string[], status: Product["status"]) => void;
}

function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "")
		.substring(0, 50);
}

export const useVendorProductStore = create<VendorProductState>((set) => ({
	products: [],
	editingProduct: null,
	isEditModalOpen: false,
	setProducts: (products) => set({ products }),
	addProduct: (product) =>
		set((state) => {
			const slug = `${generateSlug(product.name)}-${Date.now().toString(36)}`;
			const newProduct: Product = {
				...product,
				slug,
				date: new Date().toISOString().split("T")[0],
			};
			return { products: [...state.products, newProduct] };
		}),
	updateProduct: (slug, data) =>
		set((state) => ({
			products: state.products.map((p) =>
				p.slug === slug ? { ...p, ...data } : p,
			),
		})),
	openEditModal: (product) =>
		set({ editingProduct: { ...product }, isEditModalOpen: true }),
	closeEditModal: () => set({ editingProduct: null, isEditModalOpen: false }),
	deleteProducts: (slugs) =>
		set((state) => ({
			products: state.products.filter((p) => !slugs.includes(p.slug)),
		})),
	updateProductStatus: (slugs, status) =>
		set((state) => ({
			products: state.products.map((p) => {
				if (!slugs.includes(p.slug)) return p;
				const isActive = status !== "inactive";
				const escrow = status === "escrow_badge";
				return { ...p, status, isActive, escrow };
			}),
		})),
}));
