import { products, events, Order } from "./data";

export interface Recipient {
  name: string;
  email: string;
  whatsapp: string;
  identityType: "KTP" | "SIM" | "Paspor";
  identityNumber: string;
}

export interface CheckoutParams {
  productSlug: string;
  variantIndex: number;
  qty: number;
}

export interface PaymentLink {
  code: string;
  productSlug: string;
  variantIndex: number;
  amount: number;
  type: "dp" | "remaining" | "full";
  validUntil: string;
  orderId: string;
}

const mockOrders: Map<string, Order> = new Map();
const mockPaymentLinks: Map<string, PaymentLink> = new Map();

export function getProductBySlug(slug: string) {
  const product = products.find((p) => p.slug === slug);
  if (product) return product;
  
  const event = events.find((e) => e.slug === slug);
  if (event) {
    return {
      slug: event.slug,
      name: event.title,
      category: event.category,
      city: event.location,
      date: event.date,
      imageUrl: event.imageUrl,
      priceFrom: event.priceFrom,
      status: "active" as const,
      variants: [{ name: "Reguler", price: event.priceFrom }, { name: "VIP", price: event.priceFrom * 2 }],
      description: event.description,
      vendorName: event.organizer,
    };
  }
  return null;
}

export function generateOrderId(dateStr: string): string {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const n = String(mockOrders.size + 1).padStart(3, "0");
  return `INV-${y}${m}${d}-${n}`;
}

export function generateBarcode(dateStr: string): string {
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const hex = Array.from({ length: 8 }, () =>
    "0123456789ABCDEF"[Math.floor(Math.random() * 16)]
  ).join("");
  return `CTix-${y}${m}${d}-${hex}`;
}

export function createOrder(
  productSlug: string,
  variantIndex: number,
  qty: number,
  recipients: Recipient[]
): Order | null {
  const product = getProductBySlug(productSlug);
  if (!product) return null;

  const variant = product.variants[variantIndex];
  if (!variant) return null;

  const order: Order = {
    id: `ord-${Date.now()}`,
    orderId: generateOrderId(product.date),
    barcode: generateBarcode(product.date),
    customer: recipients[0]?.name ?? "Customer",
    product: product.name,
    productSlug,
    variant: variant.name,
    qty,
    total: variant.price * qty,
    paymentStatus: "pending",
    orderDate: new Date().toISOString().split("T")[0],
    eventDate: product.date,
    vendorStatus: "pending",
    vendorName: product.vendorName,
  };

  mockOrders.set(order.orderId, order);
  return order;
}

export function getOrderById(orderId: string): Order | null {
  return mockOrders.get(orderId) ?? null;
}

export function createPaymentLink(orderId: string, productSlug: string, variantIndex: number): PaymentLink | null {
  const product = getProductBySlug(productSlug);
  if (!product) return null;

  const variant = product.variants[variantIndex];
  if (!variant) return null;

  const isEscrow = product.status === "escrow_badge";
  const dp = Math.ceil(variant.price * 0.3);
  const remaining = Math.floor(variant.price * 0.7);

  const code = `PAY-${Date.now().toString(36).toUpperCase()}`;

  const links: PaymentLink[] = [];

  if (isEscrow) {
    const dpLink: PaymentLink = {
      code: `${code}-DP`,
      productSlug,
      variantIndex,
      amount: dp,
      type: "dp",
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      orderId,
    };
    mockPaymentLinks.set(dpLink.code, dpLink);
    links.push(dpLink);
    const remainingLink: PaymentLink = {
      code: `${code}-RM`,
      productSlug,
      variantIndex,
      amount: remaining,
      type: "remaining",
      validUntil: new Date(product.date).toISOString(),
      orderId,
    };
    mockPaymentLinks.set(remainingLink.code, remainingLink);
    links.push(remainingLink);
  } else {
    const fullLink: PaymentLink = {
      code,
      productSlug,
      variantIndex,
      amount: variant.price,
      type: "full",
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      orderId,
    };
    mockPaymentLinks.set(fullLink.code, fullLink);
    links.push(fullLink);
  }

  return links[0] ?? null;
}

export function getPaymentLinkByCode(code: string): PaymentLink | null {
  return mockPaymentLinks.get(code) ?? null;
}
