"use client";

import imageCompression from "browser-image-compression";
import { AlertTriangle, Camera, UploadCloud, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface FileUploaderProps {
	onFileChange: (file: File | null) => void;
	currentImage?: string;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export function FileUploader({
	onFileChange,
	currentImage,
}: FileUploaderProps) {
	const [preview, setPreview] = useState<string | null>(currentImage || null);
	const [isCompressing, setIsCompressing] = useState(false);
	const [progressText, setProgressText] = useState("");
	const [isDragOver, setIsDragOver] = useState(false);
	const [warning, setWarning] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	const processFile = useCallback(
		async (file: File) => {
			setWarning("");

			if (!ACCEPTED_TYPES.includes(file.type)) {
				setWarning("Format tidak didukung. Gunakan PNG, JPG, atau JPEG.");
				return;
			}

			if (file.size > MAX_SIZE_MB * 1024 * 1024) {
				setWarning(`Ukuran file maksimal ${MAX_SIZE_MB}MB.`);
				return;
			}

			if (file.size > 1024 * 1024) {
				setIsCompressing(true);
				const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
				setProgressText(`Mengompresi Gambar (${originalSizeMB} MB)...`);

				try {
					const options = {
						maxSizeMB: 1,
						maxWidthOrHeight: 1920,
						useWebWorker: true,
						onProgress: (p: number) => {
							setProgressText(
								`Mengompresi Gambar (${originalSizeMB} MB)... ${p}%`,
							);
						},
					};
					const compressedFile = await imageCompression(file, options);
					const compressedSizeKB = (compressedFile.size / 1024).toFixed(0);
					setProgressText(
						`Selesai: ${originalSizeMB} MB → ${compressedSizeKB} KB`,
					);

					const img = new Image();
					img.onload = () => {
						const ratio = img.width / img.height;
						if (ratio < 0.8 || ratio > 2.0) {
							setWarning(
								"Rasio gambar disarankan antara 4:5 hingga 2:1 untuk tampilan optimal.",
							);
						}
					};
					img.src = URL.createObjectURL(compressedFile);

					setTimeout(() => setIsCompressing(false), 2000);
					setPreview(URL.createObjectURL(compressedFile));
					onFileChange(compressedFile);
				} catch {
					setProgressText("Gagal mengompresi gambar");
					setTimeout(() => setIsCompressing(false), 2000);
				}
			} else {
				const img = new Image();
				img.onload = () => {
					const ratio = img.width / img.height;
					if (ratio < 0.8 || ratio > 2.0) {
						setWarning(
							"Rasio gambar disarankan antara 4:5 hingga 2:1 untuk tampilan optimal.",
						);
					}
				};
				img.src = URL.createObjectURL(file);
				setPreview(URL.createObjectURL(file));
				onFileChange(file);
			}
		},
		[onFileChange],
	);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		processFile(file);
	};

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);
	};

	const handleDrop = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragOver(false);

		const file = e.dataTransfer.files?.[0];
		if (!file) return;
		processFile(file);
	};

	const clearFile = () => {
		setPreview(null);
		setWarning("");
		onFileChange(null);
	};

	return (
		<div className="w-full">
			<input
				ref={inputRef}
				type="file"
				className="hidden"
				accept={ACCEPTED_TYPES.join(",")}
				onChange={handleFileChange}
				disabled={isCompressing}
			/>

			{preview ? (
				<div
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={`relative rounded-lg overflow-hidden border aspect-video w-full shadow-sm bg-neutral-100 transition-colors ${
						isDragOver
							? "border-c-blue ring-2 ring-c-blue/15"
							: "border-neutral-200"
					}`}
				>
					<img
						src={preview}
						alt="Preview"
						className="w-full h-full object-cover"
					/>

					{/* Subtle outline for image depth */}
					<div className="absolute inset-0 ring-1 ring-black/10 rounded-lg pointer-events-none" />

					{/* Interactive Change Photo trigger */}
					<button
						type="button"
						onClick={() => inputRef.current?.click()}
						className="absolute inset-0 w-full h-full bg-black/50 opacity-0 hover:opacity-100 focus:opacity-100 focus:outline-none transition-opacity flex flex-col items-center justify-center gap-2 text-white cursor-pointer group focus:ring-2 focus:ring-c-blue/80"
					>
						<Camera className="w-6 h-6 transition-transform group-hover:scale-110 group-focus:scale-110 duration-200" />
						<span className="font-sans text-xs font-semibold">Ubah Foto</span>
					</button>

					{/* Delete Button */}
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation();
							clearFile();
						}}
						className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-neutral-700 hover:text-c-red p-1.5 rounded-full shadow-md transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-c-red focus:ring-offset-1"
						aria-label="Hapus gambar"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			) : (
				<label
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onDrop={handleDrop}
					className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer transition-colors focus-within:border-c-blue focus-within:ring-2 focus-within:ring-c-blue/15 ${
						isDragOver
							? "border-c-blue bg-c-blue-50"
							: "border-neutral-300 bg-neutral-50 hover:bg-neutral-100"
					}`}
				>
					<div className="flex flex-col items-center justify-center px-3 py-4">
						<UploadCloud
							className={`w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 ${isDragOver ? "text-c-blue" : "text-neutral-400"}`}
						/>
						{isCompressing ? (
							<p className="font-sans text-xs sm:text-sm text-c-blue font-semibold text-center">
								{progressText}
							</p>
						) : (
							<>
								<p className="mb-1 sm:mb-2 text-xs sm:text-sm text-neutral-500 font-sans text-center">
									<span className="font-semibold text-c-blue">
										Klik untuk unggah
									</span>{" "}
									atau seret dan lepas
								</p>
								<p className="text-[10px] sm:text-xs text-neutral-400 font-sans text-center">
									PNG, JPG, JPEG (Maks. {MAX_SIZE_MB}MB, Auto Compress)
								</p>
							</>
						)}
					</div>
				</label>
			)}

			{warning && (
				<div className="flex items-start gap-2 mt-2 p-2 rounded-md bg-amber-50 border border-amber-200">
					<AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
					<p className="text-xs font-sans text-amber-700">{warning}</p>
				</div>
			)}
		</div>
	);
}
