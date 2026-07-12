"use client";

import { useRef } from "react";
import { AlertTriangle } from "lucide-react";

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
}

export function OtpInput({
  length = 4,
  value,
  onChange,
  disabled = false,
  error,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted.length > 0) {
      onChange(pasted);
      inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-3">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ""}
            disabled={disabled}
            onPaste={i === 0 ? handlePaste : undefined}
            onChange={(e) => {
              const newVal = value.split("");
              newVal[i] = e.target.value.replace(/\D/g, "");
              onChange(newVal.join(""));
              if (e.target.value && i < length - 1) {
                inputRefs.current[i + 1]?.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !value[i] && i > 0) {
                inputRefs.current[i - 1]?.focus();
              }
            }}
            className={`w-12 h-14 text-center font-quick font-bold text-xl rounded-lg border-2 transition-all duration-150 focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 ${
              error
                ? "border-c-red ring-2 ring-c-red/15"
                : "border-neutral-200"
            } disabled:bg-neutral-50 disabled:cursor-not-allowed`}
          />
        ))}
      </div>
      {error && (
        <p className="text-xs font-sans text-c-red flex items-start gap-1">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
