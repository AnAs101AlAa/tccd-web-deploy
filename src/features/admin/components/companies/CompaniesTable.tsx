import { useState } from "react";
import {
  useGetCompanies,
  useDeleteCompany,
  useUpdateCompanyApproval,
} from "@/shared/queries/companies";
import { Button, LazyImageLoader } from "tccd-ui";
import { Pagination } from "@/shared/components/pagination";
import type {
  Company,
  CompaniesQueryParams,
} from "@/shared/queries/companies";
import {
  FiEdit,
  FiBriefcase,
} from "react-icons/fi";
import { TbTrash } from "react-icons/tb";
import { LuExpand } from "react-icons/lu";
import { BsClipboard2XFill, BsClipboard2CheckFill  } from "react-icons/bs";
import CompanyDetailModal from "./CompanyDetailModal";
import AddEditCompanyModal from "./AddEditCompanyModal";
import ConfirmActionModal from "@/shared/components/modals/ConfirmActionModal";
import toast from "react-hot-toast";

interface CompaniesTableProps {
  queryParams: CompaniesQueryParams;
  onPageChange: (page: number) => void;
}

const CompaniesTable = ({ queryParams, onPageChange }: CompaniesTableProps) => {
  const { data: response, isLoading } = useGetCompanies(
    queryParams.page,
    queryParams.count,
    queryParams.CompanyName,
    queryParams.BusinessType,
    queryParams.IsApproved,
    queryParams.OrderBy,
    queryParams.Descending,
  );
  const deleteMutation = useDeleteCompany();
  const updateApprovalMutation = useUpdateCompanyApproval();

  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleView = (company: Company) => {
    setSelectedCompany(company);
    setIsDetailOpen(true);
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (company: Company) => {
    setSelectedCompany(company);
    setIsDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedCompany) return;
    deleteMutation.mutate(selectedCompany.id, {
      onSuccess: () => {
        toast.success("Company deleted successfully!");
        setIsDeleteOpen(false);
        setSelectedCompany(null);
      },
      onError: (error: any) => {
        if (error?.response?.status === 409) {
          toast.error(
            "Cannot delete company because it is linked to other records (e.g., events, users).",
          );
        } else {
          toast.error("Failed to delete company. Please try again.");
        }
        setIsDeleteOpen(false);
      },
    });
  };

  const handleToggleApproval = (company: Company) => {
    const newStatus = !company.isApproved;
    updateApprovalMutation.mutate(
      {
        id: company.id,
        isApproved: newStatus,
      },
      {
        onSuccess: () => {
          toast.success(
            `Company ${newStatus ? "approved" : "disapproved"} successfully`,
          );
        },
        onError: (error: any) => {
          toast.error(
            `Failed to update company status: ${error.response?.data?.message || "Unknown error"}`,
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-contrast mx-auto mb-3" />
          <p className="text-secondary font-medium">Loading companies...</p>
        </div>
      </div>
    );
  }

  const companies = response?.data?.items || [];
  const paginationData = response?.data;

  if (companies.length === 0) {
    return (
      <div className="text-center py-16">
        <FiBriefcase className="w-12 h-12 text-inactive-tab-text mx-auto mb-3" />
        <p className="text-secondary font-semibold text-lg">
          No companies found.
        </p>
        <p className="text-inactive-tab-text text-sm mt-1">
          Try adjusting your filters or add a new company.
        </p>
      </div>
    );
  }

  const ActionButtons = ({ company }: { company: Company }) => (
    <div className="flex items-center justify-center md:justify-start w-full gap-2" onClick={(e) => e.stopPropagation()}>
      <Button 
        type="tertiary"
        className="md:py-1.5 md:px-3"
        width="fit"
        buttonIcon={!company.isApproved ? <BsClipboard2CheckFill className="size-4 md:size-4.5" /> : <BsClipboard2XFill className="size-4 md:size-4.5" />}
        onClick={() => handleToggleApproval(company)}
        disabled={updateApprovalMutation.isPending}
      />
      <Button
        type="secondary"
        width="fit"
        className="md:py-1.5 md:px-3"
        buttonIcon={<FiEdit className="size-4 md:size-4.5" />}
        onClick={() => handleEdit(company)}
        disabled={updateApprovalMutation.isPending}
      />
      <Button
        type="primary"
        width="fit"
        className="md:py-1.5 md:px-3"
        buttonIcon={<LuExpand className="size-4 md:size-4.5" />}
        onClick={() => handleView(company)}
        disabled={updateApprovalMutation.isPending}
      />
      <Button
        type="danger"
        width="fit"
        className="md:py-1.5 md:px-3"
        buttonIcon={<TbTrash className="size-4 md:size-4.5" />}
        onClick={() => handleDeleteClick(company)}
        disabled={updateApprovalMutation.isPending}
      />
    </div>
  );

  return (
    <>
      <div>
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-contrast/5">
              <tr>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                  Company
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                  Business Type
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                  Website
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                  Brief
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-contrast/10">
              {companies.map((company) => (
                <tr
                  key={company.id}
                  onClick={() => handleView(company)}
                  className="hover:bg-contrast/5 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-contrast/5 flex items-center justify-center shrink-0 border border-contrast/10">
                        {company.logo ? (
                          <LazyImageLoader
                            src={company.logo}
                            alt={company.companyName}
                            objectClassName="w-full h-full object-contain"
                          />
                        ) : (
                          <FiBriefcase className="w-4 h-4 text-inactive-tab-text" />
                        )}
                      </div>
                      <span className="font-medium text-contrast">
                        {company.companyName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {company.businessType ? (
                      <span className="inline-flex items-center px-3 py-0.5 shadow-sm rounded-full text-[13px] font-semibold bg-contrast/10 text-contrast">
                        {company.businessType}
                      </span>
                    ) : (
                      <span className="text-inactive-tab-text">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-secondary">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-secondary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {company.website}
                      </a>
                    ) : (
                      <span className="text-inactive-tab-text">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-secondary max-w-62.5 truncate">
                    {company.brief || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 shadow-sm border rounded-full text-xs font-medium ${
                        company.isApproved
                          ? "bg-green-500/10 text-green-600 border-green-500"
                          : "bg-yellow-500/10 text-yellow-600 border-yellow-500"
                      }`}
                    >
                      {company.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <ActionButtons company={company} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-contrast/10">
          {companies.map((company) => (
            <div key={company.id} className="p-3 space-y-2 relative">
              {company.businessType && (
                <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-contrast/10 text-contrast shrink-0 ml-2">
                  {company.businessType}
                </span>
              )}
              <div className="flex flex-col gap-1.5">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-contrast/5 flex items-center justify-center shrink-0 border border-contrast/10">
                  {company.logo ? (
                    <LazyImageLoader
                      src={company.logo}
                      alt={company.companyName}
                      objectClassName="w-full h-full object-contain"
                    />
                  ) : (
                    <FiBriefcase className="w-5 h-5 text-inactive-tab-text" />
                  )}
                </div>
                <p className="font-semibold text-contrast text-[20px]">
                  {company.companyName}
                </p>
              </div>

              <div className="flex flex-wrap space-x-3 space-y-2 text-sm mb-4">
                <div>
                  <span className="font-medium text-inactive-tab-text block">
                    Website
                  </span>
                  <span className="text-secondary">
                    {company.website ? (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {company.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                {company.brief && (
                  <div>
                    <span className="font-medium text-inactive-tab-text block">
                      Brief
                    </span>
                    <span className="text-secondary">{company.brief}</span>
                  </div>
                )}
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-contrast/5 w-full">
                <ActionButtons company={company} />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {paginationData && paginationData.totalPages > 1 && (
          <div className="-mt-3">
            <Pagination
              currentPage={paginationData.pageIndex}
              totalPages={paginationData.totalPages}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      {isDetailOpen && selectedCompany && (
        <CompanyDetailModal
          isOpen={isDetailOpen}
          onClose={() => {
            setIsDetailOpen(false);
            setSelectedCompany(null);
          }}
          company={selectedCompany}
        />
      )}

      {isEditOpen && (
        <AddEditCompanyModal
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedCompany(null);
          }}
          company={selectedCompany}
        />
      )}

      {isDeleteOpen && (
        <ConfirmActionModal
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setSelectedCompany(null);
          }}
          isSubmitting={deleteMutation.isPending}
          title="Delete Company"
          message={`Are you sure you want to delete "${selectedCompany?.companyName}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
        />
      )}
    </>
  );
};

export default CompaniesTable;
