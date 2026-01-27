import { useQuery } from "@tanstack/react-query";
import { eventApi } from "./eventApi";
import eventDetails from "@/features/events/data/dummyEventDetails";
import type { EventQueryParams } from "@/shared/types";

export const eventKeys = {
  all: ["events"] as const,
  upcoming: () => [...eventKeys.all, "upcoming"] as const,
  past: (page?: number, pageSize?: number, filters?: any) => 
    [...eventKeys.all, "past", page, pageSize, filters] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
  sponsors: (eventId: string) => [...eventKeys.all, "sponsors", eventId] as const,
};

export const useGetAllUpcomingEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: [eventKeys.upcoming(), params],
    queryFn: () => eventApi.getAllUpcomingEvents(params),
    staleTime: 5 * 60 * 1000, 
  });
};

export const useGetAllPastEvents = (
  pageNumber: number = 1,
  pageSize: number = 12,
  filters?: {
    searchQuery?: string;
    eventTypes?: string[];
    startDate?: string;
    endDate?: string;
  }
) => {
  return useQuery({
    queryKey: eventKeys.past(pageNumber, pageSize, filters),
    queryFn: () => eventApi.getAllPastEvents(pageNumber, pageSize, filters),
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

export const useGetEventSponsors = (eventId: string) => {
  return useQuery({
    queryKey: eventKeys.sponsors(eventId),
    queryFn: () => eventApi.getSponsorsByEventId(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};
