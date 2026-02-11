import { useState, useEffect } from "react";
import { Modal, InputField, Button } from "tccd-ui";
import {
  useCreateCompany,
  useUpdateCompany,
} from "@/shared/queries/admin/companies";
import type { Company } from "@/shared/queries/admin/companies";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils";

interface AddEditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  company?: Company | null;
}

const AddEditCompanyModal: React.FC<AddEditCompanyModalProps> = ({
  isOpen,
  onClose,
  company,
}) => {
  const isEditMode = !!company;
  const createMutation = useCreateCompany();
  const updateMutation = useUpdateCompany();

  const [formData, setFormData] = useState({
    companyName: "",
    businessType: "",
    description: "",
    website: "",
    brief: "",
    logoId: "",
  });

  useEffect(() => {
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        businessType: company.businessType || "",
        description: company.description || "",
        website: company.website || "",
        brief: company.brief || "",
        logoId: "",
      });
    } else {
      setFormData({
        companyName: "",
        businessType: "",
        description: "",
        website: "",
        brief: "",
        logoId: "",
      });
    }
  }, [company]);

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = async () => {
    if (!formData.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      if (isEditMode && company) {
        await updateMutation.mutateAsync({
          id: company.id,
          payload: {
            companyName: formData.companyName.trim(),
            businessType: formData.businessType.trim(),
            ...(formData.description.trim()
              ? { description: formData.description.trim() }
              : {}),
            ...(formData.website.trim()
              ? { website: formData.website.trim() }
              : {}),
            ...(formData.brief.trim() ? { brief: formData.brief.trim() } : {}),
            ...(formData.logoId ? { logoId: formData.logoId.trim() } : {}),
          },
        });
        toast.success("Company updated successfully!");
      } else {
        await createMutation.mutateAsync({
          companyName: formData.companyName.trim(),
          businessType: formData.businessType.trim(),
          ...(formData.description.trim()
            ? { description: formData.description.trim() }
            : {}),
          ...(formData.website.trim()
            ? { website: formData.website.trim() }
            : {}),
          ...(formData.brief.trim() ? { brief: formData.brief.trim() } : {}),
          ...(formData.logoId ? { logoId: formData.logoId.trim() } : {}),
        });
        toast.success("Company created successfully!");
      }
      onClose();
    } catch (error: any) {
      console.error("Error saving company:", error);
      console.error("Error response:", error.response?.data);
      toast.error(getErrorMessage(error));
    }
  };

  const handleClose = () => {
    if (!isPending) onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      title={isEditMode ? "Edit Company" : "Add New Company"}
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-2xl"
    >
      <div className="space-y-5">
        <InputField
          label="Company Name *"
          id="company-name"
          value={formData.companyName}
          onChange={(val: any) => {
            const v = val?.target?.value !== undefined ? val.target.value : val;
            setFormData((prev) => ({ ...prev, companyName: v }));
          }}
          placeholder="e.g., Acme Corporation"
        />

        <InputField
          label="Business Type"
          id="company-business-type"
          value={formData.businessType}
          onChange={(val: any) => {
            const v = val?.target?.value !== undefined ? val.target.value : val;
            setFormData((prev) => ({ ...prev, businessType: v }));
          }}
          placeholder="e.g., Technology, Healthcare"
        />

        <div>
          <label className="block text-sm font-medium text-contrast mb-1.5">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Describe the company..."
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg border border-contrast/20 bg-background text-contrast placeholder:text-inactive-tab-text focus:outline-none focus:ring-2 focus:ring-secondary/50 resize-none"
          />
        </div>

        <InputField
          label="Website"
          id="company-website"
          value={formData.website}
          onChange={(val: any) => {
            const v = val?.target?.value !== undefined ? val.target.value : val;
            setFormData((prev) => ({ ...prev, website: v }));
          }}
          placeholder="e.g., https://example.com"
        />

        <InputField
          label="Brief"
          id="company-brief"
          value={formData.brief}
          onChange={(val: any) => {
            const v = val?.target?.value !== undefined ? val.target.value : val;
            setFormData((prev) => ({ ...prev, brief: v }));
          }}
          placeholder="Short summary of the company"
        />

        <InputField
          label="Logo ID (Google Drive)"
          id="company-logo-id"
          value={formData.logoId}
          onChange={(val: any) => {
            const v = val?.target?.value !== undefined ? val.target.value : val;
            // Extract drive ID from URL if pasted
            const match =
              typeof v === "string"
                ? v.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
                  v.match(/id=([a-zA-Z0-9_-]+)/)
                : null;
            const id = match ? match[1] : v;
            setFormData((prev) => ({ ...prev, logoId: id }));
          }}
          placeholder="Paste ID or full Google Drive URL"
        />

        <div className="flex justify-center gap-3 pt-4 border-t border-contrast/10">
          <Button
            buttonText="Cancel"
            onClick={handleClose}
            type="basic"
            width="auto"
            disabled={isPending}
          />
          <Button
            buttonText={isEditMode ? "Update" : "Create"}
            type="primary"
            onClick={handleSubmit}
            width="auto"
            loading={isPending}
            disabled={isPending}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddEditCompanyModal;
