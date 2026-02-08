import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "./eventsApi";
import type Event from "@/shared/types/events";

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["events", "create"],
    mutationFn: (data: Event) => eventsApi.createEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["events", "update"],
    mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) => 
      eventsApi.updateEvent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
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
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useAddEventMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["events", "addMedia"],
    mutationFn: ({ eventId, mediaFileIds }: { eventId: string; mediaFileIds: string[] }) =>
      eventsApi.addEventMedia(eventId, mediaFileIds),
    onSuccess: (_, { eventId }) => {
      queryClient.invalidateQueries({ queryKey: ["events", "detail", eventId] });
    },
  });
};

export const useDeleteEventMedia = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationKey: ["events", "deleteMedia"],
    mutationFn: (eventMediaId: string) => eventsApi.deleteEventMedia(eventMediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export const useFetchEvents = (page: number, limit: number, nameKey?: string, type?: string, startDate?: string, endDate?: string, location?: string, orderBy?: string) => {
  return useQuery({
    queryKey: ["events", "fetch", page, limit, nameKey, type, startDate, endDate, location, orderBy],
    queryFn: () => eventsApi.fetchEvent(page, limit, nameKey, type, startDate, endDate, location, orderBy),
  });
}

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["events", "delete"],
    mutationFn: (id: string) => eventsApi.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    }
  });
}
