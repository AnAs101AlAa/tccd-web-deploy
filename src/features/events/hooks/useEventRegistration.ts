import {
  useGetEventById,
  useCheckEligibility,
  useRegisterForEvent,
} from "@/shared/queries/events";
import { useMemo } from "react";
import format from "@/shared/utils/dateFormater";

/**
 * useEventRegistration Hook
 *
 * Fetches event details, checks registration eligibility,
 * and exposes a registration mutation — all by event ID.
 *
 * @param eventId - The event ID from the route params
 */
export const useEventRegistration = (eventId: string) => {
  // Event details
  const {
    data: event,
    isLoading: isLoadingEvent,
    error: eventError,
  } = useGetEventById(eventId);

  // Eligibility check
  const {
    data: eligibility,
    isLoading: isCheckingEligibility,
    error: eligibilityError,
  } = useCheckEligibility(eventId);

  // Registration mutation
  const registerMutation = useRegisterForEvent();

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

  const isEligible = eligibility?.isEligible ?? false;
  const eligibilityReason = eligibility?.reason;

  const register = (slotId: string) => {
    registerMutation.mutate({ eventId, eventSlotId: slotId });
  };

  return {
    // Event data
    event,
    hasSlots,
    slotOptions,

    // Eligibility
    isEligible,
    eligibilityReason,
    isCheckingEligibility,

    // Registration mutation
    register,
    isRegistering: registerMutation.isPending,
    isRegistered: registerMutation.isSuccess,
    registrationError: registerMutation.error,

    // General loading / error
    isLoading: isLoadingEvent || isCheckingEligibility,
    error: eventError || eligibilityError,
  };
};
