import { systemApi } from "../AxoisInstance";

export interface UserRegistrationData {
  fullNameArabic: string;
  fullNameEnglish: string;
  email: string;
  phoneNumber: string;
  university: string;
  faculty: string;
  department?: string;
  gradYear: number;
}

const EVENT_ROUTE = "/v1/Event/";

export class EventRegisterApi {
  async getCurrentUser(): Promise<UserRegistrationData> {
    const { data } = await systemApi.get("/v1/User/current");
    return data;
  }
  async registerForEvent(eventName: string, userData: UserRegistrationData) {
    const { data } = await systemApi.post(`${EVENT_ROUTE}${eventName}/register`, userData);
    return data;
  }
}
