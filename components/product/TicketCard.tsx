import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/data";
import { cn } from "@/lib/utils";

const STATUS_MAP: Record<string, { label: string; className: string }> = {
	active: {
		label: "Aktif",
		className:
			"bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200",
	},
	sold_out: {
		label: "Habis",
		className: "bg-rose-100 text-rose-800 hover:bg-rose-100 border-rose-200",
	},
	escrow_badge: {
		label: "Escrow",
		className:
			"bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200",
	},
};

interface TicketCardProps {
	product: Product;
	variant?: "catalog" | "compact" | "landing";
	className?: string;
	priority?: boolean;
}

function PriceDisplay({
	amount,
	compact,
}: {
	amount: number;
	compact?: boolean;
}) {
	return (
		<div className="flex items-baseline gap-0.5">
			<span
				className={cn(
					"font-quick font-semibold text-neutral-500",
					compact ? "text-[11px]" : "text-xs",
				)}
			>
				Rp
			</span>
			<span
				className={cn(
					"font-quick font-bold text-c-blue",
					compact ? "text-sm" : "text-lg",
				)}
			>
				{amount.toLocaleString("id-ID")}
			</span>
			{!compact && (
				<span className="text-xs font-sans text-neutral-500 ml-1">
					&middot; mulai dari
				</span>
			)}
		</div>
	);
}

export function TicketCard({
	product,
	variant = "catalog",
	className,
	priority = false,
}: TicketCardProps) {
	const isCompact = variant === "compact";
	const isLanding = variant === "landing";

	return (
		<Link
			href={`/products/${product.slug}`}
			className={cn(
				"group bg-white rounded-xl shadow-card border border-neutral-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-c-blue-100/30 hover:-translate-y-1 cursor-pointer block",
				className,
			)}
		>
			<div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
				{product.imageUrl ? (
					<Image
						src={product.imageUrl}
						alt={product.name}
						fill
						priority={priority}
						className="object-cover group-hover:scale-105 transition-transform duration-500"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
					/>
				) : null}
				<div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
				<div className="absolute top-3 left-3 flex flex-col gap-2">
					{STATUS_MAP[product.status] && (
						<Badge className={STATUS_MAP[product.status].className}>
							{STATUS_MAP[product.status].label}
						</Badge>
					)}
				</div>
				<div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
					<span className="text-c-orange text-xs">⭐</span>
					<span className="font-quick font-bold text-xs text-neutral-800">
						4.9
					</span>
					<span className="w-0.5 h-3 bg-neutral-300 mx-0.5" />
					<span className="font-sans text-[10px] text-neutral-600 font-medium">
						Terjual 40+
					</span>
				</div>
			</div>

			<div className={cn("p-4 space-y-2", isCompact && "p-3 space-y-1.5")}>
				<div className="flex items-center gap-1 text-neutral-500 mb-1 flex-wrap">
					<span
						className={cn("font-sans", isCompact ? "text-[11px]" : "text-xs")}
					>
						{product.category}
					</span>
					<span className="text-neutral-300">&middot;</span>
					<span
						className={cn("font-sans", isCompact ? "text-[11px]" : "text-xs")}
					>
						{product.city}
					</span>
				</div>

				<h3
					className={cn(
						"font-quick font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-c-blue transition-colors",
						isCompact ? "text-sm" : "text-base",
					)}
				>
					{product.name}
				</h3>

				<div className="flex items-center justify-between">
					<PriceDisplay amount={product.priceFrom} compact={isCompact} />
				</div>

				{!isLanding && (
					<div className="pt-1">
						<Button
							variant="default"
							size={isCompact ? "sm" : "default"}
							className={cn(
								"w-full bg-purple-600 hover:bg-purple-700 text-white",
								isCompact && "h-8 text-xs",
							)}
						>
							Lihat Detail
						</Button>
					</div>
				)}

				{isLanding && (
					<Button
						variant="default"
						size="sm"
						className="w-full bg-purple-600 hover:bg-purple-700 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 mt-2"
					>
						Detail
					</Button>
				)}
			</div>
		</Link>
	);
}
