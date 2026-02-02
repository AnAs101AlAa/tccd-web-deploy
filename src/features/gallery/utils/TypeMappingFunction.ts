import type { EventMedia } from "@/shared/types";
import type { MediaItem } from "tccd-ui";

const getMediaTypeFromUrl = (url: string): "image" | "video" => {
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".bmp",
    ".svg",
  ];
  const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi", ".mkv"];

  const lowercaseUrl = url.toLowerCase();

  if (videoExtensions.some((ext) => lowercaseUrl.endsWith(ext))) {
    return "video";
  }
  else if (imageExtensions.some((ext) => lowercaseUrl.endsWith(ext))) {
    return "image";
  }
  return "image"
};

export const mapEventMediaToMediaItem = (eventMedia: EventMedia): MediaItem => {
  return {
    id: eventMedia.id,
    src: eventMedia.mediaUrl,
    type: getMediaTypeFromUrl(eventMedia.mediaUrl),
    alt: `Media for event ${eventMedia.eventId}`,
  };
};

export const mapEventMediaList = (mediaList: EventMedia[]): MediaItem[] => {
  return mediaList.map(mapEventMediaToMediaItem);
};
