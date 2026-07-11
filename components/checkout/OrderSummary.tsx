import { formatCurrency, formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EscrowBreakdown } from "@/components/payment/EscrowBreakdown";
import { getProductBySlug } from "@/lib/checkout-data";
import { ShieldCheck, MapPin } from "lucide-react";

interface OrderSummaryProps {
  productSlug: string;
  variantIndex: number;
  qty: number;
}

export function OrderSummary({ productSlug, variantIndex, qty }: OrderSummaryProps) {
  const product = getProductBySlug(productSlug);

  if (!product) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="font-sans text-sm text-neutral-500">Produk tidak ditemukan.</p>
        </CardContent>
      </Card>
    );
  }

  const variant = product.variants[variantIndex];
  if (!variant) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="font-sans text-sm text-neutral-500">Varian tidak ditemukan.</p>
        </CardContent>
      </Card>
    );
  }

  const subtotal = variant.price * qty;
  const isEscrow = product.status === "escrow_badge";

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Ringkasan Pesanan</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <div className="w-16 h-16 rounded-lg bg-neutral-100 shrink-0 overflow-hidden">
            <div className="w-full h-full bg-neutral-200" />
          </div>
          <div className="min-w-0">
            <h4 className="font-quick font-semibold text-sm text-neutral-900 truncate">
              {product.name}
            </h4>
            <p className="text-xs font-sans text-neutral-500 mt-0.5">
              {variant.name}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <MapPin className="w-3 h-3 text-neutral-400" />
              <span className="text-xs font-sans text-neutral-500">
                {product.city} &middot; {formatDate(product.date)}
              </span>
            </div>
          </div>
        </div>

        <hr className="border-neutral-100" />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-sans text-neutral-600">
              {variant.name} &times; {qty}
            </span>
            <span className="font-sans text-neutral-900">
              {formatCurrency(subtotal)}
            </span>
          </div>

          {isEscrow ? (
            <EscrowBreakdown totalPrice={subtotal} />
          ) : (
            <>
              <hr className="border-neutral-100" />
              <div className="flex justify-between items-center">
                <span className="font-quick font-semibold text-sm text-neutral-900">
                  Total
                </span>
                <span className="font-quick font-bold text-lg text-c-blue">
                  {formatCurrency(subtotal)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2 text-xs font-sans text-neutral-500">
          <ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
          Pembayaran aman via Midtrans
        </div>
      </CardContent>
    </Card>
  );
}
