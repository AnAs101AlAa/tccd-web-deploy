import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate } from "react-router-dom";
import {
  accountTypeSchema,
  basicInfoSchema,
  studentInfoSchema,
  companyRepInfoSchema,
  facultyInfoSchema,
  type AccountTypeFormData,
  type BasicInfoFormData,
  type StudentInfoFormData,
  type CompanyRepInfoFormData,
  type FacultyInfoFormData,
  type UserType,
} from "../../schemas";
import { useAuth } from "../../hooks";
import {
  AccountTypeStep,
  BasicInfoStep,
  StudentInfoStep,
  CompanyRepInfoStep,
  FacultyInfoStep,
  StepIndicator,
  SubmitButton,
} from "../../components";
import { Button } from "tccd-ui";
import tccdLogo from "/TCCD_logo.svg";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

/**
 * Multi-Step SignupPage Component
 */
export const SignupPage = () => {
  const { handleSignup, isSigningUp, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedUserType, setSelectedUserType] = useState<
    UserType | undefined
  >();

  // Step 1: Account Type
  const accountTypeForm = useForm<AccountTypeFormData>({
    resolver: zodResolver(accountTypeSchema),
    mode: "onChange",
    defaultValues: { userType: undefined },
  });

  // Step 2: Basic Info
  const basicInfoForm = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      englishFullName: "",
      arabicFullName: "",
      phoneNumber: "",
      email: "",
      gender: undefined,
      linkedinUrl: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    console.log(currentStep, selectedUserType);
  }, [currentStep, selectedUserType]);

  // Step 3: Student Info
  const studentInfoForm = useForm<StudentInfoFormData>({
    resolver: zodResolver(studentInfoSchema),
    mode: "onChange",
    defaultValues: {
      university: "",
      faculty: "",
      department: "",
    },
  });

  // Step 3/4: Company Rep Info
  const companyRepForm = useForm<CompanyRepInfoFormData>({
    resolver: zodResolver(companyRepInfoSchema),
    mode: "onChange",
    defaultValues: {
      companyId: "",
      position: "",
      proofFile: null as unknown as File,
      isNewCompany: false,
      newCompany: undefined,
    },
  });

  // Step 3/4: Faculty Info
  const facultyInfoForm = useForm<FacultyInfoFormData>({
    resolver: zodResolver(facultyInfoSchema),
    mode: "onChange",
    defaultValues: {
      universityName: "",
      facultyName: "",
      department: "",
      role: "",
      proofFile: null as unknown as File,
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Get step labels
  const getStepLabels = () => {
    const baseSteps = ["Account Type", "Basic Info"];
    if (selectedUserType === "student") {
      return [...baseSteps, "Student Info"];
    }
    if (selectedUserType === "company_representative") {
      return [...baseSteps, "Company Info"];
    }
    if (selectedUserType === "academic") {
      return [...baseSteps, "Academic Info"];
    }
    return baseSteps;
  };

  const totalSteps = getStepLabels().length;

  // Check if current step is valid
  const isCurrentStepValid = () => {
    if (currentStep === 1) {
      // For step 1, check if a user type is selected
      const userType = accountTypeForm.watch("userType");
      return userType !== undefined && userType !== null;
    } else if (currentStep === 2) {
      return basicInfoForm.formState.isValid;
    } else if (currentStep === 3) {
      if (selectedUserType === "student") {
        return studentInfoForm.formState.isValid;
      } else if (selectedUserType === "company_representative") {
        return companyRepForm.formState.isValid;
      } else if (selectedUserType === "academic") {
        return facultyInfoForm.formState.isValid;
      }
    }
    return false;
  };

  // Handle next step
  const handleNext = async () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = await accountTypeForm.trigger();
      if (isValid) {
        const userType = accountTypeForm.getValues("userType");
        setSelectedUserType(userType);
      }
    } else if (currentStep === 2) {
      isValid = await basicInfoForm.trigger();
    } else if (currentStep === 3) {
      if (selectedUserType === "student") {
        isValid = await studentInfoForm.trigger();
      } else if (selectedUserType === "company_representative") {
        isValid = await companyRepForm.trigger();
      } else if (selectedUserType === "academic") {
        isValid = await facultyInfoForm.trigger();
      }
    }

    if (isValid) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const onSubmit = async () => {
    const basicData = basicInfoForm.getValues();

    await handleSignup(
      selectedUserType!,
      basicData,
      selectedUserType === "student"
        ? studentInfoForm.getValues()
        : selectedUserType === "company_representative"
        ? companyRepForm.getValues()
        : facultyInfoForm.getValues()
    );
  };

  const handleGoogleSignIn = () => {
    console.log("Google Sign In clicked");
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-[#f8f6f1] text-[#121212]">
      <div className="mx-auto grid min-h-screen max-w-7xl place-items-center px-4 py-16">
        <section
          className="w-full max-w-2xl rounded-2xl border border-black/5 bg-white/80 p-8 shadow-[0_4px_30px_rgba(0,0,0,0.04)] backdrop-blur"
          aria-labelledby="signup-title"
        >
          <header className="w-full flex flex-col gap-3 items-center mb-8">
            <p className="text-[#636569] font-bold">join us</p>
            <img src={tccdLogo} width={80} alt="TCCD Logo" />
            <h2 id="signup-title" className="text-2xl font-bold text-[#3B3D41]">
              TCCD Portal
            </h2>
            <p className="text-sm text-[#5E6064]">Create your account</p>
          </header>

          <StepIndicator steps={getStepLabels()} currentStep={currentStep} />

          <div className="mt-8">
            {currentStep === 1 && (
              <AccountTypeStep
                control={accountTypeForm.control}
                selectedType={accountTypeForm.watch("userType")}
                onSelect={(type) => {
                  accountTypeForm.setValue("userType", type, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true,
                  });
                  setSelectedUserType(type); // Update immediately for step indicator
                }}
              />
            )}

            {currentStep === 2 && (
              <BasicInfoStep control={basicInfoForm.control} />
            )}

            {currentStep === 3 && selectedUserType === "student" && (
              <StudentInfoStep control={studentInfoForm.control} />
            )}

            {currentStep === 3 &&
              selectedUserType === "company_representative" && (
                <CompanyRepInfoStep control={companyRepForm.control} />
              )}

            {currentStep === 3 && selectedUserType === "academic" && (
              <FacultyInfoStep control={facultyInfoForm.control} />
            )}
          </div>

          <div className="flex items-center justify-between gap-4 mt-8">
            {currentStep > 1 && (
              <Button
                buttonText="Previous"
                buttonIcon={<FiArrowLeft className="w-4 h-4" />}
                onClick={handlePrevious}
                type="basic"
              />
            )}

            <div className="flex-1" />

            {currentStep < totalSteps ? (
              <div className="ml-auto">
                <Button
                  buttonText="Next"
                  buttonIcon={<FiArrowRight className="w-4 h-4" />}
                  onClick={handleNext}
                  type="secondary"
                  disabled={!isCurrentStepValid()}
                />
              </div>
            ) : (
              <div className="ml-auto">
                <SubmitButton
                  isLoading={isSigningUp}
                  loadingText="Creating account..."
                  onClick={onSubmit}
                  disabled={!isCurrentStepValid()}
                >
                  Create Account
                </SubmitButton>
              </div>
            )}
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/80 text-[#636569]">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            buttonText="Sign up with Google"
            buttonIcon={<FcGoogle className="w-5 h-5" />}
            onClick={handleGoogleSignIn}
            type="basic"
            width="full"
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-[#636569]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-secondary hover:text-secondary/80 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>

          <footer className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-center text-xs text-[#A5A9B2]">
              Welcome to the TCCD Portal! Join our community today.
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
};
