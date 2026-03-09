import { systemApi } from "../../AxoisInstance";
import type {
  Location,
  CreateLocationPayload,
  UpdateLocationPayload,
  LocationResponse,
  LocationsQueryParams,
} from "@/shared/queries/admin/types";

const LOCATIONS_ROUTE = "/v1/Rooms";
// const EVENT_LOCATIONS_ROUTE = "/v1/EventRooms";

export class LocationsApi {
  async getLocations(params: LocationsQueryParams): Promise<LocationResponse> {
    const { data } = await systemApi.get(`${LOCATIONS_ROUTE}`, {
      params,
    });
    return data.data;
  }

  async createLocation(payload: CreateLocationPayload): Promise<Location> {
    const { data } = await systemApi.post(LOCATIONS_ROUTE, payload);
    return data.data;
  }

  async updateLocation(
    id: string,
    payload: UpdateLocationPayload,
  ): Promise<Location> {
    const { data } = await systemApi.put(`${LOCATIONS_ROUTE}/${id}`, payload);
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
