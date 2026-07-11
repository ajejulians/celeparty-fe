"use client";

import { AlertTriangle } from "lucide-react";

interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-sans font-medium text-neutral-700">
        {label}
        {required && <span className="text-c-red ml-0.5">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full px-3 py-2.5 h-11 border rounded-lg bg-white font-sans text-base transition-all duration-150 placeholder:text-neutral-400 hover:border-neutral-300 focus:outline-none focus:border-c-blue focus:ring-2 focus:ring-c-blue/15 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed ${
          error
            ? "border-c-red ring-2 ring-c-red/15"
            : "border-neutral-200"
        }`}
      />
      {helperText && !error && (
        <p className="text-xs font-sans text-neutral-500">{helperText}</p>
      )}
      {error && (
        <p className="text-xs font-sans text-c-red flex items-start gap-1">
          <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
