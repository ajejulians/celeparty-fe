import { Product } from "../../lib/data";
import { TicketCard } from "../product/TicketCard";

interface RelatedProductCardProps {
  product: Product;
}

export function RelatedProductCard({ product }: RelatedProductCardProps) {
  return <TicketCard product={product} variant="compact" />;
}
