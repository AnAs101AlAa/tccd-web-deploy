import { useGetEventById } from "@/shared/queries/events";
import { useMemo } from "react";
import format from "@/shared/utils/dateFormater";

/**
 * useEventRegistration Hook
 *
 * Fetches event details by ID and derives slot dropdown options.
 * Exposes a `hasSlots` boolean for data-driven conditional rendering.
 *
 * @param eventId - The event ID from the route params
 */
export const useEventRegistration = (eventId: string) => {
  const {
    data: event,
    isLoading,
    error,
  } = useGetEventById(eventId);

  const hasSlots = useMemo(
    () => !!event?.slots && event.slots.length > 0,
    [event?.slots],
  );

  const slotOptions = useMemo(() => {
    if (!event?.slots) return [];
    return event.slots.map((slot) => ({
      label: `${format(slot.startTime, "hourFull")} – ${format(slot.endTime, "hourFull")}`,
      value: slot.id,
    }));
  }, [event?.slots]);

  return {
    event,
    hasSlots,
    slotOptions,
    isLoading,
    error,
  };
};
