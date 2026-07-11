"use client";

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
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-3">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ""}
            disabled={disabled}
            onChange={(e) => {
              const newVal = value.split("");
              newVal[i] = e.target.value.replace(/\D/g, "");
              onChange(newVal.join(""));
              if (e.target.value && i < length - 1) {
                const next = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                next?.focus();
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Backspace" && !value[i] && i > 0) {
                const prev = e.currentTarget.parentElement?.children[i - 1] as HTMLInputElement;
                prev?.focus();
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
