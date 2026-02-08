import { systemApi } from "../../AxoisInstance";
import type Event from "@/shared/types/events";

const EVENTS_ROUTE = "/v1/Event";

export class EventsApi {
  async createEvent(data: Event) {
    const res = await systemApi.post(
      `/v2/Event`,
      {...data, eventImageId: data.eventImage}
    );

    return res.data.data;
  }
  
  async updateEvent(id: string, data: Partial<Event>) {
    const payload: any = {
      name: data.name,
      description: data.description,
      date: data.date,
      type: data.type,
      capacity: data.capacity,
      registrationDeadline: data.registrationDeadline,
      locations: data.locations,
    };
    
    await systemApi.put(
      `${EVENTS_ROUTE}/${id}`,
      payload
    );
  }
  
  async updateEventPoster(id: string, fileId: string) {
    await systemApi.patch(
      `/v2/Event/${id}/poster`,
      { fileId }
    );
  }
  
  async addEventMedia(eventId: string, mediaFileIds: string[]) {
    const { data } = await systemApi.post(
      `/v1/EventMedia/upload-without-access`,
      {
        eventId,
        mediaFileIds
      }
    );
    return data.data;
  }
  
  async deleteEventMedia(eventMediaId: string) {
    await systemApi.delete(
      `/v1/EventMedia/delete-without-access/${eventMediaId}`
    );
  }
  
  async fetchEvent(page: number, limit: number, nameKey?: string, type?: string, startDate?: string, endDate?: string, location?: string, orderBy?: string) {
    let orderByField: string | undefined;
    let isDesc = false;
    if (orderBy) {
      const [field, direction] = orderBy.split(" ");
      orderByField = field;
      isDesc = direction?.toLowerCase() === "desc";
    }
    const queryParams = {
      pageNumber: page,
      pageSize: limit,
      ...(nameKey ? { Name: nameKey } : {}),
      ...(type ? { Type: type } : {}),
      ...(startDate ? { StartDate: startDate } : {}),
      ...(endDate ? { EndDate: endDate } : {}),
      ...(location ? { Location: location } : {}),
      ...(orderByField ? { OrderBy: orderByField } : {}),
      ...(isDesc ? { Descending: isDesc } : {}),
    }

    const { data } = await systemApi.get(
      `${EVENTS_ROUTE}`,
      { params: queryParams }
    );
    return data.data.items.map((item: any) => ({...item, locations: item.rooms, eventMedia: item.medias} as Event)) as Event[];
  }

  async deleteEvent(id: string) {
    await systemApi.delete(
      `${EVENTS_ROUTE}/${id}`
    );
  }
}

export const eventsApi = new EventsApi();