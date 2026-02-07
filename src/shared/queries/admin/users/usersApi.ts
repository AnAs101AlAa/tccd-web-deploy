import { systemApi } from "../../AxoisInstance";
import type { UserQueryParams, UserResponse } from "./userTypes";

const USERS_ROUTE = "/v1/Admin/users";

export class UsersApi {
  async fetchUsers(params?: UserQueryParams): Promise<UserResponse> {
    const response = await systemApi.get(`${USERS_ROUTE}`, { params });
    return response.data.data;
  }

  async fetchPendingAccounts(
    page: number = 1,
    count: number = 10,
  ): Promise<UserResponse> {
    const response = await systemApi.get(`${USERS_ROUTE}/pending-accounts`, {
      params: { page, count },
    });
    return response.data.data;
  }

  async approveUser(userId: string): Promise<string> {
    const response = await systemApi.patch(
      `${USERS_ROUTE}/${userId}/approval`,
      { data: { status: "Approved" } },
    );
    return response.data;
  }

  async rejectUser(userId: string): Promise<string> {
    const response = await systemApi.patch(
      `${USERS_ROUTE}/${userId}/approval`,
      { data: { status: "Rejected" } },
    );
    return response.data;
  }

  async banUser(userId: string): Promise<string> {
    const response = await systemApi.patch(
      `${USERS_ROUTE}/${userId}/ban-approve`,
      { data: { status: "Ban" } },
    );
    return response.data;
  }

  async unbanUser(userId: string): Promise<string> {
    const response = await systemApi.patch(
      `${USERS_ROUTE}/${userId}/ban-approve`,
      { data: { status: "Approve" } },
    );
    return response.data;
  }
}
