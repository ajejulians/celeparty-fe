"use client";

import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import {
	AlertTriangle,
	CheckCircle2,
	Keyboard,
	QrCode,
	Scan,
	XCircle,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useScannerStore } from "@/lib/scanner-store";
import { formatDate } from "@/lib/utils";

export function TicketScan() {
	const {
		activeTab,
		setActiveTab,
		barcodeInput,
		setBarcodeInput,
		scanResult,
		setScanResult,
	} = useScannerStore();

	const videoRef = useRef<HTMLVideoElement>(null);
	const usbInputRef = useRef<HTMLInputElement>(null);
	const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

	const processBarcode = (barcode: string) => {
		// Simulate backend verification
		const len = barcode.length;
		if (len < 5) {
			setScanResult({
				status: "invalid",
				message: "Barcode tidak valid atau tidak ditemukan.",
			});
		} else if (len % 2 === 0) {
			setScanResult({
				status: "used",
				barcode,
				timestamp: new Date().toISOString(),
				message: "Tiket sudah digunakan sebelumnya.",
			});
		} else {
			setScanResult({
				status: "valid",
				barcode,
				message: "Tiket valid. Akses diizinkan.",
			});
		}

		// Auto reset result after 3 seconds for quick scanning in USB/Camera mode
		if (activeTab !== "manual") {
			setTimeout(() => setScanResult({ status: "idle" }), 3000);
		}
	};

	// Camera Logic
	useEffect(() => {
		if (activeTab === "camera") {
			codeReaderRef.current = new BrowserMultiFormatReader();
			codeReaderRef.current
				.decodeFromVideoDevice(null, videoRef.current!, (res, err) => {
					if (res) {
						processBarcode(res.getText());
					}
					if (err && !(err instanceof NotFoundException)) {
						console.error(err);
					}
				})
				.catch((err) => console.error(err));
		} else {
			if (codeReaderRef.current) {
				codeReaderRef.current.reset();
			}
		}

		return () => {
			if (codeReaderRef.current) {
				codeReaderRef.current.reset();
			}
		};
	}, [activeTab, processBarcode]);

	// USB Scanner Auto-Focus Logic
	useEffect(() => {
		if (activeTab === "usb") {
			usbInputRef.current?.focus();
			const handleGlobalClick = () => {
				if (activeTab === "usb") usbInputRef.current?.focus();
			};
			window.addEventListener("click", handleGlobalClick);
			return () => window.removeEventListener("click", handleGlobalClick);
		}
	}, [activeTab]);

	const handleUsbSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (barcodeInput.trim()) {
			processBarcode(barcodeInput);
			setBarcodeInput(""); // Clear for next scan
		}
	};

	const handleManualSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (barcodeInput.trim()) {
			processBarcode(barcodeInput);
		}
	};

	return (
		<div className="space-y-6">
			{/* Tab Selector */}
			<div className="flex bg-neutral-100 p-1 rounded-xl">
				<button
					onClick={() => setActiveTab("camera")}
					className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-quick font-semibold text-sm transition-all min-h-[48px] ${
						activeTab === "camera"
							? "bg-white text-c-blue shadow-sm"
							: "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
					}`}
				>
					<QrCode className="w-4 h-4" /> Kamera
				</button>
				<button
					onClick={() => setActiveTab("usb")}
					className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-quick font-semibold text-sm transition-all min-h-[48px] ${
						activeTab === "usb"
							? "bg-white text-c-blue shadow-sm"
							: "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
					}`}
				>
					<Scan className="w-4 h-4" /> USB Scanner
				</button>
				<button
					onClick={() => setActiveTab("manual")}
					className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-quick font-semibold text-sm transition-all min-h-[48px] ${
						activeTab === "manual"
							? "bg-white text-c-blue shadow-sm"
							: "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/50"
					}`}
				>
					<Keyboard className="w-4 h-4" /> Manual
				</button>
			</div>

			{/* Scanner Area */}
			<Card className="overflow-hidden border-neutral-200">
				<CardContent className="p-6">
					{activeTab === "camera" && (
						<div className="space-y-4">
							<div className="aspect-video bg-neutral-900 rounded-lg overflow-hidden relative">
								<video ref={videoRef} className="w-full h-full object-cover" />
								<div className="absolute inset-0 pointer-events-none border-[4px] border-c-blue/30 m-8 rounded-2xl" />
							</div>
							<p className="text-center font-sans text-sm text-neutral-500">
								Arahkan barcode tiket ke kamera
							</p>
						</div>
					)}

					{activeTab === "usb" && (
						<div className="py-12 space-y-6 text-center">
							<div className="w-20 h-20 bg-c-blue-50 rounded-full flex items-center justify-center mx-auto">
								<Scan className="w-10 h-10 text-c-blue animate-pulse" />
							</div>
							<div>
								<h3 className="font-quick font-bold text-lg text-neutral-900">
									Menunggu Scanner...
								</h3>
								<p className="font-sans text-sm text-neutral-500 mt-2">
									Pastikan scanner USB terhubung. Gunakan scanner untuk memindai
									barcode.
								</p>
							</div>
							<form
								onSubmit={handleUsbSubmit}
								className="opacity-0 w-0 h-0 overflow-hidden"
							>
								<input
									ref={usbInputRef}
									value={barcodeInput}
									onChange={(e) => setBarcodeInput(e.target.value)}
								/>
							</form>
						</div>
					)}

					{activeTab === "manual" && (
						<form onSubmit={handleManualSubmit} className="space-y-4 py-8">
							<div className="space-y-2">
								<label className="font-sans text-sm font-medium text-neutral-700">
									Masukkan Kode Barcode (17 digit)
								</label>
								<Input
									value={barcodeInput}
									onChange={(e) => setBarcodeInput(e.target.value)}
									placeholder="Contoh: 12345678901234567"
									className="font-mono text-base h-12"
								/>
							</div>
							<Button
								type="submit"
								className="w-full bg-c-blue text-white font-quick font-semibold h-12"
							>
								Verifikasi Tiket
							</Button>
						</form>
					)}
				</CardContent>
			</Card>

			{/* Result Cards */}
			{scanResult.status === "valid" && (
				<div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-4 items-start animate-fade-in motion-reduce:animate-none">
					<div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
						<CheckCircle2 className="w-6 h-6 text-emerald-600" />
					</div>
					<div>
						<h4 className="font-quick font-bold text-emerald-800 text-lg">
							Akses Diizinkan
						</h4>
						<p className="font-sans text-emerald-700 text-sm mt-1">
							{scanResult.message}
						</p>
						{scanResult.barcode && (
							<p className="font-mono text-xs text-emerald-600 mt-2 opacity-80">
								Barcode: {scanResult.barcode}
							</p>
						)}
					</div>
				</div>
			)}

			{scanResult.status === "used" && (
				<div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 items-start animate-fade-in motion-reduce:animate-none">
					<div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
						<AlertTriangle className="w-6 h-6 text-amber-600" />
					</div>
					<div>
						<h4 className="font-quick font-bold text-amber-800 text-lg">
							Tiket Sudah Digunakan
						</h4>
						<p className="font-sans text-amber-700 text-sm mt-1">
							{scanResult.message}
						</p>
						{scanResult.timestamp && (
							<p className="font-sans text-xs text-amber-600 mt-2">
								Waktu Scan Pertama: {formatDate(scanResult.timestamp)}
							</p>
						)}
					</div>
				</div>
			)}

			{scanResult.status === "invalid" && (
				<div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-4 items-start animate-fade-in motion-reduce:animate-none">
					<div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
						<XCircle className="w-6 h-6 text-c-red" />
					</div>
					<div>
						<h4 className="font-quick font-bold text-red-800 text-lg">
							Akses Ditolak
						</h4>
						<p className="font-sans text-red-700 text-sm mt-1">
							{scanResult.message}
						</p>
					</div>
				</div>
			)}
		</div>
	);
}
