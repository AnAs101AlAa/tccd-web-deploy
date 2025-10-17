import { useQuery } from "@tanstack/react-query";
import { eventApi } from "./eventApi";

export const eventKeys = {
  all: ["events"] as const,
  upcoming: () => [...eventKeys.all, "upcoming"] as const,
  past: () => [...eventKeys.all, "past"] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
};

export const useGetAllUpcomingEvents = () => {
  return useQuery({
    queryKey: eventKeys.upcoming(),
    queryFn: () => eventApi.getAllUpcomingEvents(),
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
    queryFn: () => eventApi.getEventById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
