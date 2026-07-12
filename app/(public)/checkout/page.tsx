import { CheckoutFormWrapper } from "@/components/checkout/CheckoutFormWrapper";
import { getProductBySlug } from "@/lib/checkout-data";
import Link from "next/link";

interface CheckoutPageProps {
  searchParams: Promise<{ product?: string; variant?: string; qty?: string }>;
}

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const resolvedSearchParams = await searchParams;
  const productSlug = resolvedSearchParams.product ?? "";
  const variantIndex = parseInt(resolvedSearchParams.variant ?? "0", 10);
  const qty = parseInt(resolvedSearchParams.qty ?? "1", 10);
  const product = getProductBySlug(productSlug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-quick font-bold text-2xl text-neutral-900">
          Produk tidak ditemukan
        </h1>
        <p className="font-sans text-sm text-neutral-500 mt-2 mb-4">
          Produk yang Anda cari tidak tersedia atau tautan tidak valid.
        </p>
        <Link
          href="/products"
          className="inline-block text-c-blue font-quick font-semibold text-sm hover:underline"
        >
          &larr; Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const validVariantIndex = Math.min(
    Math.max(0, variantIndex),
    product.variants.length - 1
  );
  const validQty = Math.max(1, Math.min(qty, 10));

  return (
    <div className="min-h-screen bg-neutral-50">
      <CheckoutFormWrapper
        productSlug={productSlug}
        variantIndex={validVariantIndex}
        qty={validQty}
      />
    </div>
  );
}
