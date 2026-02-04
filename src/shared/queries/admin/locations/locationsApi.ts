import { systemApi } from "../../AxoisInstance";
import type {
  Location,
  CreateLocationPayload,
  UpdateLocationPayload,
} from "@/shared/queries/admin/types";

const LOCATIONS_ROUTE = "/v1/Rooms";
// const EVENT_LOCATIONS_ROUTE = "/v1/EventRooms";

export class LocationsApi {
  async getLocations(
    pageIndex: number = 1,
    pageSize: number = 100,
    nameKey?: string,
    capacity?: number,
    orderBy?: string,
  ): Promise<Location[]> {
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
    const { data } = await systemApi.get(`${LOCATIONS_ROUTE}`, {
      params: queryParams,
    });
    return data.data.items;
  }

  async createLocation(payload: CreateLocationPayload): Promise<Location> {
    const { data } = await systemApi.post(LOCATIONS_ROUTE, payload);
    return data.data;
  }

  async updateLocation(
    id: string,
    payload: UpdateLocationPayload,
  ): Promise<Location> {
    const { data } = await systemApi.patch(`${LOCATIONS_ROUTE}/${id}`, payload);
    return data.data;
  }

  async deleteLocation(id: string): Promise<void> {
    await systemApi.delete(`${LOCATIONS_ROUTE}/${id}`);
  }

  async getLocationById(id: string): Promise<Location> {
    const { data } = await systemApi.get(`${LOCATIONS_ROUTE}/${id}`);
    return data.data;
  }
}

export const locationsApi = new LocationsApi();
