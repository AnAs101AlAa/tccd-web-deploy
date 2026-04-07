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

export const useAddSponsorToEvent = () => {
  return useMutation({
    mutationKey: ["events", "addSponsor"],
    mutationFn: ({ eventId, companyId }: { eventId: string; companyId: string }) =>
      eventsApi.addSponsorToEvent(eventId, companyId),
  });
};

export const useRemoveSponsorFromEvent = () => {
  return useMutation({
    mutationKey: ["events", "removeSponsor"],
    mutationFn: ({ eventId, companyId }: { eventId: string; companyId: string }) =>
      eventsApi.removeSponsorFromEvent(eventId, companyId),
  });
};

export const useAddEventSlot = () => {
  return useMutation({
    mutationKey: ["events", "addSlot"],
    mutationFn: ({ eventId, payload }: { eventId: string; payload: { title?: string; description?: string; startTime: string; endTime: string; capacity: number } }) =>
      eventsApi.addEventSlot(eventId, payload),
  });
}

export const useUpdateEventSlot = () => {
  return useMutation({
    mutationKey: ["events", "updateSlot"],
    mutationFn: ({ eventId, slotId, payload }: { eventId: string; slotId: string; payload: { title?: string; description?: string; startTime: string; endTime: string; capacity: number } }) =>
      eventsApi.updateEventSlot(eventId, slotId, payload),
  });
}

export const useRemoveEventSlot = () => {
  return useMutation({
    mutationKey: ["events", "removeSlot"],
    mutationFn: ({ eventId, slotId }: { eventId: string; slotId: string }) =>
      eventsApi.removeEventSlot(eventId, slotId)
  });
}

export const useGetEventRegistrations = (eventId: string, pageNumber: number, pageSize: number, slotId?: string) => {
  return useQuery({
    queryKey: ["events", "registrations", eventId, pageNumber, pageSize, slotId],
    queryFn: () => eventsApi.getEventRegistrations(eventId, pageNumber, pageSize, slotId),
  });
};
