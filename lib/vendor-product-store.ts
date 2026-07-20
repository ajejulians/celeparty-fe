import { create } from "zustand";
import {
	createProduct,
	deleteProduct,
	getProductsByVendor,
	updateProduct,
	uploadProductImage,
} from "@/lib/api/products";
import { adaptStrapiProductToProduct } from "@/lib/adapters/product";
import type { Product } from "@/lib/data";

interface VendorProductState {
	products: Product[];
	editingProduct: Product | null;
	isEditModalOpen: boolean;
	isLoading: boolean;
	setProducts: (products: Product[]) => void;
	addProduct: (product: Omit<Product, "slug" | "date">, imageFile?: File | null) => Promise<void>;
	updateProductLocal: (slug: string, data: Partial<Product>, imageFile?: File | null) => Promise<void>;
	openEditModal: (product: Product) => void;
	closeEditModal: () => void;
	deleteProducts: (slugs: string[]) => Promise<void>;
	updateProductStatus: (slugs: string[], status: Product["status"]) => Promise<void>;
	fetchVendorProducts: (vendorDocumentId: string) => Promise<void>;
}

export const useVendorProductStore = create<VendorProductState>((set, get) => ({
	products: [],
	editingProduct: null,
	isEditModalOpen: false,
	isLoading: false,
	setProducts: (products) => set({ products }),

	addProduct: async (product, imageFile) => {
		let imageIds: number[] = [];
		if (imageFile) {
			const uploadResult = await uploadProductImage(imageFile);
			imageIds = uploadResult.map((f) => f.id);
		}

		const data: Record<string, unknown> = {
			title: product.name,
			description: product.description,
			main_price: product.priceFrom,
			kota_event: product.city || "",
			is_active: product.isActive,
			escrow: product.escrow,
			state: "pending",
			sold_count: 0,
			variant: product.variants.map((v) => ({
				name: v.name,
				price: v.price,
				quota: "1",
				active: true,
			})),
			users_permissions_user: { documentId: product.vendorId },
		};

		if (imageIds.length > 0) {
			data.main_image = imageIds;
		}

		const res = await createProduct(data);
		const adapted = adaptStrapiProductToProduct(res.data);
		set((state) => ({ products: [...state.products, adapted] }));
	},

	updateProductLocal: async (slug, data, imageFile) => {
		let imageIds: number[] | undefined;
		if (imageFile) {
			const uploadResult = await uploadProductImage(imageFile);
			imageIds = uploadResult.map((f) => f.id);
		}

		const apiData: Record<string, unknown> = {};
		if (data.name !== undefined) apiData.title = data.name;
		if (data.description !== undefined) apiData.description = data.description;
		if (data.priceFrom !== undefined) apiData.main_price = data.priceFrom;
		if (data.city !== undefined) apiData.kota_event = data.city;
		if (data.isActive !== undefined) apiData.is_active = data.isActive;
		if (data.escrow !== undefined) apiData.escrow = data.escrow;
		if (data.status !== undefined) {
			apiData.is_active = data.status !== "inactive";
			apiData.escrow = data.status === "escrow_badge";
		}
		if (imageIds) apiData.main_image = imageIds;

		await updateProduct(slug, apiData);
		set((state) => ({
			products: state.products.map((p) =>
				p.slug === slug ? { ...p, ...data } : p,
			),
		}));
	},

	openEditModal: (product) =>
		set({ editingProduct: { ...product }, isEditModalOpen: true }),
	closeEditModal: () => set({ editingProduct: null, isEditModalOpen: false }),

	deleteProducts: async (slugs) => {
		await Promise.all(slugs.map((s) => deleteProduct(s)));
		set((state) => ({
			products: state.products.filter((p) => !slugs.includes(p.slug)),
		}));
	},

	updateProductStatus: async (slugs, status) => {
		const isActive = status !== "inactive";
		const escrow = status === "escrow_badge";
		await Promise.all(
			slugs.map((s) => updateProduct(s, { is_active: isActive, escrow })),
		);
		set((state) => ({
			products: state.products.map((p) =>
				slugs.includes(p.slug) ? { ...p, status, isActive, escrow } : p,
			),
		}));
	},

	fetchVendorProducts: async (vendorDocumentId) => {
		set({ isLoading: true });
		try {
			const res = await getProductsByVendor(vendorDocumentId);
			set({
				products: res.data.map(adaptStrapiProductToProduct),
				isLoading: false,
			});
		} catch {
			set({ isLoading: false });
		}
	},
}));
