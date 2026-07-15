"use client";

import { createContext, useContext, ReactNode, useState, useEffect, ComponentType } from "react";
import { useRouter } from "next/navigation";

export interface SessionUser {
  role: "admin" | "vendor" | "customer";
  vendorId: string;
  vendorName: string;
  storeInitials: string;
  isAuthenticated: boolean;
}

interface SessionContextType extends SessionUser {
  loaded: boolean;
  logout: () => void;
  login: (role?: "admin" | "vendor" | "customer") => void;
}

const SESSIONS: Record<string, SessionUser> = {
  admin: {
    role: "admin",
    vendorId: "",
    vendorName: "Admin Celeparty",
    storeInitials: "AC",
    isAuthenticated: true,
  },
  vendor: {
    role: "vendor",
    vendorId: "v-001",
    vendorName: "Jakarta Audio Pro",
    storeInitials: "JA",
    isAuthenticated: true,
  },
  customer: {
    role: "customer",
    vendorId: "",
    vendorName: "Customer",
    storeInitials: "CS",
    isAuthenticated: true,
  },
};

const DEFAULT_SESSION: SessionUser = {
  role: "customer",
  vendorId: "",
  vendorName: "",
  storeInitials: "",
  isAuthenticated: false,
};

const SessionContext = createContext<SessionContextType>({
  ...DEFAULT_SESSION,
  loaded: false,
  logout: () => {},
  login: (_role?: "admin" | "vendor" | "customer") => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser>(DEFAULT_SESSION);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("is_authenticated");
    const storedRole = localStorage.getItem("session_role") as "admin" | "vendor" | "customer" | null;
    const storedVendorId = localStorage.getItem("vendor_id");

    if (stored !== "false" && storedRole && storedRole in SESSIONS) {
      const template = SESSIONS[storedRole];
      setSession({
        ...template,
        vendorId: storedRole === "vendor" ? (storedVendorId ?? template.vendorId) : template.vendorId,
      });
    }
    setLoaded(true);
  }, []);

  const logout = () => {
    localStorage.setItem("is_authenticated", "false");
    localStorage.removeItem("session_role");
    localStorage.removeItem("vendor_id");
    document.cookie = "is_authenticated=false; path=/; max-age=0";
    document.cookie = "simulate_role=; path=/; max-age=0";
    document.cookie = "vendor_id=; path=/; max-age=0";
    setSession(DEFAULT_SESSION);
  };

  const login = (role?: "admin" | "vendor" | "customer") => {
    const resolvedRole = role ?? "customer";
    const template = SESSIONS[resolvedRole];

    localStorage.setItem("is_authenticated", "true");
    localStorage.setItem("session_role", resolvedRole);
    document.cookie = "is_authenticated=true; path=/; max-age=86400";
    document.cookie = `simulate_role=${resolvedRole}; path=/; max-age=86400`;

    if (resolvedRole === "vendor") {
      localStorage.setItem("vendor_id", template.vendorId);
      document.cookie = `vendor_id=${template.vendorId}; path=/; max-age=86400`;
    }

    setSession(template);
  };

  return (
    <SessionContext.Provider value={{ ...session, loaded, logout, login }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

export function withAuth<P extends Record<string, unknown>>(
  Component: ComponentType<P>,
  requiredRole?: "admin" | "vendor" | "customer"
) {
  function AuthenticatedComponent(props: P) {
    const session = useSession();
    const router = useRouter();

    if (!session.isAuthenticated) {
      router.replace("/auth/login");
      return null;
    }

    if (requiredRole && session.role !== requiredRole) {
      router.replace("/auth/login");
      return null;
    }

    return <Component {...props} />;
  }

  AuthenticatedComponent.displayName = `withAuth(${Component.displayName ?? Component.name})`;
  return AuthenticatedComponent;
}
