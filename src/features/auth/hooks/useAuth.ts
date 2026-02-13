import {
  useLogin,
  useLogout,
  useSignupStudent,
  useSignupBusinessRep,
  useSignupFaculty,
  useForgotPassword,
} from "@/shared/queries/auth/authQueries";
import {
  useIsAuthenticated,
  useCurrentUser,
} from "@/shared/queries/user/userHooks";
import { useNavigate } from "react-router-dom";
import type {
  LoginFormData,
  ForgotPasswordFormData,
  BasicInfoFormData,
  StudentInfoFormData,
  CompanyRepInfoFormData,
  FacultyInfoFormData,
  UserType,
} from "../schemas";
import { useState } from "react";

/**
 * Custom Auth Hook
 *
 * This hook provides a unified interface for authentication operations.
 * It combines auth queries, user state, and navigation logic.
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useCurrentUser();
  const [loginHolder, setLoginHolder] = useState(false);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const signupStudentMutation = useSignupStudent();
  const signupBusinessRepMutation = useSignupBusinessRep();
  const signupFacultyMutation = useSignupFaculty();
  const forgotPasswordMutation = useForgotPassword();

  /**
   * Handle login with form data
   * Automatically navigates to dashboard on success
   */
  const handleLogin = async (data: LoginFormData) => {
    try {
      setLoginHolder(true)
      await loginMutation.mutateAsync(data);
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  /**
   * Handle logout
   * Automatically navigates to login page on success
   */
  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  /**
   * Handle signup with form data
   * Automatically navigates to confirmation page on success
   */
  const handleSignup = async (
    userType: UserType,
    basicData: BasicInfoFormData,
    additionalData: StudentInfoFormData | CompanyRepInfoFormData | FacultyInfoFormData
  ) => {
    try {
      if (userType === "student") {
        const studentData = additionalData as StudentInfoFormData;
        await signupStudentMutation.mutateAsync({
          email: basicData.email,
          password: basicData.password,
          englishName: basicData.englishFullName,
          arabicName: basicData.arabicFullName,
          gender: basicData.gender,
          phoneNumber: basicData.phoneNumber,
          university: studentData.university,
          faculty: studentData.faculty,
          department: studentData.department || "",
        });
      } else if (userType === "company_representative") {
        const companyData = additionalData as CompanyRepInfoFormData;
        await signupBusinessRepMutation.mutateAsync({
          englishName: basicData.englishFullName,
          arabicName: basicData.arabicFullName,
          email: basicData.email,
          phoneNumber: basicData.phoneNumber,
          password: basicData.password,
          gender: basicData.gender,
          companyId: companyData.isNewCompany ? undefined : companyData.companyId,
          newCompany: companyData.isNewCompany ? companyData.newCompany : undefined,
          position: companyData.position,
          proofFile: companyData.proofFile,
        });
      } else if (userType === "academic") {
        const facultyData = additionalData as FacultyInfoFormData;
        await signupFacultyMutation.mutateAsync({
          englishName: basicData.englishFullName,
          arabicName: basicData.arabicFullName,
          email: basicData.email,
          phoneNumber: basicData.phoneNumber,
          password: basicData.password,
          role: facultyData.role,
          gender: basicData.gender,
          universityName: facultyData.universityName,
          facultyName: facultyData.facultyName,
          department: facultyData.department,
          proofFile: facultyData.proofFile,
        });
      }
      navigate("/sign-up/confirmation");
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  /**
   * Handle forgot password with form data
   * Automatically navigates to OTP verification page on success
   */
  const handleForgotPassword = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data);
      navigate("/otp", { state: { email: data.email } });
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  return {
    // Auth operations
    handleLogin,
    handleLogout,
    handleSignup,
    handleForgotPassword,

    // Loading states
    isLoggingIn: loginMutation.isPending,
    loginHolder: loginHolder,
    isLoggingOut: logoutMutation.isPending,
    isSigningUp: signupStudentMutation.isPending || signupBusinessRepMutation.isPending || signupFacultyMutation.isPending,
    isSendingResetEmail: forgotPasswordMutation.isPending,

    // Error states
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
    signupError: signupStudentMutation.error || signupBusinessRepMutation.error || signupFacultyMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,

    // User state
    isAuthenticated,
    currentUser,

    // Raw mutations (for advanced use cases)
    loginMutation,
    logoutMutation,
    signupStudentMutation,
    signupBusinessRepMutation,
    signupFacultyMutation,
    forgotPasswordMutation,
  };
};
