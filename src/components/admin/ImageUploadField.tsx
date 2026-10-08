"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Loader2, Check, AlertCircle } from "lucide-react";

interface ImageUploadFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

export default function ImageUploadField({
  label = "Image Path *",
  value,
  onChange,
  required = false,
  placeholder = "/uploads/2025/03/200.png",
  className = "",
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMessage(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error("Upload error:", err);
      setErrorMessage(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
      // Reset input value so same file can be re-selected if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-300 uppercase">
          {label}
        </label>
        {uploadSuccess && (
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <Check className="w-3.5 h-3.5" /> Uploaded successfully!
          </span>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
        {/* URL Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            required={required}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`file-upload-${label.replace(/\s+/g, "-")}`}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm shadow-emerald-950/50 cursor-pointer whitespace-nowrap"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Image</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error notification */}
      {errorMessage && (
        <div className="text-[11px] text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Thumbnail Preview */}
      {value && (
        <div className="flex items-center gap-3 p-2 bg-slate-900/60 border border-slate-800 rounded-xl mt-2">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-slate-800 border border-slate-700 flex-shrink-0">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized={value.startsWith("http") || value.startsWith("/uploads")}
              onError={(e) => {
                // Hide or fallback if invalid URL
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-medium text-slate-300 truncate">
              {value.split("/").pop() || value}
            </p>
            <p className="text-[10px] text-slate-500 truncate">Active image reference</p>
          </div>
        </div>
      )}
    </div>
  );
}
