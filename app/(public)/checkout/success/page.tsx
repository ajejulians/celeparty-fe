import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/feedback/StatusBadge";
import { EscrowBreakdown } from "@/components/payment/EscrowBreakdown";
import { getOrderById, getProductBySlug } from "@/lib/checkout-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CheckCircle2, ArrowRight, ShoppingBag, Calendar, MapPin, Ticket } from "lucide-react";

interface SuccessPageProps {
  searchParams: { order?: string };
}

export default function CheckoutSuccessPage({ searchParams }: SuccessPageProps) {
  const orderId = searchParams.order ?? "";
  const order = getOrderById(orderId);

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-quick font-bold text-2xl text-neutral-900">
          Pesanan tidak ditemukan
        </h1>
        <p className="font-sans text-sm text-neutral-500 mt-2 mb-4">
          Tautan tidak valid atau pesanan sudah kadaluarsa.
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

  const product = getProductBySlug(
    order.product.toLowerCase().replace(/\s+/g, "-")
  );
  const isEscrow = product?.status === "escrow_badge";

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-status-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-status-success" />
          </div>
          <h1 className="font-quick font-bold text-2xl text-neutral-900 mb-2">
            Pesanan Berhasil!
          </h1>
          <p className="font-sans text-sm text-neutral-500 max-w-md mx-auto">
            Pesanan Anda telah dibuat. E-ticket akan dikirim ke email penerima
            setelah pembayaran dikonfirmasi vendor.
          </p>
        </div>

        <Card className="animate-slide-up">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Detail Pesanan</CardTitle>
              <StatusBadge status={order.paymentStatus} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs font-sans text-neutral-500 mb-0.5">
                  No. Order
                </p>
                <p className="font-mono font-semibold text-sm text-neutral-900">
                  {order.orderId}
                </p>
              </div>
              <div>
                <p className="text-xs font-sans text-neutral-500 mb-0.5">
                  Barcode
                </p>
                <p className="font-mono font-semibold text-sm text-neutral-900">
                  {order.barcode}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-lg bg-neutral-100 shrink-0" />
              <div className="min-w-0">
                <h4 className="font-quick font-semibold text-neutral-900">
                  {order.product}
                </h4>
                <p className="text-sm font-sans text-neutral-500">
                  {order.variant} &times; {order.qty}
                </p>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-sans text-neutral-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(order.eventDate)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Ticket className="w-3.5 h-3.5" />
                    {order.qty} Tiket
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-neutral-100" />

            {isEscrow ? (
              <EscrowBreakdown totalPrice={order.total} />
            ) : (
              <div className="flex justify-between items-center">
                <span className="font-quick font-semibold text-neutral-900">
                  Total Dibayar
                </span>
                <span className="font-quick font-bold text-xl text-c-blue">
                  {formatCurrency(order.total)}
                </span>
              </div>
            )}

            <div className="bg-c-blue-50 border border-c-blue-100 rounded-xl p-4">
              <p className="text-xs font-sans text-c-blue">
                <strong>Status Vendor:</strong>{" "}
                {order.vendorStatus === "pending"
                  ? "Menunggu konfirmasi vendor"
                  : order.vendorStatus === "approved"
                  ? "Dikonfirmasi"
                  : "Ditolak"}
              </p>
              <p className="text-xs font-sans text-c-blue mt-1">
                E-ticket akan dikirim setelah vendor mengkonfirmasi pesanan Anda.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Button variant="outline" size="lg" className="flex-1 min-h-[44px]" asChild>
            <Link href="/products">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Lanjut Belanja
            </Link>
          </Button>
          <Button variant="cta" size="lg" className="flex-1 min-h-[44px]" asChild>
            <Link href="/">
              Kembali ke Beranda
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
