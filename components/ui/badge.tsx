import type * as React from "react";
import { cn } from "../../lib/utils";

const BadgeVariants = {
	default: "bg-c-blue text-white",
	secondary: "bg-neutral-100 text-neutral-800",
	destructive: "bg-c-red text-white",
	outline: "border text-neutral-700",
	success: "bg-status-success/10 text-status-success border-status-success/20",
	pending: "bg-status-pending/10 text-amber-700 border-status-pending/30",
	cta: "bg-c-green text-neutral-900 border-c-green/30",
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
	variant?: keyof typeof BadgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
	return (
		<div
			className={cn(
				"inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-sans font-semibold transition-colors",
				BadgeVariants[variant],
				className,
			)}
			{...props}
		/>
	);
}

export { Badge };
