import { systemApi } from "../../AxoisInstance";
import type Event from "@/shared/types/events";

const EVENTS_ROUTE = "/v1/Event";

export class EventsApi {
  async createEvent(data: Event) {
    await systemApi.post(
      `/v2/Event`,
      {...data, eventImageId: data.eventImage}
    );
  }
  async updateEvent(id: string, data: Event) {
    await systemApi.put(
      `${EVENTS_ROUTE}/${id}`,
      data
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
}

export const eventsApi = new EventsApi();