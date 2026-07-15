"use client";

import { useState, useCallback, useRef } from "react";
import imageCompression from "browser-image-compression";
import { UploadCloud, X, AlertTriangle } from "lucide-react";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
  currentImage?: string;
}

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export function FileUploader({ onFileChange, currentImage }: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progressText, setProgressText] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [warning, setWarning] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(async (file: File) => {
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
            setProgressText(`Mengompresi Gambar (${originalSizeMB} MB)... ${p}%`);
          },
        };
        const compressedFile = await imageCompression(file, options);
        const compressedSizeKB = (compressedFile.size / 1024).toFixed(0);
        setProgressText(`Selesai: ${originalSizeMB} MB → ${compressedSizeKB} KB`);

        const img = new Image();
        img.onload = () => {
          const ratio = img.width / img.height;
          if (ratio < 0.8 || ratio > 2.0) {
            setWarning("Rasio gambar disarankan antara 4:5 hingga 2:1 untuk tampilan optimal.");
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
          setWarning("Rasio gambar disarankan antara 4:5 hingga 2:1 untuk tampilan optimal.");
        }
      };
      img.src = URL.createObjectURL(file);
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    }
  }, [onFileChange]);

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
      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-neutral-200 group aspect-video w-full">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={clearFile}
              className="bg-c-red text-white p-2 rounded-full hover:bg-c-red/90 transition-colors"
              aria-label="Hapus gambar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragOver
              ? "border-c-blue bg-c-blue-50"
              : "border-neutral-300 bg-neutral-50 hover:bg-neutral-100"
          }`}
        >
          <div className="flex flex-col items-center justify-center px-3 py-4">
            <UploadCloud className={`w-8 h-8 sm:w-10 sm:h-10 mb-2 sm:mb-3 ${isDragOver ? "text-c-blue" : "text-neutral-400"}`} />
            {isCompressing ? (
              <p className="font-sans text-xs sm:text-sm text-c-blue font-semibold text-center">{progressText}</p>
            ) : (
              <>
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-neutral-500 font-sans text-center">
                  <span className="font-semibold text-c-blue">Klik untuk unggah</span> atau seret dan lepas
                </p>
                <p className="text-[10px] sm:text-xs text-neutral-400 font-sans text-center">PNG, JPG, JPEG (Maks. {MAX_SIZE_MB}MB, Auto Compress)</p>
              </>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={ACCEPTED_TYPES.join(",")}
            onChange={handleFileChange}
            disabled={isCompressing}
          />
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
