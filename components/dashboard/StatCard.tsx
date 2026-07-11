import { cn } from "../../lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  variant?: "blue" | "green" | "amber" | "red";
  trend?: { direction: "up" | "down"; value: string };
  className?: string;
}

const variantStyles = {
  blue: {
    bg: "bg-c-blue-50",
    iconBg: "bg-c-blue/10 text-c-blue",
    trend: "text-status-success",
  },
  green: {
    bg: "bg-emerald-50",
    iconBg: "bg-emerald-500/10 text-emerald-600",
    trend: "text-status-success",
  },
  amber: {
    bg: "bg-amber-50",
    iconBg: "bg-amber-500/10 text-amber-600",
    trend: "text-amber-600",
  },
  red: {
    bg: "bg-red-50",
    iconBg: "bg-red-500/10 text-red-600",
    trend: "text-c-red",
  },
};

export function StatCard({
  label,
  value,
  icon,
  variant = "blue",
  trend,
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-neutral-200 p-4 hover:shadow-card transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-sans font-medium text-neutral-500 uppercase tracking-wide">
            {label}
          </p>
          <p className="font-quick font-bold text-2xl text-neutral-900">
            {value}
          </p>
          {trend && (
            <p
              className={cn(
                "text-xs font-sans font-medium flex items-center gap-1",
                trend.direction === "up" ? styles.trend : "text-c-red"
              )}
            >
              <span>{trend.direction === "up" ? "\u2191" : "\u2193"}</span>
              {trend.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            styles.iconBg
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
