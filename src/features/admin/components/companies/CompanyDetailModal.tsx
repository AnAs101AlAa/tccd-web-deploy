import { LazyImageLoader, Modal } from "tccd-ui";
import type { Company } from "@/shared/queries/companies";
import { FiGlobe, FiBriefcase, FiFileText, FiInfo } from "react-icons/fi";

interface CompanyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company;
}

const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  isOpen,
  onClose,
  company,
}) => {
  if (!isOpen) return null;

  return (
    <Modal
      title="Company Details"
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-lg"
    >
      <div className="flex flex-col items-center gap-5">
        {/* Logo */}
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-contrast/10 bg-contrast/5 flex items-center justify-center">
          {company.logo ? (
            <LazyImageLoader
              src={company.logo}
              alt={company.companyName}
              objectClassName="w-full h-full object-contain"
            />
          ) : (
            <FiBriefcase className="w-10 h-10 text-inactive-tab-text" />
          )}
        </div>

        {/* Company Name */}
        <h2 className="text-2xl font-bold text-contrast text-center">
          {company.companyName}
        </h2>

        {/* Details List */}
        <div className="w-full space-y-4">
          {company.businessType && (
            <div className="flex items-start gap-3">
              <FiBriefcase className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-inactive-tab-text uppercase tracking-wider">
                  Business Type
                </p>
                <p className="text-contrast font-medium">
                  {company.businessType}
                </p>
              </div>
            </div>
          )}

          {company.website && (
            <div className="flex items-start gap-3">
              <FiGlobe className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-inactive-tab-text uppercase tracking-wider">
                  Website
                </p>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline font-medium"
                >
                  {company.website}
                </a>
              </div>
            </div>
          )}

          {company.brief && (
            <div className="flex items-start gap-3">
              <FiInfo className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-inactive-tab-text uppercase tracking-wider">
                  Brief
                </p>
                <p className="text-contrast">{company.brief}</p>
              </div>
            </div>
          )}

          {company.description && (
            <div className="flex items-start gap-3">
              <FiFileText className="w-5 h-5 text-secondary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-inactive-tab-text uppercase tracking-wider">
                  Description
                </p>
                <p className="text-contrast leading-relaxed">
                  {company.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CompanyDetailModal;
