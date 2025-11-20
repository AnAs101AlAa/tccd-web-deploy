import React, { useRef, useState } from "react";
import { FiUpload, FiX } from "react-icons/fi";

interface FileUploadFieldProps {
  id: string;
  label: string;
  value: File | string;
  onChange: (file: File | null) => void;
  error?: string;
  accept?: string;
  preview?: string;
  maxSize?: number; // in bytes
  acceptedFormats?: string; // display text
  showPreview?: boolean;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  id,
  label,
  value,
  onChange,
  error,
  accept = "image/*",
  preview,
  maxSize = 5,
  acceptedFormats = "PNG, JPG, WEBP or GIF",
  showPreview = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileName = (): string => {
    if (value instanceof File) {
      return value.name;
    }
    if (typeof value === "string" && value) {
      const urlParts = value.split("/");
      return urlParts[urlParts.length - 1] || "Existing file";
    }
    return "";
  };

  const getPreviewUrl = (): string | undefined => {
    if (preview) return preview;
    if (value instanceof File) {
      return URL.createObjectURL(value);
    }
    if (typeof value === "string" && value) {
      return value;
    }
    return undefined;
  };

  const previewUrl = getPreviewUrl();
  const fileName = getFileName();
  const isImage = accept.includes("image");

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-contrast">
        {label}
      </label>

      <div
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
          dragActive
            ? "border-primary bg-primary/5"
            : error
            ? "border-red-500 bg-red-50"
            : "border-gray-300 hover:border-primary"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          id={id}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {previewUrl && showPreview && isImage ? (
          <div className="flex items-center gap-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-contrast truncate">
                {fileName}
              </p>
              <p className="text-xs text-label mt-1">
                {value instanceof File
                  ? `${(value.size / 1024 / 1024).toFixed(2)} MB`
                  : "Current file"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              aria-label="Clear file"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        ) : value ? (
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <FiUpload className="w-8 h-8 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-contrast truncate">
                {fileName}
              </p>
              <p className="text-xs text-label mt-1">
                {value instanceof File
                  ? `${(value.size / 1024 / 1024).toFixed(2)} MB`
                  : "Current file"}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              aria-label="Clear file"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex flex-col items-center gap-2 py-4 text-center hover:opacity-70 transition-opacity"
          >
            <FiUpload className="w-8 h-8 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-contrast">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-label mt-1">
                {acceptedFormats} (max {maxSize}MB)
              </p>
            </div>
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};
