import { create } from "zustand";

export type ScanStatus = "idle" | "valid" | "used" | "invalid" | "duplicate";

export interface ScanResult {
	status: ScanStatus;
	barcode?: string;
	timestamp?: string;
	message?: string;
}

interface ScannerState {
	isScannerActive: boolean;
	lockedBy: string;
	setScannerActive: (active: boolean, device?: string) => void;
	activeTab: "camera" | "usb" | "manual";
	setActiveTab: (tab: "camera" | "usb" | "manual") => void;
	barcodeInput: string;
	setBarcodeInput: (input: string) => void;
	scanResult: ScanResult;
	setScanResult: (result: ScanResult) => void;
	resetScanner: () => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
	isScannerActive: false,
	lockedBy: "",
	setScannerActive: (active, device = "") =>
		set({ isScannerActive: active, lockedBy: active ? device : "" }),
	activeTab: "camera",
	setActiveTab: (tab) => set({ activeTab: tab }),
	barcodeInput: "",
	setBarcodeInput: (input) => set({ barcodeInput: input }),
	scanResult: { status: "idle" },
	setScanResult: (result) => set({ scanResult: result }),
	resetScanner: () =>
		set({
			activeTab: "camera",
			barcodeInput: "",
			scanResult: { status: "idle" },
		}),
}));
