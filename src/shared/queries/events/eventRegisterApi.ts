import { systemApi } from "../AxoisInstance";
import type { EligibilityResponse, RegistrationResponse } from "./types";

const EVENT_ROUTE = "/v1/events";

export class EventRegisterApi {
  async checkEligibility(eventId: string): Promise<EligibilityResponse> {
    const { data } = await systemApi.get(
      `${EVENT_ROUTE}/${eventId}/registrations/is-eligible`,
    );
    return data.data ?? data;
  }

  async registerForEvent(
    eventId: string,
    eventSlotId: string,
  ): Promise<RegistrationResponse> {
    const { data } = await systemApi.post(
      `${EVENT_ROUTE}/${eventId}/slots/${eventSlotId}/registrations/register`,
    );
    return data.data ?? data;
  }
}

export const eventRegisterApi = new EventRegisterApi();
