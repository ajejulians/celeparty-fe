import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATHS = ["/user/admin"];
const VENDOR_PATHS = ["/user/vendor"];
const PROTECTED_PATHS = [...ADMIN_PATHS, ...VENDOR_PATHS];

const MOCK_SESSION = {
  role: "vendor" as "admin" | "vendor" | "customer",
  vendorId: "v-001",
  vendorName: "Jakarta Audio Pro",
  storeInitials: "JA",
  isAuthenticated: true,
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // For testing purposes, get role from cookie or fallback to vendor
  const roleCookie = request.cookies.get("simulate_role")?.value;
  const role = (roleCookie as "admin" | "vendor" | "customer") || "vendor";

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  const isAuthenticatedCookie = request.cookies.get("is_authenticated")?.value;
  const isAuthenticated = isAuthenticatedCookie === "true";

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isVendorPath = VENDOR_PATHS.some((p) => pathname.startsWith(p));

  if (isAdminPath && role !== "admin") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isVendorPath && role !== "vendor") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-vendor-id", MOCK_SESSION.vendorId);
  response.headers.set("x-user-role", role);
  return response;
}

export const config = {
  matcher: ["/user/:path*"],
};
