"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { CreditCard, Building2, Smartphone, CheckCircle2, Loader2 } from "lucide-react";

interface PaymentSimulatorProps {
  open: boolean;
  amount: number;
  productName: string;
  onSuccess: () => void;
  onClose: () => void;
}

const BANKS = [
  { id: "bca", name: "BCA Virtual Account", icon: <Building2 className="w-8 h-8" /> },
  { id: "mandiri", name: "Mandiri Bill Payment", icon: <Building2 className="w-8 h-8" /> },
  { id: "bni", name: "BNI Virtual Account", icon: <Building2 className="w-8 h-8" /> },
  { id: "bri", name: "BRI Virtual Account", icon: <Building2 className="w-8 h-8" /> },
  { id: "gopay", name: "GoPay", icon: <Smartphone className="w-8 h-8" /> },
  { id: "qris", name: "QRIS", icon: <CreditCard className="w-8 h-8" /> },
];

export function PaymentSimulator({
  open,
  amount,
  productName,
  onSuccess,
  onClose,
}: PaymentSimulatorProps) {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const vaNumberRef = useRef<string>("");
  const timeout1Ref = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timeout2Ref = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      setSelectedBank(null);
      setIsProcessing(false);
      setIsComplete(false);
      vaNumberRef.current = "";
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (timeout1Ref.current) clearTimeout(timeout1Ref.current);
      if (timeout2Ref.current) clearTimeout(timeout2Ref.current);
    };
  }, []);

  if (!open) return null;

  if (selectedBank && !vaNumberRef.current) {
    vaNumberRef.current = `${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  }

  const handlePay = () => {
    if (isProcessing) return;
    setIsProcessing(true);
    timeout1Ref.current = setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);
      timeout2Ref.current = setTimeout(() => {
        onSuccess();
      }, 1200);
    }, 2500);
  };

  const reset = () => {
    setSelectedBank(null);
    setIsProcessing(false);
    setIsComplete(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
        onClick={isProcessing ? undefined : reset}
      />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-md mx-4 animate-slide-up">
        <div className="p-6">
          {!selectedBank ? (
            <>
              <div className="text-center mb-6">
                <h2 className="font-quick font-bold text-xl text-neutral-900 mb-1">
                  Pilih Metode Pembayaran
                </h2>
                <p className="font-sans text-sm text-neutral-500">
                  {productName}
                </p>
                <p className="font-quick font-bold text-2xl text-c-blue mt-3">
                  {formatCurrency(amount)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {BANKS.map((bank) => (
                  <button
                    key={bank.id}
                    onClick={() => setSelectedBank(bank.id)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl border border-neutral-200 hover:border-c-blue hover:bg-c-blue-50 transition-all duration-200 text-center"
                  >
                    <div className="text-neutral-700">{bank.icon}</div>
                    <span className="font-sans text-xs text-neutral-700 leading-tight">
                      {bank.name}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : isComplete ? (
            <div className="text-center py-8 animate-fade-in">
              <CheckCircle2 className="w-16 h-16 text-status-success mx-auto mb-4" />
              <h2 className="font-quick font-bold text-xl text-neutral-900 mb-1">
                Pembayaran Berhasil!
              </h2>
              <p className="font-sans text-sm text-neutral-500">
                Mengalihkan ke halaman konfirmasi...
              </p>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => {
                    if (!isProcessing) setSelectedBank(null);
                  }}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors"
                  disabled={isProcessing}
                >
                  &larr;
                </button>
                <div>
                  <h2 className="font-quick font-bold text-lg text-neutral-900">
                    {BANKS.find((b) => b.id === selectedBank)?.name}
                  </h2>
                  <p className="font-sans text-sm text-neutral-500">
                    Virtual Account
                  </p>
                </div>
              </div>

              <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-sans text-neutral-500 mb-1">
                  Nomor Virtual Account
                </p>
                <p className="font-mono font-bold text-xl text-neutral-900 tracking-wider">
                  {vaNumberRef.current}
                </p>
              </div>

              <div className="bg-c-blue-50 border border-c-blue-100 rounded-xl p-4 mb-6">
                <div className="flex justify-between mb-1">
                  <span className="font-sans text-sm text-neutral-600">
                    Total Pembayaran
                  </span>
                  <span className="font-quick font-bold text-c-blue">
                    {formatCurrency(amount)}
                  </span>
                </div>
              </div>

              {isProcessing ? (
                <Button className="w-full min-h-[44px]" size="lg" disabled>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses Pembayaran...
                </Button>
              ) : (
                <Button
                  variant="cta"
                  size="lg"
                  className="w-full min-h-[44px]"
                  onClick={handlePay}
                >
                  Konfirmasi Pembayaran
                </Button>
              )}

              <p className="text-xs font-sans text-neutral-400 text-center mt-3">
                Ini adalah simulasi pembayaran. Tidak ada transaksi nyata.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
