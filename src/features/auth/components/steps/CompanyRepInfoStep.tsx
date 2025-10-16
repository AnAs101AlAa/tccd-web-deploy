import type { Control } from "react-hook-form";
import type { CompanyRepInfoFormData } from "../../schemas";
import { Controller } from "react-hook-form";
import { useState, useEffect } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { Button } from "tccd-ui";

interface CompanyRepInfoStepProps {
  control: Control<CompanyRepInfoFormData>;
}

interface Company {
  id: string;
  name: string;
  industry: string;
}

/**
 * Step 4: Company Representative Information
 */
export const CompanyRepInfoStep = ({ control }: CompanyRepInfoStepProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRegisterCompany, setShowRegisterCompany] = useState(false);

  // Mock function to fetch companies - replace with actual API call
  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/companies');
      // const data = await response.json();

      // Mock data for demonstration
      const mockCompanies: Company[] = [
        { id: "1", name: "Tech Solutions Inc.", industry: "Technology" },
        { id: "2", name: "Digital Innovations", industry: "Software" },
        { id: "3", name: "Global Tech Corp", industry: "IT Services" },
        { id: "4", name: "Future Systems", industry: "Technology" },
        { id: "5", name: "Smart Solutions", industry: "Consulting" },
      ];

      setCompanies(mockCompanies);
      setFilteredCompanies(mockCompanies);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Filter companies based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCompanies(companies);
    } else {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.industry.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    }
  }, [searchQuery, companies]);

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-[#3B3D41] mb-2">
          Company Information
        </h3>
        <p className="text-sm text-[#636569]">
          Select your company or register a new one
        </p>
      </div>

      {/* Search Box */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search for your company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
        />
      </div>

      {/* Company Selection */}
      <Controller
        name="companyId"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Company
            </label>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
                <p className="mt-2 text-sm text-gray-500">
                  Loading companies...
                </p>
              </div>
            ) : (
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
                    <button
                      key={company.id}
                      type="button"
                      onClick={() => field.onChange(company.id)}
                      className={`
                        w-full p-4 text-left hover:bg-gray-50 transition-colors
                        ${
                          field.value === company.id
                            ? "bg-muted-secondary/10 border-l-4 border-secondary"
                            : ""
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-[#3B3D41]">
                            {company.name}
                          </h4>
                          <p className="text-sm text-[#636569]">
                            {company.industry}
                          </p>
                        </div>
                        {field.value === company.id && (
                          <div className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No companies found</p>
                    <p className="text-xs mt-1">
                      Try a different search term or register your company
                    </p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Register New Company Button */}
      <div className="mt-4">
        <Button
          buttonText="Register New Company"
          buttonIcon={<FiPlus className="w-5 h-5" />}
          onClick={() => setShowRegisterCompany(!showRegisterCompany)}
          type="basic"
          width="full"
        />
      </div>

      {/* Register Company Form (Placeholder) */}
      {showRegisterCompany && (
        <div className="mt-4 p-4 bg-muted-secondary/10 border border-secondary/30 rounded-lg">
          <p className="text-sm text-secondary text-center">
            Company registration feature coming soon. Please contact support to
            register your company.
          </p>
        </div>
      )}
    </div>
  );
};
