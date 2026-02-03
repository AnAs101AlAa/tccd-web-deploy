import { systemApi } from "../../AxoisInstance";
import type { Location } from "@/shared/types/locations";

const LOCATIONS_ROUTE = "/v1/Rooms";
// const EVENT_LOCATIONS_ROUTE = "/v1/EventRooms";

export class LocationsApi {
  async getLocations(pageIndex: number = 1, pageSize: number = 100, nameKey?: string, capacity?: number, orderBy?: string): Promise<Location[]> {
    let orderByField: string | undefined;
    let isDesc = false;
    if (orderBy) {
      const [field, direction] = orderBy.split(" ");
      orderByField = field;
      isDesc = direction?.toLowerCase() === "desc";
    }
    const queryParams = {
        page: pageIndex,
        count: pageSize,
        ...(nameKey ? { Name: nameKey } : {}),
        ...(capacity ? { Capacity: capacity } : {}),
        ...(orderByField ? { OrderBy: orderByField } : {}),
        ...(isDesc ? { Descending: isDesc } : {}),
    };
    const { data } = await systemApi.get(
      `${LOCATIONS_ROUTE}`,
      { params: queryParams }
    );
    return data.data.items;
  }
}

export const locationsApi = new LocationsApi();