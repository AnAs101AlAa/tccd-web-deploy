import { systemApi } from "../AxoisInstance";
import type { StudentUser } from "@/shared/types";

const EVENT_ROUTE = "/v1/Event/";

export class EventRegisterApi {
  async getCurrentUser(): Promise<StudentUser> {
    const { data } = await systemApi.get("/v1/User/current");
    return data;
  }
  async registerForEvent(eventName: string, userData: StudentUser) {
    const { data } = await systemApi.post(`${EVENT_ROUTE}${eventName}/register`, userData);
    return data;
  }
}
