"use client";

import { createContext, useContext, ReactNode, useState, useEffect } from "react";

export interface SessionUser {
  role: "admin" | "vendor" | "customer";
  vendorId: string;
  vendorName: string;
  storeInitials: string;
  isAuthenticated: boolean;
}

interface SessionContextType extends SessionUser {
  logout: () => void;
  login: () => void;
}

const MOCK_SESSION: SessionUser = {
  role: "vendor",
  vendorId: "v-001",
  vendorName: "Jakarta Audio Pro",
  storeInitials: "JA",
  isAuthenticated: true,
};

const SessionContext = createContext<SessionContextType>({
  ...MOCK_SESSION,
  logout: () => {},
  login: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionUser>(MOCK_SESSION);

  useEffect(() => {
    // Check if there's a stored session state
    const stored = localStorage.getItem("is_authenticated");
    const storedRole = localStorage.getItem("session_role");
    
    setSession(prev => ({
      ...prev,
      isAuthenticated: stored !== "false",
      role: (storedRole as any) || MOCK_SESSION.role
    }));
  }, []);

  const logout = () => {
    localStorage.setItem("is_authenticated", "false");
    document.cookie = "is_authenticated=false; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "simulate_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    setSession(prev => ({ ...prev, isAuthenticated: false }));
  };

  const login = (role?: "admin" | "vendor" | "customer") => {
    localStorage.setItem("is_authenticated", "true");
    document.cookie = "is_authenticated=true; path=/; max-age=86400";
    if (role) {
      localStorage.setItem("session_role", role);
      document.cookie = `simulate_role=${role}; path=/; max-age=86400`;
      setSession(prev => ({ ...prev, isAuthenticated: true, role }));
    } else {
      setSession(prev => ({ ...prev, isAuthenticated: true }));
    }
  };

  return (
    <SessionContext.Provider value={{ ...session, logout, login }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}
