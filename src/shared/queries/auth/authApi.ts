import { systemApi } from "../AxoisInstance";
import type {
  LoginCredentials,
  StudentSignupCredentials,
  BusinessRepSignupCredentials,
  FacultySignupCredentials,
  ForgotPasswordCredentials,
} from "./types";
import type {
  AnyUser,
  StudentUser,
  VolunteeringUser,
  BusinessRepUser,
  FacultyMemberUser,
  AdminUser,
} from "@/shared/types/users";

const AUTH_ROUTE = "/v1/Auth/";

export class AuthApi {
  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: AnyUser; token: string }> {
    const { data } = await systemApi.post(AUTH_ROUTE + "login", credentials);
    const response = data.data;

    const token = response.token || response.jwToken || ""; // Adjust field name if needed

    // Map API response to our user types
    const baseUser = {
      id: response.id,
      englishFullName: response.englishName,
      arabicFullName: response.arabicName,
      phoneNumber: "", // Not provided in login response
      email: credentials.email, // Use from credentials
      gender: response.gender,
      profilePicture: response.profileImage,
      status: response.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    };

    const roles = response.roles || [];
    let user: AnyUser;

    // Map based on role and available profile data
    if (roles.includes("Admin")) {
      user = {
        ...baseUser,
        role: "Admin" as const,
        adminLevel: 1,
      } as AdminUser;
    } else if (response.studentProfile) {
      const student = response.studentProfile;

      // Check if they're also a volunteer
      if (student.volunteeringProfile) {
        user = {
          ...baseUser,
          role: "Volunteer" as const,
          gpa: student.gpa,
          graduationYear: student.graduationYear,
          department: student.department,
          faculty: student.faculty,
          university: student.university,
          cv: student.cv,
          linkedin: student.linkedIn,
          gitHub: student.gitHub,
          committeeAffiliation:
            student.volunteeringProfile.committeeAffiliation,
          position: student.volunteeringProfile.position,
        } as VolunteeringUser;
      } else {
        user = {
          ...baseUser,
          role: "Student" as const,
          gpa: student.gpa,
          graduationYear: student.graduationYear,
          department: student.department,
          faculty: student.faculty,
          university: student.university,
          cv: student.cv,
          linkedin: student.linkedIn,
          gitHub: student.gitHub,
        } as StudentUser;
      }
    } else if (response.businessRepProfile) {
      user = {
        ...baseUser,
        role: "BusinessRep" as const,
        companyId: "", // Not provided in login response
        jobTitle: response.businessRepProfile.position,
      } as BusinessRepUser;
    } else if (response.facultyMemberProfile) {
      const faculty = response.facultyMemberProfile;
      const facultyRole = roles.includes("TA")
        ? "TA"
        : roles.includes("DR")
          ? "DR"
          : "TA";

      user = {
        ...baseUser,
        role: facultyRole as "TA" | "DR",
        university: faculty.universityName,
        faculty: faculty.facultyName,
        department: faculty.department,
      } as FacultyMemberUser;
    } else {
      // Default to admin if no profile matches
      user = {
        ...baseUser,
        role: "Admin" as const,
        adminLevel: 1,
      } as AdminUser;
    }

    return { user, token };
  }

  async logout() {
    const response = await systemApi.post(AUTH_ROUTE + "logout");
    return response.data;
  }

  async signupStudent(credentials: StudentSignupCredentials) {
    const { data } = await systemApi.post(
      AUTH_ROUTE + "register-student",
      credentials,
    );
    const response = data.data;
    const token = response.token || response.jwToken || "";
    return { user: response as AnyUser, token };
  }

  async signupBusinessRep(credentials: BusinessRepSignupCredentials) {
    const formData = new FormData();

    // Add all fields to FormData
    formData.append("englishName", credentials.englishName);
    formData.append("arabicName", credentials.arabicName);
    formData.append("email", credentials.email);
    formData.append("phoneNumber", credentials.phoneNumber);
    formData.append("password", credentials.password);
    formData.append("gender", credentials.gender);
    formData.append("position", credentials.position);

    if (credentials.role) {
      formData.append("role", credentials.role);
    }

    if (credentials.companyId) {
      formData.append("companyId", credentials.companyId);
    }

    if (credentials.newCompany) {
      formData.append(
        "newCompany.companyName",
        credentials.newCompany.companyName,
      );
      formData.append(
        "newCompany.businessType",
        credentials.newCompany.businessType,
      );
      formData.append(
        "newCompany.description",
        credentials.newCompany.description,
      );
      formData.append("newCompany.website", credentials.newCompany.website);
      formData.append("newCompany.brief", credentials.newCompany.brief);
    }

    formData.append("proofFile", credentials.proofFile);

    const { data } = await systemApi.post(
      AUTH_ROUTE + "register-business-rep",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    const response = data.data;
    const token = response.token || response.jwToken || "";
    return { user: response as AnyUser, token };
  }

  async signupFaculty(credentials: FacultySignupCredentials) {
    const formData = new FormData();

    // Add all fields to FormData
    formData.append("englishName", credentials.englishName);
    formData.append("arabicName", credentials.arabicName);
    formData.append("email", credentials.email);
    formData.append("phoneNumber", credentials.phoneNumber);
    formData.append("password", credentials.password);
    formData.append("role", credentials.role);
    formData.append("gender", credentials.gender);
    formData.append("universityName", credentials.universityName);
    formData.append("facultyName", credentials.facultyName);
    formData.append("department", credentials.department);
    formData.append("proofFile", credentials.proofFile);

    const { data } = await systemApi.post(
      AUTH_ROUTE + "register-faculty",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    const response = data.data;
    const token = response.token || response.jwToken || "";
    return { user: response as AnyUser, token };
  }

  async forgotPassword(credentials: ForgotPasswordCredentials) {
    const { data } = await systemApi.post(
      AUTH_ROUTE + "forgot-password",
      credentials,
    );
    return data;
  }
}
