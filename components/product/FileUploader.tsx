"use client";

import { useState, useCallback } from "react";
import imageCompression from "browser-image-compression";
import { UploadCloud, FileImage, X } from "lucide-react";

interface FileUploaderProps {
  onFileChange: (file: File | null) => void;
  currentImage?: string;
}

export function FileUploader({ onFileChange, currentImage }: FileUploaderProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isCompressing, setIsCompressing] = useState(false);
  const [progressText, setProgressText] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setIsCompressing(true);
      const originalSizeMB = (file.size / 1024 / 1024).toFixed(2);
      setProgressText(`Mengompresi Gambar (${originalSizeMB} MB...`);

      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          onProgress: (p: number) => {
            setProgressText(`Mengompresi Gambar (${originalSizeMB} MB)... ${p}%`);
          }
        };
        const compressedFile = await imageCompression(file, options);

        const compressedSizeKB = (compressedFile.size / 1024).toFixed(0);
        setProgressText(`Selesai: ${originalSizeMB} MB → ${compressedSizeKB} KB`);

        setTimeout(() => setIsCompressing(false), 2000);
        setPreview(URL.createObjectURL(compressedFile));
        onFileChange(compressedFile);
      } catch (error) {
        console.error(error);
        setProgressText("Gagal mengompresi gambar");
        setTimeout(() => setIsCompressing(false), 2000);
      }
    } else {
      setPreview(URL.createObjectURL(file));
      onFileChange(file);
    }
  };

  const clearFile = () => {
    setPreview(null);
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
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
          <div className="flex flex-col items-center justify-center px-3 py-4">
            <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400 mb-2 sm:mb-3" />
            {isCompressing ? (
              <p className="font-sans text-xs sm:text-sm text-c-blue font-semibold text-center">{progressText}</p>
            ) : (
              <>
                <p className="mb-1 sm:mb-2 text-xs sm:text-sm text-neutral-500 font-sans text-center">
                  <span className="font-semibold text-c-blue">Klik untuk unggah</span> atau seret dan lepas
                </p>
                <p className="text-[10px] sm:text-xs text-neutral-400 font-sans text-center">PNG, JPG, JPEG (Maks. 5MB, Auto Compress)</p>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            disabled={isCompressing}
          />
        </label>
      )}
    </div>
  );
}
