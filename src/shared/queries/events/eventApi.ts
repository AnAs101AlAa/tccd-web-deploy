import type { EventQueryParams, EventResponse } from "@/shared/types/events";
import { systemApi } from "../AxoisInstance";
import type Event from "@/shared/types/events";

const EVENT_ROUTE = "/v1/event/";

export class EventApi {
  async getAllUpcomingEvents(params?: EventQueryParams): Promise<EventResponse> {
    if (params?.StartDate) {
      const startDateTime = new Date(params.StartDate);
      const now = new Date();
      if (startDateTime < now) {
        throw new Error("Start date cannot be in the past, Please head to the past events section.");
      }
    } else {
      params = { ...params, StartDate: new Date().toISOString() };
    }
    const response = await systemApi.get(`${EVENT_ROUTE}`, {
      params,
    });
    return response.data.data;
  }

  async getAllPastEvents(): Promise<EventResponse> {
    const response = await systemApi.get(`${EVENT_ROUTE}`);
    return response.data.data;
  }

  async getEventById(id: string): Promise<Event> {
    const response = await systemApi.get(`${EVENT_ROUTE}${id}`);
    return response.data;
  }
}

export const eventApi = new EventApi();
