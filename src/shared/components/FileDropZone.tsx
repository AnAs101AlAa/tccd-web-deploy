import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { LuUpload, LuX, LuFile } from "react-icons/lu";
import type { DropZoneProps } from "../types";
import toast from "react-hot-toast";

export default function FileDropZone({
  files,
  setFiles,
  acceptedFileTypes = {},
  disabled = false,
}: DropZoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (disabled) return;

      setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);

      if (rejectedFiles.length > 0) {
        toast.error(`File type not accepted`);
      }
    },
    [setFiles, disabled]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: acceptedFileTypes,
    disabled,
  });

  function removeFile(indexToRemove: number) {
    setFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  }

  function formatFileSize(bytes: number) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  return (
    <>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${
          disabled
            ? "border-contrast/10 bg-contrast/10 cursor-not-allowed opacity-60"
            : isDragActive
            ? "border-secondary bg-blue-50 cursor-pointer"
            : "border-contrast/15 hover:border-primary/50 bg-gray-50 cursor-pointer"
        }`}
      >
        <input {...getInputProps()} />
        <LuUpload
          className={`mx-auto h-12 w-12 mb-4 ${
            disabled ? "invisible" : "text-contrast/20"
          }`}
        />
        {disabled ? (
          <p className="text-contrast/40 font-medium">Upload disabled</p>
        ) : isDragActive ? (
          <p className="text-secondary font-medium">Drop the files here...</p>
        ) : (
          <div>
            <p className="font-medium mb-2">
              Drag & drop files here, or click to select files
            </p>
            <p className="text-contrast/50 text-sm">
              You can upload multiple files at once
            </p>
          </div>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-background border border-contrast/20 rounded-lg hover:bg-contrast/5 transition-colors duration-300"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <LuFile className="h-5 w-5 text-contrast/50 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-contrast/70">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  disabled={disabled}
                  className={`ml-3 p-1 rounded-full transition-colors duration-300 flex-shrink-0 ${
                    disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-error/10 cursor-pointer"
                  }`}
                  aria-label="Remove file"
                >
                  <LuX className="h-5 w-5 text-error" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
