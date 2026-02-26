import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventApi } from "./eventApi";
import { eventRegisterApi } from "./eventRegisterApi";
import type { EventQueryParams } from "@/shared/types";
import { getErrorMessage } from "@/shared/utils/errorHandler";
import toast from "react-hot-toast";

export const eventKeys = {
  all: ["events"] as const,
  allWithParams: (params?: EventQueryParams) =>
    [...eventKeys.all, "allEvents", params] as const,
  upcoming: (params?: EventQueryParams) =>
    [...eventKeys.all, "upcoming", params] as const,
  past: (params?: EventQueryParams) =>
    [...eventKeys.all, "past", params] as const,
  detail: (id: string) => [...eventKeys.all, "detail", id] as const,
  sponsors: (eventId: string) =>
    [...eventKeys.all, "sponsors", eventId] as const,
  eligibility: (eventId: string) =>
    [...eventKeys.all, "eligibility", eventId] as const,
};

export const useGetAllEvents = (params?: EventQueryParams) => {
  return useQuery({
    queryKey: eventKeys.allWithParams(params),
    queryFn: () => {
      return eventApi.getAllEvents(params);
    },
    staleTime: 5 * 60 * 1000,
  });
};

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

export const useCheckEligibility = (eventId: string) => {
  return useQuery({
    queryKey: eventKeys.eligibility(eventId),
    queryFn: () => eventRegisterApi.checkEligibility(eventId),
    enabled: !!eventId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useRegisterForEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      eventId,
      eventSlotId,
    }: {
      eventId: string;
      eventSlotId: string;
    }) => eventRegisterApi.registerForEvent(eventId, eventSlotId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: eventKeys.detail(variables.eventId),
      });
      queryClient.invalidateQueries({
        queryKey: eventKeys.eligibility(variables.eventId),
      });
      toast.success("Registration successful! 🎉");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
};
