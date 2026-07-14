"use client";

import { useEffect, useRef } from "react";
import { useScannerStore } from "@/lib/scanner-store";

export function useScannerHeartbeat(deviceId: string, intervalMs = 10_000) {
  const setScannerActive = useScannerStore((s) => s.setScannerActive);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setScannerActive(true, deviceId);
    // ponytail: ping interval for session lock; replace with fetch('/api/scanner/heartbeat') when API exists
    intervalRef.current = setInterval(() => {
      console.log(`[scanner heartbeat] ${deviceId}`);
    }, intervalMs);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setScannerActive(false);
  };

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  return { start, stop };
}
