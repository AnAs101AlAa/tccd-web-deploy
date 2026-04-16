import type { EventSlot } from "@/shared/types/events";
import { systemApi } from "../../AxoisInstance";
import type Event from "@/shared/types/events";

const EVENTS_ROUTE = "/v1/Event";
const SPONSOR_ROUTE = "/v1/Sponsors";

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
      locations: data.locations,
      autoApproval: data.autoApproval,
      hasWaitingList: data.hasWaitingList,
      parentEventId: data.parentEventId,
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
    
    return {
      items: data.data.items.map((item: any) => ({...item, locations: item.rooms, eventMedia: item.medias, capacity: item.slots?.reduce((sum: number, slot: EventSlot) => sum + (slot.capacity || 0), 0) || 0} as Event)) as Event[],
      totalPages: data.data.totalPages,
      totalCount: data.data.totalCount,
    };
  }

  async deleteEvent(id: string) {
    await systemApi.delete(
      `${EVENTS_ROUTE}/${id}`
    );
  }
  
  async addSponsorToEvent(eventId: string, companyId: string): Promise<void> {
    await systemApi.post(`${SPONSOR_ROUTE}`, {
      eventId,
      companyId,
    });
  }

  async removeSponsorFromEvent(eventId: string, companyId: string): Promise<void> {
    await systemApi.delete(`${SPONSOR_ROUTE}/${eventId}/${companyId}`);
  }

  async addEventSlot(
    eventId: string,
    payload: {
      title?: string;
      description?: string;
      startTime: string;
      endTime: string;
      capacity: number;
    },
  ): Promise<void> {
    await systemApi.post(`/v1/Event/${eventId}/slots`, payload);
  }

  async updateEventSlot(
    eventId: string,
    slotId: string,
    payload: {
      title?: string;
      description?: string;
      startTime: string;
      endTime: string;
      capacity: number;
    },
  ): Promise<void> {
    await systemApi.patch(`/v1/Event/${eventId}/slots/${slotId}`, payload);
  }

  async removeEventSlot(eventId: string, slotId: string): Promise<void> {
    await systemApi.delete(`/v1/Event/${eventId}/slots/${slotId}`);
  }

  async getEventRegistrations(eventId: string, pageNumber: number, pageSize: number, slotId?: string, englishName?:string, arabicName?:string, email?:string, university?:string, department?:string, graduationYear?:number ) {
    const params: any = {
      pageNumber,
      pageSize,
      ...(slotId ? { slotId } : {}),
      ...(englishName ? { englishName } : {}),
      ...(arabicName ? { arabicName } : {}),
      ...(email ? { email } :{}),
      ...(university ? { university } :{}),
      ...(department ? { department } :{}),
      ...(graduationYear ? { graduationYear } :{}),
    };
    const response = await systemApi.get(`/v1/events/${eventId}/registrations`, { params });
    return response.data.data;
  }

  async changeRegistrationStatus(eventId: string, slotId: string, userId: string, newStatus: string) {
    await systemApi.patch(`/v1/events/${eventId}/slots/${slotId}/registrations/${userId}`, { status: newStatus });
  }

  async AdjustEventRegistration(eventId: string, userId: string, slotId: string) {
    await systemApi.post(`/v1/events/${eventId}/slots/${slotId}/registrations/add-by-admin/${userId}`);
  }
}
export const eventsApi = new EventsApi();