import { systemApi } from "../AxoisInstance";
import type Event from "@/shared/types/events";

const EVENT_ROUTE = "/v1/Event";

export class EventApi {
  async getAllUpcomingEvents(): Promise<Event[]> {
    const response = await systemApi.get(`${EVENT_ROUTE}/upcoming`);
    return response.data;
  }

  async getAllPastEvents(
    pageNumber: number = 1,
    pageSize: number = 12,
    filters?: {
      searchQuery?: string;
      eventTypes?: string[];
      startDate?: string;
      endDate?: string;
    }
  ) {
    const currentDate = new Date();
    const currentDateISO = currentDate.toISOString();
    
    const params: any = {
      EndDate: filters?.endDate || currentDateISO,
      OrderBy: "date",
      Descending: true,
      PageNumber: pageNumber,
      PageSize: pageSize,
    };

    if (filters?.searchQuery) {
      params.Name = filters.searchQuery;
    }

    if (filters?.eventTypes && filters.eventTypes.length > 0) {
      params.Type = filters.eventTypes.join(',');
    }

    if (filters?.startDate) {
      params.StartDate = filters.startDate;
    }
    
    const response = await systemApi.get(
      EVENT_ROUTE,
      { params }
    );

    // Map API response to Event type and return pagination data
    if (response.data.success && response.data.data) {
      const { items, pageIndex, totalPages, totalCount } = response.data.data;
      return {
        events: items.map((item: any): Event => ({
          id: item.id,
          title: item.name,
          description: item.description,
          eventPoster: item.eventImage || "",
          eventType: item.type,
          media: [],
          sponsors: [],
          date: item.date,
          location: item.location,
          category: item.type,
          capacity: item.capacity,
          registeredCount: 0,
          attendeeCount: item.attendeeCount,
        })),
        pageIndex,
        totalPages,
        totalCount,
      };
    }
    
    return {
      events: [],
      pageIndex: 1,
      totalPages: 0,
      totalCount: 0,
    };
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
