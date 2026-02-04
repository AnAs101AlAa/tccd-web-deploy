/**
 * Represents a location entity in the system
 * Locations can be linked to multiple events
 */
export interface Location {
  id: string;
  name: string;
  capacity: number;
  roomImage: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload for creating a new location
 */
export interface CreateLocationPayload {
  name: string;
  capacity: number;
  roomImageFileId: string;
}

/**
 * Payload for updating an existing location
 */
export interface UpdateLocationPayload {
  id?: string;
  name: string;
  capacity: number;
}

/**
 * Response from location API endpoints
 */
export interface LocationResponse {
  data: Location | Location[];
  message?: string;
  success: boolean;
}
