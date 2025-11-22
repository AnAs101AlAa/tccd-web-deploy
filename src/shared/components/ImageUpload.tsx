import { useState, useRef } from "react";
import { parseURI } from "@/shared/utils";
import { IoMdClose } from "react-icons/io";
import { RiUploadCloud2Line } from "react-icons/ri";

interface ImageUploadProps {
  label?: string;
  value: string;
  onChange: (base64: string) => void;
  error?: string;
  className?: string;
  maxSizeMB?: number;
}

/**
 * ImageUpload Component
 *
 * Handles image file selection and converts to base64 for form submission
 * Displays preview of selected or existing image
 *
 * @param label - Label text for the input
 * @param value - Current image value (base64 data URL)
 * @param onChange - Callback when image is selected/changed
 * @param error - Error message to display
 * @param className - Additional CSS classes
 * @param maxSizeMB - Maximum file size in megabytes (default: 5MB)
 */
const ImageUpload: React.FC<ImageUploadProps> = ({
  label = "Image",
  value,
  onChange,
  error,
  className = "",
  maxSizeMB = 5,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    const validTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    if (!validTypes.includes(file.type)) {
      return "Please upload a valid image file (PNG, JPG, GIF, WebP, or SVG)";
    }

    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `File size must be less than ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFileChange = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      // You could pass this error up if needed
      console.error(validationError);
      return;
    }

    setIsProcessing(true);
    try {
      const base64 = await parseURI(file);
      onChange(base64);
    } catch (error) {
      console.error("Error converting image to base64:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          isDragging
            ? "border-secondary bg-secondary/5"
            : error
            ? "border-primary bg-red-50"
            : "border-gray-300 hover:border-gray-400"
        } ${isProcessing ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/svg+xml"
          onChange={handleInputChange}
          className="hidden"
          disabled={isProcessing}
        />

        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemove}
              disabled={isProcessing}
              className="absolute top-2 right-2 bg-secondary text-white p-2 rounded-full hover:bg-blue-600/40 transition-colors disabled:opacity-50"
              aria-label="Remove image"
            >
              <IoMdClose />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-3 py-1 rounded text-sm">
              Click to change
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            {isProcessing ? (
              <div className="text-gray-500">Processing image...</div>
            ) : (
              <>
                <RiUploadCloud2Line size={40} className="text-gray-400" />
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-semibold text-secondary">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WebP or SVG (max {maxSizeMB}MB)
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-primary text-sm mt-1" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;
