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
  roomImageFileId: string;
}

/**
 * Response from location API endpoints
 */
export interface LocationResponse {
  items: Location[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface LocationsQueryParams {
  PageNumber: number;
  PageSize: number;
  Name?: string;
  Capacity?: number;
  OrderBy?: string;
  Descending?: boolean;
}
