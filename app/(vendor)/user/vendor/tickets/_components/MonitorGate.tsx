"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { getEventById, type VendorEvent } from "@/lib/ticket-data";
import { KeyRound, ShieldCheck, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface MonitorGateProps {
  event: VendorEvent;
  children: (event: VendorEvent) => React.ReactNode;
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
}

export function MonitorGate({ event, children, backHref = "/user/vendor/tickets", backLabel = "Kembali ke Daftar Event", onBack }: MonitorGateProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  const handleSubmit = () => {
    if (pin.length !== 6) { setError("PIN harus 6 digit"); return; }
    // ponytail: mock PIN; replace with API
    if (pin === "123456") { setError(""); setVerified(true); }
    else setError("PIN tidak valid");
  };

  if (verified) return <>{children(event)}</>;

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      {onBack ? (
        <button onClick={onBack} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 font-sans text-sm">
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </button>
      ) : (
        <Link href={backHref} className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 mb-6 font-sans text-sm">
          <ArrowLeft className="w-4 h-4" /> {backLabel}
        </Link>
      )}
      <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-modal text-center space-y-6">
        <div className="w-16 h-16 bg-c-blue-50 rounded-full flex items-center justify-center mx-auto">
          <KeyRound className="w-8 h-8 text-c-blue" />
        </div>
        <div>
          <h2 className="font-quick font-bold text-lg text-neutral-900">{event.name}</h2>
          <p className="font-sans text-sm text-neutral-500 mt-1">Masukkan PIN Keamanan Vendor untuk mengakses panel operasional</p>
        </div>
        <div className="space-y-2">
          <Label className="font-sans text-neutral-700">PIN 6-Digit</Label>
          <Input
            type="password"
            inputMode="numeric"
            maxLength={6}
            value={pin}
            onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(""); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
            placeholder="••••••"
            className="text-center text-2xl tracking-[0.5em] h-12"
            autoFocus
          />
          {error && <p className="text-xs text-c-red font-sans">{error}</p>}
        </div>
        <Button onClick={handleSubmit} disabled={pin.length !== 6} className="w-full font-quick font-semibold h-11">
          <ShieldCheck className="w-4 h-4 mr-2" /> Verifikasi & Masuk
        </Button>
        <p className="text-xs text-neutral-400 font-sans">PIN demo: 123456</p>
      </div>
    </div>
  );
}
