"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProgressSteps } from "@/components/checkout/ProgressSteps";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { PaymentSimulator } from "@/components/checkout/PaymentSimulator";
import { RecipientForm } from "@/components/ticket/RecipientForm";
import { getProductBySlug, createOrder } from "@/lib/checkout-data";
import {
  recipientSchema,
  RecipientFormData,
} from "@/lib/validators";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";

interface CheckoutFormWrapperProps {
  productSlug: string;
  variantIndex: number;
  qty: number;
}

export function CheckoutFormWrapper({
  productSlug,
  variantIndex,
  qty,
}: CheckoutFormWrapperProps) {
  const router = useRouter();
  const [recipients, setRecipients] = useState<Partial<RecipientFormData>[]>(
    () =>
      Array.from({ length: qty }, () => ({
        name: "",
        email: "",
        whatsapp: "",
        identityType: undefined,
        identityNumber: "",
      }))
  );
  const [errors, setErrors] = useState<
    Partial<Record<keyof RecipientFormData, string>>[]
  >(() => Array.from({ length: qty }, () => ({})));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const product = getProductBySlug(productSlug);
  const variant = product?.variants[variantIndex];

  const updateRecipient = useCallback(
    (index: number, data: Partial<RecipientFormData>) => {
      setRecipients((prev) => {
        const next = [...prev];
        next[index] = data;
        return next;
      });
      setErrors((prev) => {
        const next = [...prev];
        next[index] = {};
        return next;
      });
    },
    []
  );

  const validateAll = (): boolean => {
    const newErrors: Partial<Record<keyof RecipientFormData, string>>[] = [];
    let isValid = true;

    recipients.forEach((r) => {
      const result = recipientSchema.safeParse(r);
      if (!result.success) {
        isValid = false;
        const fieldErrors: Partial<Record<keyof RecipientFormData, string>> =
          {};
        result.error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof RecipientFormData;
          fieldErrors[field] = issue.message;
        });
        newErrors.push(fieldErrors);
      } else {
        newErrors.push({});
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateAll()) {
      toast.error("Mohon lengkapi data semua penerima dengan benar.");
      return;
    }

    setIsSubmitting(true);
    setShowPayment(true);
    setCurrentStep(1);
  };

  const handlePaymentSuccess = () => {
    const validRecipients = recipients as RecipientFormData[];
    const order = createOrder(productSlug, variantIndex, qty, validRecipients);

    if (!order) {
      toast.error("Gagal membuat pesanan. Silakan coba lagi.");
      setIsSubmitting(false);
      setShowPayment(false);
      return;
    }

    setIsSubmitting(false);
    setShowPayment(false);
    setCurrentStep(2);
    toast.success("Pesanan berhasil dibuat!");
    router.push(`/checkout/success?order=${order.orderId}`);
  };

  const handlePaymentClose = () => {
    setShowPayment(false);
    setIsSubmitting(false);
  };

  if (!product || !variant) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="font-quick font-bold text-2xl text-neutral-900">
          Produk tidak ditemukan
        </h1>
        <Link
          href="/products"
          className="inline-block mt-4 text-c-blue font-quick font-semibold text-sm hover:underline"
        >
          &larr; Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const totalPrice = variant.price * qty;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link
        href={`/products/${productSlug}`}
        className="inline-flex items-center gap-1 text-sm font-sans text-neutral-500 hover:text-c-blue transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Detail Produk
      </Link>

      <div className="mb-8">
        <ProgressSteps
          steps={["Isi Data", "Ringkasan", "Bayar"]}
          currentStep={currentStep}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="font-quick font-bold text-2xl text-neutral-900 mb-1">
              Isi Data Penerima
            </h1>
            <p className="font-sans text-sm text-neutral-500">
              {product.name} &mdash; {variant.name} &times; {qty}
            </p>
          </div>

          {recipients.map((recipient, i) => (
            <RecipientForm
              key={i}
              index={i}
              value={recipient}
              errors={errors[i] ?? {}}
              onChange={(data) => updateRecipient(i, data)}
            />
          ))}

          <div className="flex items-center gap-2 text-sm font-sans text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-status-success shrink-0" />
            Data Anda aman dan hanya digunakan untuk keperluan verifikasi tiket.
          </div>

          <div className="flex gap-3 lg:hidden">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 min-h-[44px]"
              onClick={() => router.push(`/products/${productSlug}`)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="cta"
              size="lg"
              className="flex-1 min-h-[44px]"
              disabled={isSubmitting}
            >
              Lanjut ke Pembayaran
            </Button>
          </div>

          <div className="hidden lg:block">
            <Button
              type="submit"
              variant="cta"
              size="lg"
              className="w-full min-h-[44px]"
              disabled={isSubmitting}
            >
              Lanjut ke Pembayaran
            </Button>
          </div>
        </form>

        <aside className="lg:col-span-1">
          <OrderSummary
            productSlug={productSlug}
            variantIndex={variantIndex}
            qty={qty}
          />
        </aside>
      </div>

      <PaymentSimulator
        open={showPayment}
        amount={totalPrice}
        productName={`${product.name} - ${variant.name}`}
        onSuccess={handlePaymentSuccess}
        onClose={handlePaymentClose}
      />
    </div>
  );
}
