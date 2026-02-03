import type { EventQueryParams, EventResponse } from "@/shared/types/events";
import { systemApi } from "../AxoisInstance";
import type Event from "@/shared/types/events";
import type { Sponsor } from "@/shared/types/events";

const EVENT_ROUTE = "/v1/Event";
const SPONSOR_ROUTE = "/v1/Sponsors";

export class EventApi {
  async getAllUpcomingEvents(
    params?: EventQueryParams,
  ): Promise<EventResponse> {
    if (params?.StartDate) {
      const startDateTime = new Date(params.StartDate);
      const now = new Date();
      if (startDateTime < now) {
        throw new Error(
          "Start date cannot be in the past, Please head to the past events section.",
        );
      }
    } else {
      params = { ...params, StartDate: new Date().toISOString() };
    }
    const response = await systemApi.get(`${EVENT_ROUTE}`, {
      params,
    });
    return response.data.data;
  }

  async getAllPastEvents(params?: EventQueryParams): Promise<EventResponse> {
    if (params?.EndDate) {
      const endDateTime = new Date(params.EndDate);
      const now = new Date();
      if (endDateTime > now) {
        throw new Error("End date cannot be in the future, Please head to the upcoming events section.");
      }
    } else {
      params = { ...params, StartDate: new Date().toISOString() };
    }
    const response = await systemApi.get(`${EVENT_ROUTE}`, {
      params,
    });
    return response.data.data;
  }

  async getEventById(id: string): Promise<Event> {
    const response = await systemApi.get(`${EVENT_ROUTE}/${id}`);
    if (response.data.success && response.data.data) {
      const item = response.data.data;
      return {
        id: item.id,
        name: item.name,
        description: item.description,
        eventImage: item.eventImage || "",
        type: item.type,
        date: item.date,
        locations: item.locations,
        isApproved: item.isApproved,
        capacity: item.capacity,
        registeredCount: item.registeredCount,
        attendeeCount: item.attendeeCount,
        registrationDeadline: item.registrationDeadline,
        createdBy: item.createdBy,
        createdAt: item.createdAt,
        updatedOn: item.updatedOn,
      };
    }

    throw new Error("Event not found");
  }

  async getSponsorsByEventId(eventId: string): Promise<Sponsor[]> {
    const response = await systemApi.get(
      `${SPONSOR_ROUTE}/sponsor/${eventId}/companies`,
    );

    if (response.data.success && response.data.data) {
      return response.data.data.map(
        (item: any): Sponsor => ({
          id: item.id,
          companyName: item.companyName,
          businessType: item.businessType,
          description: item.description,
          website: item.website,
          brief: item.brief,
          logo: item.logo,
        }),
      );
    }

    return [];
  }
}

export const eventApi = new EventApi();
