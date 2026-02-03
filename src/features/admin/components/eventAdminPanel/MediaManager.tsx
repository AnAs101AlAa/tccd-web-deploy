import React from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { Button, ButtonTypes, ButtonWidths } from "tccd-ui";
import { FileUploadField } from "@/shared/components/FileUploadField";

export interface MediaItem {
  id: string;
  file: File | string;
  preview: string;
}

interface MediaManagerProps {
  media: MediaItem[];
  onChange: (media: MediaItem[]) => void;
  error?: string;
}

export const MediaManager: React.FC<MediaManagerProps> = ({
  media,
  onChange,
  error,
}) => {
  const handleAddMedia = () => {
    const newMedia: MediaItem = {
      id: `temp-${Date.now()}`,
      file: "",
      preview: "",
    };
    onChange([...media, newMedia]);
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    onChange(newMedia);
  };

  const handleMediaChange = (index: number, file: File | null) => {
    const newMedia = [...media];
    if (file) {
      newMedia[index] = {
        ...newMedia[index],
        file,
        preview: URL.createObjectURL(file),
      };
    } else {
      newMedia[index] = {
        ...newMedia[index],
        file: "",
        preview: "",
      };
    }
    onChange(newMedia);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-contrast">
          Media Gallery (Optional)
        </label>
        <Button
          buttonText="Add Media"
          buttonIcon={<FiPlus className="w-4 h-4" />}
          onClick={handleAddMedia}
          type={ButtonTypes.BASIC}
          width={ButtonWidths.FIT}
        />
      </div>

      {media.length > 0 && (
        <div className="space-y-3">
          {media.map((item, index) => (
            <div key={item.id || index} className="relative">
              <div className="flex gap-3 items-start">
                <div className="flex-1">
                  <FileUploadField
                    id={`media-${index}`}
                    label={`Media ${index + 1}`}
                    value={item.file}
                    onChange={(file) => handleMediaChange(index, file)}
                    preview={item.preview}
                    accept="image/*,video/*"
                    acceptedFormats="Images or Videos"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMedia(index)}
                  className="mt-8 p-2 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Remove media"
                >
                  <FiX className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {media.length === 0 && (
        <p className="text-sm text-label text-center py-4">
          No media added yet. Click "Add Media" to upload images or videos.
        </p>
      )}
    </div>
  );
};
