import { useState, useEffect } from "react";
import { Modal, InputField, Button, TextAreaField } from "tccd-ui";
import {
  useCreateCompany,
  useUpdateCompany,
} from "@/shared/queries/companies";
import type { Company } from "@/shared/queries/companies";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/shared/utils";
import extractDriveId from "@/shared/utils/googleDriveHelper";

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
        logoId: extractDriveId(company.logo || ""),
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
    } catch (error) {
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
          labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
          label="Company Name*"
          id="company-name"
          value={formData.companyName}
          onChange={(val) => setFormData((prev) => ({ ...prev, companyName: val.target.value }))}
          placeholder="e.g., Acme Corporation"
        />

        <InputField
          labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
          label="Business Type"
          id="company-business-type"
          value={formData.businessType}
          onChange={(val) => setFormData((prev) => ({ ...prev, businessType: val.target.value }))}
          placeholder="e.g., Technology, Healthcare"
        />

        <TextAreaField
          labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
          label="Description"
          id="company-description"
          value={formData.description}
          onChange={(val) => setFormData((prev) => ({ ...prev, description: val.target.value }))}
          placeholder="Describe the company..."
        />

        <InputField
          labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
          label="Website"
          id="company-website"
          value={formData.website}
          onChange={(val) => setFormData((prev) => ({ ...prev, website: val.target.value }))}
          placeholder="e.g., https://example.com"
        />

        <InputField
          labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
          label="Brief"
          id="company-brief"
          value={formData.brief}
          onChange={(val) => setFormData((prev) => ({ ...prev, brief: val.target.value }))}
          placeholder="Short summary of the company"
        />

        <InputField
          labelClassName="text-[13px] md:text-[14px] lg:text-[15px] text-gray-600 mb-1"
          label="Logo ID (Google Drive)"
          id="company-logo-id"
          value={formData.logoId}
          onChange={(val) => setFormData((prev) => ({ ...prev, logoId: extractDriveId(val.target.value) }))}
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
