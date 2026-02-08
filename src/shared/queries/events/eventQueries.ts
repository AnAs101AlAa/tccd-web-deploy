import { useQuery } from "@tanstack/react-query";
import { eventApi } from "./eventApi";
import type { EventQueryParams } from "@/shared/types";

export const eventKeys = {
  all: ["events"] as const,
  upcoming: (params?: EventQueryParams) =>
    [...eventKeys.all, "upcoming", params] as const,
  past: (params?: EventQueryParams) =>
    [...eventKeys.all, "past", params] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
  sponsors: (eventId: string) =>
    [...eventKeys.all, "sponsors", eventId] as const,
};

export const useGetAllEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: () => eventApi.getAllEvents(params),
    staleTime: 5 * 60 * 1000,
  });
}

export const useGetAllUpcomingEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: eventKeys.upcoming(params),
    queryFn: () => eventApi.getAllUpcomingEvents(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetAllPastEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: eventKeys.past(params),
    queryFn: () => eventApi.getAllPastEvents(params),
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
