import {
  useGetAllUpcomingEvents,
  useGetAllPastEvents,
} from "@/shared/queries/events";
import type { EventQueryParams } from "@/shared/types";

/**
 * Custom hook to fetch upcoming and past events
 * Returns loading states, error states, and event data
 */
export const useEvents = (params? : EventQueryParams, dontFilterOnPast?: boolean) => {
  // Fetch upcoming events
  const {
    data: upcomingEvents,
    isLoading: isLoadingUpcoming,
    error: upcomingError,
    refetch: refetchUpcoming,
  } = useGetAllUpcomingEvents(params);

  // Fetch past events
  const {
    data: pastEvents,
    isLoading: isLoadingPast,
    error: pastError,
    refetch: refetchPast,
  } = useGetAllPastEvents(dontFilterOnPast ? {PageSize: 6} : params);

  // Combined loading state
  const isLoading = isLoadingUpcoming || isLoadingPast;

  // Combined error state
  const error = upcomingError || pastError;

  // Refetch both
  const refetchAll = () => {
    refetchUpcoming();
    refetchPast();
  };

  return {
    // Data
    upcomingEvents: upcomingEvents,
    pastEvents: pastEvents,

    // Loading states
    isLoading,
    isLoadingUpcoming,
    isLoadingPast,

    // Error states
    error,
    upcomingError,
    pastError,

    // Actions
    refetchAll,
    refetchUpcoming,
    refetchPast,
  };
};
