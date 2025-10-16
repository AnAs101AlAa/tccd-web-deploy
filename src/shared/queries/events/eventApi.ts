import { systemApi } from "../AxoisInstance";
import type Event from "@/shared/types/events";

const EVENT_ROUTE = "/v1/event/";

export class EventApi {
  async getAllUpcomingEvents(): Promise<Event[]> {
    const response = await systemApi.get(`${EVENT_ROUTE}/upcoming`);
    return response.data;
  }

  async getAllPastEvents(): Promise<Event[]> {
    const response = await systemApi.get(`${EVENT_ROUTE}/past`);
    return response.data;
  }

  async getEventById(id: string): Promise<Event> {
    const response = await systemApi.get(`${EVENT_ROUTE}/${id}`);
    return response.data;
  }
}

export const eventApi = new EventApi();
