import { systemApi } from "../AxoisInstance";
import type { EventGalleryCardProps } from "@/shared/types/galleyTypes";

const GALLERY_ROUTE = "/v1/gallery/";

export class GalleryApi {
  async getAllGallery(): Promise<EventGalleryCardProps[]> {
    const response = await systemApi.get(`${GALLERY_ROUTE}`);
    return response.data;
  }

  async getGalleryById(id: string): Promise<EventGalleryCardProps> {
    const response = await systemApi.get(`${GALLERY_ROUTE}${id}`);
    return response.data;
  }

  async getGalleryByEventType(
    eventType: string
  ): Promise<EventGalleryCardProps[]> {
    const response = await systemApi.get(`${GALLERY_ROUTE}type/${eventType}`);
    return response.data;
  }
}

export const galleryApi = new GalleryApi();
