import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EscrowBreakdown } from "@/components/payment/EscrowBreakdown";
import { getPaymentLinkByCode, getProductBySlug } from "@/lib/checkout-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Sparkles, ShieldCheck, Clock } from "lucide-react";

interface PayPageProps {
  params: Promise<{ code: string }>;
}

export default async function PayPage({ params }: PayPageProps) {
  const resolvedParams = await params;
  const paymentLink = getPaymentLinkByCode(resolvedParams.code);

  if (!paymentLink) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-c-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h1 className="font-quick font-bold text-2xl text-neutral-900 mb-2">
            Tautan Tidak Valid
          </h1>
          <p className="font-sans text-sm text-neutral-500 mb-6">
            Tautan pembayaran ini tidak ditemukan atau sudah kadaluarsa. Hubungi
            penyelenggara untuk tautan baru.
          </p>
          <Link href="/">
            <Button variant="outline" size="lg" className="min-h-[44px]">
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const product = getProductBySlug(paymentLink.productSlug);
  const variant = product?.variants[paymentLink.variantIndex];

  if (!product || !variant) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="font-quick font-bold text-2xl text-neutral-900 mb-2">
            Produk tidak ditemukan
          </h1>
        </div>
      </div>
    );
  }

  const typeLabel =
    paymentLink.type === "dp"
      ? "Pembayaran DP 30%"
      : paymentLink.type === "remaining"
      ? "Pelunasan 70%"
      : "Pembayaran Penuh";

  const bgColor =
    paymentLink.type === "remaining" ? "bg-status-success/5" : "bg-c-blue";

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-4">
            <img src="/images/favicon.ico" alt="Celeparty Logo" className="w-10 h-10 object-contain rounded-xl" />
            <span className="font-quick font-bold text-xl text-c-blue">
              CELEPARTY
            </span>
          </div>
        </div>

        <Card className="animate-slide-up motion-reduce:animate-none">
          <div
            className={`${bgColor} rounded-t-lg px-6 py-4 text-center`}
          >
            <p className="text-2xl mb-1">🎉</p>
            <h2 className="font-quick font-bold text-lg text-white mb-1">
              {typeLabel}
            </h2>
            <p className="text-sm font-sans text-white/80">
              {product.name}
            </p>
          </div>

          <CardContent className="pt-6 space-y-4">
            <div className="text-center py-4">
              <p className="text-xs font-sans text-neutral-500 mb-1">
                Jumlah Pembayaran
              </p>
              <p className="font-quick font-bold text-3xl text-c-blue">
                {formatCurrency(paymentLink.amount)}
              </p>
              <p className="text-xs font-sans text-neutral-500 mt-1">
                {variant.name}
              </p>
            </div>

            {product.status === "escrow_badge" && (
              <EscrowBreakdown totalPrice={variant.price} />
            )}

            <div className="flex items-center gap-2 text-xs font-sans text-neutral-500 justify-center">
              <Clock className="w-3.5 h-3.5" />
              Berlaku hingga{" "}
              {formatDate(paymentLink.validUntil.split("T")[0])}
            </div>

            <Button variant="cta" size="lg" className="w-full min-h-[44px]" asChild>
              <Link
                href={`/checkout?product=${encodeURIComponent(paymentLink.productSlug)}&variant=${paymentLink.variantIndex}&qty=1`}
              >
                Bayar Sekarang
              </Link>
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs font-sans text-neutral-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Dibayar via Midtrans
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link
            href="/help"
            className="font-sans text-xs text-neutral-500 hover:text-c-blue transition-colors"
          >
            Butuh bantuan? Hubungi kami
          </Link>
        </div>
      </div>
    </div>
  );
}
