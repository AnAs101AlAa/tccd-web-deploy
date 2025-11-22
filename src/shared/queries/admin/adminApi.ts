import { systemApi } from "../AxoisInstance";
import type {
  Location,
  CreateLocationPayload,
  UpdateLocationPayload,
} from "./types";

/**
 * Base route for admin location endpoints
 * TODO: Replace with actual backend endpoint when available
 */
const LOCATION_ROUTE = "/v1/admin/locations";

/**
 * API class for managing location-related operations
 * Uses dummy endpoints that can be replaced with actual backend URLs
 */
export class LocationApi {
  /**
   * Retrieves all locations from the system
   * @returns Promise<Location[]> Array of all locations
   */
  async getAllLocations(): Promise<Location[]> {
    const response = await systemApi.get(LOCATION_ROUTE);
    return response.data;
  }

  /**
   * Retrieves a specific location by ID
   * @param id - Unique identifier of the location
   * @returns Promise<Location> Location details
   */
  async getLocationById(id: string): Promise<Location> {
    const response = await systemApi.get(`${LOCATION_ROUTE}/${id}`);
    return response.data;
  }

  /**
   * Creates a new location in the system
   * @param payload - Location data to create
   * @returns Promise<Location> Created location with generated ID
   */
  async createLocation(payload: CreateLocationPayload): Promise<Location> {
    const response = await systemApi.post(LOCATION_ROUTE, payload);
    return response.data;
  }

  /**
   * Updates an existing location
   * @param id - Unique identifier of the location to update
   * @param payload - Updated location data
   * @returns Promise<Location> Updated location details
   */
  async updateLocation(
    id: string,
    payload: UpdateLocationPayload
  ): Promise<Location> {
    const response = await systemApi.patch(`${LOCATION_ROUTE}/${id}`, payload);
    return response.data;
  }

  /**
   * Deletes a location from the system
   * @param id - Unique identifier of the location to delete
   * @returns Promise<void>
   */
  async deleteLocation(id: string): Promise<void> {
    await systemApi.delete(`${LOCATION_ROUTE}/${id}`);
  }
}

export const locationApi = new LocationApi();
