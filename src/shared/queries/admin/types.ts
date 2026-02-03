/**
 * Represents a location entity in the system
 * Locations can be linked to multiple events
 */
export interface Location {
  id: string;
  name: string;
  capacity: number;
  roomImage: string;
  address?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Payload for creating a new location
 */
export interface CreateLocationPayload {
  name: string;
  capacity: number;
  roomImage: string;
  address?: string; // Optional in UI, check if API needs it
  description?: string;
}

/**
 * Payload for updating an existing location
 */
export interface UpdateLocationPayload {
  name?: string;
  capacity?: number;
  roomImage?: string;
  address?: string;
  description?: string;
}

/**
 * Response from location API endpoints
 */
export interface LocationResponse {
  data: Location | Location[];
  message?: string;
  success: boolean;
}
