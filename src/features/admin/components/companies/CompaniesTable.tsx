import { useState } from "react";
import {
  useGetAdminCompanies,
  useDeleteCompany,
} from "@/shared/queries/companies";
import { Pagination } from "@/shared/components/pagination";
import type {
  Company,
  AdminCompaniesQueryParams,
} from "@/shared/queries/companies";
import { FiEye, FiEdit2, FiTrash2, FiBriefcase } from "react-icons/fi";
import CompanyDetailModal from "./CompanyDetailModal";
import AddEditCompanyModal from "./AddEditCompanyModal";
import ConfirmActionModal from "@/shared/components/modals/ConfirmActionModal";
import toast from "react-hot-toast";

interface CompaniesTableProps {
  queryParams: AdminCompaniesQueryParams;
  onPageChange: (page: number) => void;
}

const CompaniesTable = ({ queryParams, onPageChange }: CompaniesTableProps) => {
  const { data: response, isLoading } = useGetAdminCompanies(queryParams);
  const deleteMutation = useDeleteCompany();

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
      onError: () => {
        toast.error("Failed to delete company. Please try again.");
        setIsDeleteOpen(false);
      },
    });
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
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleView(company);
        }}
        className="p-2 rounded-lg hover:bg-contrast/10 text-secondary transition-colors"
        title="View details"
      >
        <FiEye className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleEdit(company);
        }}
        className="p-2 rounded-lg hover:bg-contrast/10 text-secondary transition-colors"
        title="Edit company"
      >
        <FiEdit2 className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDeleteClick(company);
        }}
        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
        title="Delete company"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
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
                <th className="whitespace-nowrap px-4 py-3 text-center text-sm font-medium text-inactive-tab-text">
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
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-contrast/5 flex items-center justify-center flex-shrink-0 border border-contrast/10">
                        {company.logo ? (
                          <img
                            src={company.logo}
                            alt={company.companyName}
                            className="w-full h-full object-cover"
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
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-contrast/10 text-contrast">
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
                  <td className="px-4 py-3 text-secondary max-w-[250px] truncate">
                    {company.brief || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      <ActionButtons company={company} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden divide-y divide-contrast/10">
          {companies.map((company) => (
            <div key={company.id} className="p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-contrast/5 flex items-center justify-center flex-shrink-0 border border-contrast/10">
                    {company.logo ? (
                      <img
                        src={company.logo}
                        alt={company.companyName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiBriefcase className="w-5 h-5 text-inactive-tab-text" />
                    )}
                  </div>
                  <p className="font-semibold text-contrast text-[18px]">
                    {company.companyName}
                  </p>
                </div>
                {company.businessType && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-contrast/10 text-contrast shrink-0 ml-2">
                    {company.businessType}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm">
                <div>
                  <span className="font-medium text-inactive-tab-text block mb-0.5">
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
                    <span className="font-medium text-inactive-tab-text block mb-0.5">
                      Brief
                    </span>
                    <span className="text-secondary">{company.brief}</span>
                  </div>
                )}
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-contrast/5">
                <button
                  onClick={() => handleView(company)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg transition-colors text-sm font-medium"
                >
                  <FiEye className="w-4 h-4" />
                  View
                </button>
                <button
                  onClick={() => handleEdit(company)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-secondary/10 hover:bg-secondary/20 text-secondary rounded-lg transition-colors text-sm font-medium"
                >
                  <FiEdit2 className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(company)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors text-sm font-medium"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {paginationData && paginationData.totalPages > 1 && (
          <Pagination
            currentPage={paginationData.pageIndex}
            totalPages={paginationData.totalPages}
            onPageChange={onPageChange}
          />
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
