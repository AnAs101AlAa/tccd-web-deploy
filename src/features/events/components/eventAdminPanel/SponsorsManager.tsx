import React from "react";
import { FiPlus, FiX } from "react-icons/fi";
import { Button, ButtonTypes, ButtonWidths, InputField } from "tccd-ui";
import { FileUploadField } from "@/shared/components/FileUploadField";
import type { SponsorItem } from "../../types/eventModalTypes";

interface SponsorsManagerProps {
  sponsors: SponsorItem[];
  onChange: (sponsors: SponsorItem[]) => void;
  error?: string;
}

export const SponsorsManager: React.FC<SponsorsManagerProps> = ({
  sponsors,
  onChange,
  error,
}) => {
  const handleAddSponsor = () => {
    const newSponsor: SponsorItem = {
      id: `temp-${Date.now()}`,
      companyName: "",
      banner: "",
      bannerPreview: "",
    };
    onChange([...sponsors, newSponsor]);
  };

  const handleRemoveSponsor = (index: number) => {
    const newSponsors = sponsors.filter((_, i) => i !== index);
    onChange(newSponsors);
  };

  const handleCompanyNameChange = (index: number, value: string) => {
    const newSponsors = [...sponsors];
    newSponsors[index] = {
      ...newSponsors[index],
      companyName: value,
    };
    onChange(newSponsors);
  };

  const handleBannerChange = (index: number, file: File | null) => {
    const newSponsors = [...sponsors];
    if (file) {
      newSponsors[index] = {
        ...newSponsors[index],
        banner: file,
        bannerPreview: URL.createObjectURL(file),
      };
    } else {
      newSponsors[index] = {
        ...newSponsors[index],
        banner: "",
        bannerPreview: "",
      };
    }
    onChange(newSponsors);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-contrast">
          Sponsors (Optional)
        </label>
        <Button
          buttonText="Add Sponsor"
          buttonIcon={<FiPlus className="w-4 h-4" />}
          onClick={handleAddSponsor}
          type={ButtonTypes.BASIC}
          width={ButtonWidths.FIT}
        />
      </div>

      {sponsors.length > 0 && (
        <div className="space-y-4">
          {sponsors.map((sponsor, index) => (
            <div
              key={sponsor.id || index}
              className="border border-gray-200 rounded-lg p-4 relative"
            >
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-4">
                  <div>
                    <InputField
                      label="Company Name"
                      id={`sponsor-name-${index}`}
                      value={sponsor.companyName}
                      placeholder="Enter company name"
                      onChange={(e) =>
                        handleCompanyNameChange(index, e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <FileUploadField
                      id={`sponsor-banner-${index}`}
                      label="Sponsor Banner"
                      value={sponsor.banner}
                      onChange={(file) => handleBannerChange(index, file)}
                      preview={sponsor.bannerPreview}
                      accept="image/*"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSponsor(index)}
                  className="p-2 hover:bg-red-50 rounded-full transition-colors"
                  aria-label="Remove sponsor"
                >
                  <FiX className="w-5 h-5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {sponsors.length === 0 && (
        <p className="text-sm text-label text-center py-4">
          No sponsors added yet. Click "Add Sponsor" to add event sponsors.
        </p>
      )}
    </div>
  );
};
