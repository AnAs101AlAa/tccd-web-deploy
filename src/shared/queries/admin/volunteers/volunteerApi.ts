import { systemApi } from "../../AxoisInstance";

const VOLUNTEER_ROUTE = "/v1/volunteering-profiles";

export class VolunteerApi {
  async addVolunteer(committee: string, position: string, userId: string): Promise<string> {
    const response = await systemApi.post(`${VOLUNTEER_ROUTE}/${userId}`, {
      committeeAffiliation: committee,
      position,
    });
    return response.data;
  }

  async editVolunteer(userId: string, committee: string, position: string): Promise<string> {
    const response = await systemApi.put(`${VOLUNTEER_ROUTE}/${userId}`, {
      committeeAffiliation: committee,
      position,
    });
    return response.data;
  }

  async deleteVolunteer(userId: string): Promise<string> {
    const response = await systemApi.delete(`${VOLUNTEER_ROUTE}/${userId}`);
    return response.data;
  }
}
