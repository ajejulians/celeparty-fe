import { formatCurrency } from "@/lib/utils";

interface EscrowBreakdownProps {
  totalPrice: number;
  compact?: boolean;
}

export function EscrowBreakdown({ totalPrice, compact }: EscrowBreakdownProps) {
  const dp = Math.ceil(totalPrice * 0.3);
  const remaining = Math.floor(totalPrice * 0.7);

  if (compact) {
    return (
      <span className="inline-flex items-center gap-1.5 bg-c-blue-50 text-c-blue text-xs font-sans font-medium px-2.5 py-1 rounded-full border border-c-blue-100">
        🔒 Escrow — DP {formatCurrency(dp)}
      </span>
    );
  }

  return (
    <div className="bg-c-blue-50 border border-c-blue-100 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🔒</span>
        <h4 className="font-quick font-semibold text-c-blue text-sm">
          Sistem Pembayaran Escrow
        </h4>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-sans text-neutral-600">Bayar sekarang (DP 30%)</span>
          <span className="font-quick font-bold text-c-blue">{formatCurrency(dp)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-sans text-neutral-400">Pelunasan H-1 sebelum event (70%)</span>
          <span className="font-sans text-neutral-400 text-sm">{formatCurrency(remaining)}</span>
        </div>
        <div className="pt-2 border-t border-c-blue-100 flex justify-between items-center">
          <span className="text-sm font-sans font-medium text-neutral-700">Total</span>
          <span className="font-quick font-bold text-neutral-900">{formatCurrency(totalPrice)}</span>
        </div>
      </div>
      <p className="mt-3 text-xs font-sans text-neutral-500">
        Pelunasan akan ditagihkan via email H-1 sebelum tanggal event.
      </p>
    </div>
  );
}
