"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ErpHeader } from "@/components/layout/ErpHeader";
import { ProductForm } from "@/components/product/ProductForm";

export default function AddProductPage() {
	return (
		<>
			<ErpHeader
				breadcrumbs={[
					{ label: "Dashboard", href: "/user/vendor/dashboard" },
					{ label: "Produk & Layanan", href: "/user/vendor/products" },
					{ label: "Tambah Baru" },
				]}
			/>
			<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="flex items-center gap-4 mb-8">
					<Link
						href="/user/vendor/products"
						className="p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<div>
						<h1 className="font-quick font-bold text-2xl text-neutral-900">
							Tambah Produk / Layanan
						</h1>
						<p className="font-sans text-sm text-neutral-500 mt-1">
							Kelola produk dan jasa vendor Anda
						</p>
					</div>
				</div>

				<ProductForm />
			</div>
		</>
	);
}
