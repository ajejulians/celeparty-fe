"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-c-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-8 h-8 text-c-red" />
        </div>
        <h1 className="font-quick font-bold text-2xl text-neutral-900 mb-2">
          Terjadi Kesalahan
        </h1>
        <p className="font-sans text-sm text-neutral-500 mb-6">
          Halaman ini mengalami masalah. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center gap-2 bg-c-blue text-white font-quick font-semibold text-sm px-6 py-3 rounded-lg min-h-[44px] hover:bg-c-blue/90 transition-all"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}
