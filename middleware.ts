import { NextRequest, NextResponse } from "next/server";

const ADMIN_PATHS = ["/user/admin"];
const VENDOR_PATHS = ["/user/vendor"];
const PROTECTED_PATHS = [...ADMIN_PATHS, ...VENDOR_PATHS];

interface SessionHeaders {
  "x-user-role": "admin" | "vendor" | "customer";
  "x-vendor-id": string;
  "x-is-authenticated": "true" | "false";
}

function getRole(allowedRoles: string[], raw?: string): "admin" | "vendor" | "customer" {
  if (raw && allowedRoles.includes(raw)) return raw as "admin" | "vendor" | "customer";
  return "customer";
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  if (!isProtected) {
    const response = NextResponse.next();
    response.headers.set("x-is-authenticated", "false");
    response.headers.set("x-user-role", "customer");
    return response;
  }

  const isAuthenticatedCookie = request.cookies.get("is_authenticated")?.value;
  const isAuthenticated = isAuthenticatedCookie === "true";

  if (!isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const roleCookie = request.cookies.get("simulate_role")?.value;
  const vendorIdCookie = request.cookies.get("vendor_id")?.value;
  const role = getRole(["admin", "vendor", "customer"], roleCookie);

  const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
  const isVendorPath = VENDOR_PATHS.some((p) => pathname.startsWith(p));

  if (isAdminPath && role !== "admin") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isVendorPath && role !== "vendor") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const response = NextResponse.next();
  const vendorId = vendorIdCookie ?? "";
  response.headers.set("x-user-role", role);
  response.headers.set("x-vendor-id", vendorId);
  response.headers.set("x-is-authenticated", "true");
  return response;
}

export const config = {
  matcher: ["/user/:path*"],
};
