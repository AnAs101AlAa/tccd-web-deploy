import type { Tickets, TicketStatus, Registration } from "@/shared/types";
import { systemApi } from "../AxoisInstance";
import type { Gender } from "@/shared/types/users";

const USER_ROUTE = "/v1/User";

export interface UpdateUserProfilePayload {
  englishName: string;
  arabicName: string;
  phoneNumber: string;
  gender: Gender;
}

export interface UpdateUserProfileResponse {
  englishFullName: string;
  arabicFullName: string;
  gender: Gender;
  phoneNumber: string;
}

export interface UpdateStudentProfilePayload {
  gpa: number;
  graduationYear: number;
  department: string;
  faculty: string;
  university: string;
  linkedIn?: string;
  gitHub?: string;
}

export interface UpdateStudentProfileResponse {
  gpa: number;
  graduationYear: number;
  department: string;
  faculty: string;
  university: string;
  linkedin?: string;
  gitHub?: string;
}

export interface UpdateStudentCVResponse {
  cv: string;
}

export interface RegistrationQueryParams {
  page?: number;
  count?: number;
  status?: TicketStatus;
}

export class UserApi {
  async updateUserProfile(
    payload: UpdateUserProfilePayload,
  ): Promise<UpdateUserProfileResponse> {
    const { data } = await systemApi.put(USER_ROUTE, payload);

    // Only extract the fields we updated from the response
    const response = data.data;

    return {
      englishFullName: response.englishName,
      arabicFullName: response.arabicName,
      gender: response.gender,
      phoneNumber: response.phoneNumber,
    };
  }

  async updateStudentProfile(
    payload: UpdateStudentProfilePayload,
  ): Promise<UpdateStudentProfileResponse> {
    const { data } = await systemApi.put(
      `${USER_ROUTE}/student-profile`,
      payload,
    );

    // Only extract the fields we updated from the response
    const response = data.data;

    return {
      gpa: response.gpa,
      graduationYear: response.graduationYear,
      department: response.department,
      faculty: response.faculty,
      university: response.university,
      linkedin: response.linkedIn,
      gitHub: response.gitHub,
    };
  }

  async updateStudentCV(cvFile: File): Promise<UpdateStudentCVResponse> {
    const formData = new FormData();
    formData.append("cvFile", cvFile);

    const { data } = await systemApi.patch(
      `${USER_ROUTE}/student-profile/cv`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    // Only extract the CV field from the response
    const response = data.data;

    return {
      cv: response.cv,
    };
  }

  async getUserRegistrations(
    params?: RegistrationQueryParams,
  ): Promise<Tickets> {
    const { data } = await systemApi.get(`${USER_ROUTE}/registrations`, {
      params,
    });
    return data.data;
  }

  async getUserRegistration(eventId: string): Promise<Registration> {
    const { data } = await systemApi.get(
      `${USER_ROUTE}/registration/${eventId}`,
    );
    return data.data;
  }
}
