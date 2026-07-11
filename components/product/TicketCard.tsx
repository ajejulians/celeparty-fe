import Link from "next/link";
import Image from "next/image";
import { Product } from "../../lib/data";
import { formatCurrency, formatDate } from "../../lib/utils";
import { StatusBadge } from "../feedback/StatusBadge";
import { cn } from "../../lib/utils";

interface TicketCardProps {
  product: Product;
  variant?: "catalog" | "compact" | "landing";
  className?: string;
}

export function TicketCard({
  product,
  variant = "catalog",
  className,
}: TicketCardProps) {
  const isCompact = variant === "compact";
  const isLanding = variant === "landing";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group bg-white rounded-lg shadow-card border border-neutral-100 overflow-hidden transition-all duration-200 hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer block",
        className
      )}
    >
      <div className="relative aspect-[4/3] bg-neutral-100 overflow-hidden">
        <Image 
          src={product.imageUrl} 
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 left-2">
          <StatusBadge status={product.status} />
        </div>
      </div>

      <div className={cn(isCompact ? "p-3" : "p-4")}>
        <p
          className={cn(
            "text-neutral-500 mb-1",
            isCompact ? "text-[10px] font-sans" : "text-xs font-sans"
          )}
        >
          {product.category} &middot; {product.city}
        </p>
        <h3
          className={cn(
            "font-quick font-semibold text-neutral-900 leading-snug line-clamp-2 group-hover:text-c-blue transition-colors",
            isCompact ? "text-sm" : "text-base"
          )}
        >
          {product.name}
        </h3>

        {!isLanding && (
          <p className="text-xs font-sans text-neutral-500 mt-1.5">
            &#x1F4C5; {formatDate(product.date)}
          </p>
        )}

        {isCompact ? (
          <div className="mt-2 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-500">Mulai dari</p>
              <p className="font-quick font-bold text-base text-c-blue">
                {formatCurrency(product.priceFrom)}
              </p>
            </div>
            <span className="font-quick font-semibold text-xs text-neutral-500 group-hover:text-c-blue transition-colors">
              Lihat &rarr;
            </span>
          </div>
        ) : (
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500">Mulai dari</p>
              <p className="font-quick font-bold text-lg text-c-blue">
                {formatCurrency(product.priceFrom)}
              </p>
            </div>
            <span className="bg-c-green text-neutral-900 font-quick font-semibold text-sm px-4 py-2 rounded-lg hover:brightness-95 active:scale-[0.98] transition-all min-h-[44px] inline-flex items-center">
              Lihat
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
