import type { Control } from "react-hook-form";
import type { CompanyRepInfoFormData } from "../../schemas";
import { Controller } from "react-hook-form";
import { useEffect, useState, useRef } from "react";
import { FiSearch, FiPlus, FiUpload, FiX } from "react-icons/fi";
import { Button } from "tccd-ui";
import { useGetCompanies } from "@/shared/queries/companies";
import toast from "react-hot-toast";

interface CompanyRepInfoStepProps {
  control: Control<CompanyRepInfoFormData>;
}

/**
 * Step 3/4: Company Representative Information
 */
export const CompanyRepInfoStep = ({ control }: CompanyRepInfoStepProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fileName, setFileName] = useState<string>("");
  const fileRef = useRef<File | null>(null);

  const { data: companiesData, isLoading } = useGetCompanies(1, 100);

  // Sync showRegisterCompany with form value
  const isNewCompany = control._getWatch("isNewCompany");
  const showRegisterCompany = isNewCompany || false;

  const companies = companiesData?.data?.items || [];
  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.businessType.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Sync fileName and fileRef with form value on mount or when proofFile changes
  useEffect(() => {
    const proofFile = control._getWatch("proofFile");
    if (proofFile instanceof File) {
      setFileName(proofFile.name);
      fileRef.current = proofFile;
    }
  }, [control]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File) => void,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file type (PDF or images)
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or image file (JPEG, JPG, PNG)");
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      setFileName(file.name);
      fileRef.current = file;
      onChange(file);
    }
  };

  const clearFile = (onChange: (value: File | null) => void) => {
    setFileName("");
    fileRef.current = null;
    onChange(null as unknown as File);
  };

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

      {/* Toggle between existing and new company */}
      <Controller
        name="isNewCompany"
        control={control}
        render={({ field }) => (
          <div className="flex gap-2 mb-4">
            <Button
              buttonText="Select Existing Company"
              onClick={() => {
                field.onChange(false);
              }}
              type={!field.value ? "secondary" : "basic"}
              width="full"
            />
            <Button
              buttonText="Register New Company"
              buttonIcon={<FiPlus className="w-5 h-5" />}
              onClick={() => {
                field.onChange(true);
              }}
              type={field.value ? "secondary" : "basic"}
              width="full"
            />
          </div>
        )}
      />

      {!showRegisterCompany ? (
        <>
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
                  Select Company <span className="text-red-500">*</span>
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
                                {company.companyName}
                              </h4>
                              <p className="text-sm text-[#636569]">
                                {company.businessType}
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
        </>
      ) : (
        <>
          {/* New Company Registration Form */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-semibold text-[#3B3D41] mb-3">
              Register New Company
            </h4>

            <Controller
              name="newCompany.companyName"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...field}
                    type="text"
                    placeholder="Enter company name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="newCompany.businessType"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...field}
                    type="text"
                    placeholder="E.g., Technology, Finance, Healthcare"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="newCompany.description"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...field}
                    placeholder="Describe your company..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="newCompany.website"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...field}
                    type="url"
                    placeholder="https://www.example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {error.message}
                    </p>
                  )}
                </div>
              )}
            />

            <Controller
              name="newCompany.brief"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brief <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...field}
                    placeholder="A short brief about the company..."
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
                  />
                  {error && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </>
      )}

      {/* Position */}
      <Controller
        name="position"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Your Position <span className="text-red-500">*</span>
            </label>
            <input
              {...field}
              type="text"
              placeholder="E.g., HR Manager, CEO, Recruiter"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent transition-colors"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {error.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Proof File */}
      <Controller
        name="proofFile"
        control={control}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Proof of Employment <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">
              Upload a document that proves your employment (ID card, business
              card, etc.)
            </p>

            {!fileName ? (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FiUpload className="w-8 h-8 mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPEG, JPG, or PNG (MAX. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleFileChange(e, onChange)}
                />
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-300 rounded-lg">
                <div className="flex items-center space-x-2">
                  <FiUpload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm text-gray-700">{fileName}</span>
                </div>
                <button
                  type="button"
                  onClick={() => clearFile(onChange)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <FiX className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            )}

            {error && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};
