import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "./eventsApi";
import type Event from "@/shared/types/events";

export const useCreateEvent = () => {
  return useMutation({
    mutationKey: ["events", "create"],
    mutationFn: (data: Event) => eventsApi.createEvent(data),
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["events", "update"],
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) => 
      eventsApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", "fetch"] });
    },
  });
};

export const useUpdateEventPoster = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["events", "updatePoster"],
    mutationFn: ({ id, fileId }: { id: string; fileId: string }) =>
      eventsApi.updateEventPoster(id, fileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events", "fetch"] });
    },
  });
};

export const useAddEventMedia = () => {
  return useMutation({
    mutationKey: ["events", "addMedia"],
    mutationFn: ({ eventId, mediaFileIds }: { eventId: string; mediaFileIds: string[] }) =>
      eventsApi.addEventMedia(eventId, mediaFileIds),
  });
};

export const useDeleteEventMedia = () => {
  return useMutation({
    mutationKey: ["events", "deleteMedia"],
    mutationFn: (eventMediaId: string) => eventsApi.deleteEventMedia(eventMediaId),
  });
};

export const useFetchEvents = (page: number, limit: number, nameKey?: string, type?: string, startDate?: string, endDate?: string, location?: string, orderBy?: string) => {
  return useQuery({
    queryKey: ["events", "fetch", page, limit, nameKey, type, startDate, endDate, location, orderBy],
    queryFn: () => eventsApi.fetchEvent(page, limit, nameKey, type, startDate, endDate, location, orderBy),
  });
}
