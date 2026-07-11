import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Gagal memuat data",
  message = "Terjadi kesalahan saat memuat halaman ini.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-c-red-50 rounded-full flex items-center justify-center mb-4">
        <span className="text-2xl">&#x26A0;&#xFE0F;</span>
      </div>
      <h3 className="font-quick font-semibold text-neutral-900 text-lg mb-1">{title}</h3>
      <p className="font-sans text-sm text-neutral-500 max-w-xs">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-6 py-2.5 bg-c-blue text-white font-quick font-semibold text-sm rounded-lg hover:bg-c-blue/90 transition-colors"
        >
          Coba Lagi
        </button>
      )}
    </div>
  );
}
