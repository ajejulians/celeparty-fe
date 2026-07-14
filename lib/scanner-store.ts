import { create } from "zustand";

interface ScannerState {
  isScannerActive: boolean;
  lockedBy: string;
  setScannerActive: (active: boolean, device?: string) => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
  isScannerActive: false,
  lockedBy: "",
  setScannerActive: (active, device = "") => set({ isScannerActive: active, lockedBy: active ? device : "" }),
}));
