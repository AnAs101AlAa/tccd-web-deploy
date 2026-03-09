import { systemApi } from "../../AxoisInstance";
import type { UserQueryParams, UserResponse } from "./userTypes";

const USERS_ROUTE = "/v1/Admin/users";

export class UsersApi {
  async fetchUsers(params?: UserQueryParams): Promise<UserResponse> {
    const response = await systemApi.get(`${USERS_ROUTE}`, { params });
    return response.data.data;
  }

  async fetchPendingAccounts(
    PageNumber: number = 1,
    PageSize: number = 10,
  ): Promise<UserResponse> {
    const response = await systemApi.get(`${USERS_ROUTE}/pending-accounts`, {
      params: { PageNumber: PageNumber, PageSize: PageSize },
    });
    return response.data.data;
  }

  async approveUser(userId: string): Promise<string> {
    const response = await systemApi.patch(
      `${USERS_ROUTE}/${userId}/approval`,
      { status: "Approved" },
    );
    return response.data;
  }

  async rejectUser(userId: string): Promise<string> {
    const response = await systemApi.patch(
      `${USERS_ROUTE}/${userId}/approval`,
      { status: "Rejected" },
    );
    return response.data;
  }

  async banUser(userId: string): Promise<string> {
    const response = await systemApi.patch(
      `${USERS_ROUTE}/${userId}/ban-approve`,
      { status: "Ban" },
    );
    return response.data;
  }

  async unbanUser(userId: string): Promise<string> {
    const response = await systemApi.patch(
      `${USERS_ROUTE}/${userId}/ban-approve`,
      { status: "Approve" },
    );
    return response.data;
  }
}
