"use client";

import { createContext, useContext, ReactNode } from "react";

export interface SessionUser {
  role: "admin" | "vendor" | "customer";
  vendorId: string;
  vendorName: string;
  storeInitials: string;
  isAuthenticated: boolean;
}

const MOCK_SESSION: SessionUser = {
  role: "vendor",
  vendorId: "v-001",
  vendorName: "Jakarta Audio Pro",
  storeInitials: "JA",
  isAuthenticated: true,
};

const SessionContext = createContext<SessionUser>(MOCK_SESSION);

export function SessionProvider({ children }: { children: ReactNode }) {
  return (
    <SessionContext.Provider value={MOCK_SESSION}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionUser {
  return useContext(SessionContext);
}
