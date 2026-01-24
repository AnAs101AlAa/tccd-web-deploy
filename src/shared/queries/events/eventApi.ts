import { systemApi } from "../AxoisInstance";
import type Event from "@/shared/types/events";

const EVENT_ROUTE = "/v1/Event";

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
    
    if (response.data.success && response.data.data) {
      const item = response.data.data;
      return {
        id: item.id,
        title: item.name,
        description: item.description,
        eventPoster: item.eventImage || "",
        media: [],
        sponsors: [],
        date: item.date,
        location: item.location,
        category: item.type,
        capacity: item.capacity,
        registeredCount: 0,
        attendeeCount: item.attendeeCount,
      };
    }
    
    throw new Error("Event not found");
  }
}

export const eventApi = new EventApi();
