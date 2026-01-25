import { useQuery } from "@tanstack/react-query";
import { eventApi } from "./eventApi";
import eventDetails from "@/features/events/data/dummyEventDetails";
import type { EventQueryParams } from "@/shared/types";

export const eventKeys = {
  all: ["events"] as const,
  upcoming: () => [...eventKeys.all, "upcoming"] as const,
  past: () => [...eventKeys.all, "past"] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
};

export const useGetAllUpcomingEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: [eventKeys.upcoming(), params],
    queryFn: () => eventApi.getAllUpcomingEvents(params),
    staleTime: 5 * 60 * 1000, 
  });
};

export const useGetAllPastEvents = () => {
  return useQuery({
    queryKey: eventKeys.past(),
    queryFn: () => eventApi.getAllPastEvents(),
    staleTime: 5 * 60 * 1000, 
  });
};

export const useGetEventById = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    // TODO: Replace with eventApi.getEventById(id) when backend endpoint is ready
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const event = eventDetails.find((item) => item.id === id);
      if (!event) {
        throw new Error("Event not found");
      }
      return event;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
