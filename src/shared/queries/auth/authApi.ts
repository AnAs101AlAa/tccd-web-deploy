import { systemApi } from "../AxoisInstance";
import type {
  LoginCredentials,
  StudentSignupCredentials,
  BusinessRepSignupCredentials,
  FacultySignupCredentials,
  ForgotPasswordCredentials,
} from "./types";

const AUTH_ROUTE = "/v1/Auth/";

export class AuthApi {
  async login(credentials: LoginCredentials) {
    const { data } = await systemApi.post(AUTH_ROUTE + "login", credentials);
    return data.data;
  }

  async logout() {
    const response = await systemApi.post(AUTH_ROUTE + "logout");
    return response.data;
  }

  async signupStudent(credentials: StudentSignupCredentials) {
    const { data } = await systemApi.post(
      AUTH_ROUTE + "register-student",
      credentials
    );
    return data.data;
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
        credentials.newCompany.companyName
      );
      formData.append(
        "newCompany.businessType",
        credentials.newCompany.businessType
      );
      formData.append(
        "newCompany.description",
        credentials.newCompany.description
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
      }
    );
    return data.data;
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
      }
    );
    return data.data;
  }

  async forgotPassword(credentials: ForgotPasswordCredentials) {
    const { data } = await systemApi.post(
      AUTH_ROUTE + "forgot-password",
      credentials
    );
    return data;
  }
}
