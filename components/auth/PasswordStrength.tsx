"use client";

interface PasswordStrengthProps {
  password: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const labels = ["Sangat Lemah", "Lemah", "Cukup", "Kuat"];
  const colors = ["bg-c-red", "bg-c-orange", "bg-status-pending", "bg-status-success"];
  const widths = ["w-1/4", "w-2/4", "w-3/4", "w-full"];
  const textColors = ["text-c-red", "text-c-orange", "text-status-pending", "text-status-success"];

  const idx = Math.max(0, strength - 1);

  return (
    <div className="mt-2 space-y-1">
      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div className={`h-full ${widths[idx]} ${colors[idx]} rounded-full transition-all duration-300`} />
      </div>
      <p className={`text-xs font-sans font-medium ${textColors[idx]}`}>
        {labels[idx]}
      </p>
    </div>
  );
}
