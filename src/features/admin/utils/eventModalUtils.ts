import type Event from "@/shared/types/events";
import type { EventSlot } from "@/shared/types/events";
import { eventFormSchema } from "./eventFormSchema";
import { useGetLocations } from "@/shared/queries/admin/locations/locationsQueries";
import { useEffect, useState } from "react";
import EVENT_TYPES from "@/constants/EventTypes";
import { useCreateEvent, useUpdateEvent, useUpdateEventPoster, useAddEventMedia, useDeleteEventMedia, useAddSponsorToEvent, useRemoveSponsorFromEvent, useAddEventSlot, useRemoveEventSlot } from "@/shared/queries/admin/events/eventsQueries";
import toast from "react-hot-toast";  
import { useGetCompanies } from "@/shared/queries/companies";
import { useGetEventSponsors } from "@/shared/queries/events";
import { useQueryClient } from "@tanstack/react-query";

const extractDriveId = (urlOrId: string): string => {
  if (!urlOrId) return "";

  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /\/folders\/([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/open\?id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match) return match[1];
  }
  return urlOrId;
};

const validateAllFields = (formValues: Event) => {
  const result = eventFormSchema.safeParse(formValues);
  const errors: Partial<Record<keyof Event, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof typeof errors;
      errors[key] = issue.message;
    }
  }
  return errors;
};

export default function useEventModalUtils({event, onClose}: {event?: Event; onClose: () => void;}) {
  const queryClient = useQueryClient();

  const [locationNameKey, setLocationNameKey] = useState<string|undefined>(undefined);
  const [companyNameKey, setCompanyNameKey] = useState<string|undefined>(undefined);

  const { data: locations, isLoading: locationsLoading } = useGetLocations(
    1,
    100,
    locationNameKey,
  );
  const { data: companies, isLoading: companiesLoading } = useGetCompanies(
    1,
    100,
    companyNameKey,
  );
  const { data: eventSponsors } = useGetEventSponsors(event?.id || "");

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const updateEventPosterMutation = useUpdateEventPoster();
  const addEventMediaMutation = useAddEventMedia();
  const deleteEventMediaMutation = useDeleteEventMedia();
  const addSponsorToEventMutation = useAddSponsorToEvent();
  const removeSponsorFromEventMutation = useRemoveSponsorFromEvent();
  const addEventSlotMutation = useAddEventSlot();
  const removeEventSlotMutation = useRemoveEventSlot();

  const isEditMode = !!event;
  const [originalMedia, setOriginalMedia] = useState<any[]>([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);
  const [newMediaIds, setNewMediaIds] = useState<string[]>([]);
  const [, setOriginalPosterId] = useState<string>("");
  const [formValues, setFormValues] = useState<Event>({
    id: "",
    name: "",
    description: "",
    isApproved: true,
    eventImage: "",
    type: EVENT_TYPES[0].value,
    registrationDeadline: "",
    eventMedia: [],
    date: "",
    locations: [],
    capacity: 0,
    registeredCount: 0,
    attendeeCount: 0,
    sponsors: [],
    slots: [],
  });
  const [errors, setErrors] = useState<{ [key in keyof Event]?: string }>({});

  const [isAddingMedia, setIsAddingMedia] = useState<boolean>(false);
  const [currentMediaInput, setCurrentMediaInput] = useState<string>("");

  const [isAddingSlot, setIsAddingSlot] = useState<boolean>(false);
  const [currentSlotInput, setCurrentSlotInput] = useState<EventSlot>({id: "", startTime: "", endTime: "" });

  useEffect(() => {
    if (event) {
      const posterId = extractDriveId(event.eventImage || "");
      setOriginalPosterId(posterId);

      const mediaArray = event.eventMedia || (event as any).medias || [];

      if (Array.isArray(mediaArray) && mediaArray.length > 0) {
        const firstItem = mediaArray[0];
        if (firstItem && typeof firstItem === "object" && "id" in firstItem) {
          setOriginalMedia(mediaArray as any[]);
        } else {
          setOriginalMedia([]);
        }
      } else {
        setOriginalMedia([]);
      }

      setDeletedMediaIds([]);
      setNewMediaIds([]);

      const roomsArray = (event as any).rooms || event.locations || [];
      const locationIds = Array.isArray(roomsArray)
        ? roomsArray.map((loc: any) => (typeof loc === "string" ? loc : loc.id))
        : [];

      setFormValues({
        ...event,
        eventImage: extractDriveId(event.eventImage || ""),
        locations: locationIds,
        eventMedia: [],
        capacity: event.capacity || 0,
        sponsors: eventSponsors || [],
        slots: event.slots || [],
      });
    }
  }, [event]);

  const handleInputChange = (field: keyof Event, value: string | number) => {
    const finalValue =
      field === "eventImage" && typeof value === "string"
        ? extractDriveId(value)
        : value;

    setFormValues((prev: Event) => ({ ...prev, [field]: finalValue }));

    if (errors[field as keyof Event]) {
      setErrors((prev: { [key in keyof Event]?: string }) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleAddMedia = (url: string) => {
    const driveId = extractDriveId(url);
    setNewMediaIds((prev) => [...prev, driveId]);
  };

  const handleRemoveOriginalMedia = (mediaId: string) => {
    setDeletedMediaIds((prev) => [...prev, mediaId]);
  };

  const handleRemoveNewMedia = (index: number) => {
    setNewMediaIds((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleAddSlot = () => {
    if (!formValues.date) {
      toast.error("Please select event date first.");
      return;
    }
    
    if (!currentSlotInput.startTime || !currentSlotInput.endTime) {
      toast.error("Please select both start and end times.");
      return;
    }

    const [startHour, startMin] = currentSlotInput.startTime.split(':').map(Number);
    const [endHour, endMin] = currentSlotInput.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    
    if (startMinutes >= endMinutes) {
      toast.error("Start time must be before end time.");
      return;
    }
    
    const eventDate = new Date(formValues.date);    
    const startDate = new Date(eventDate);
    startDate.setHours(startHour, startMin, 0, 0);
    
    const endDate = new Date(eventDate);
    endDate.setHours(endHour, endMin, 0, 0);
    
    const slotWithTimestamp = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15),
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
    };
    
    setFormValues((prev) => ({
      ...prev,
      slots: [...(prev.slots || []), slotWithTimestamp],
    }));
    setCurrentSlotInput({ id: "", startTime: "", endTime: "" });
    setIsAddingSlot(false);
  }

  const handleRemoveSlot = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      slots: prev.slots?.filter((_, i) => i !== index),
    }));
  }

  const handleSave = async () => {
    const registrationDeadlineDate = formValues.date ? new Date(formValues.date) : new Date();
    registrationDeadlineDate.setDate(registrationDeadlineDate.getDate() - 2);

    const finalizedValue = {
      ...formValues,
      date: formValues.date ? new Date(formValues.date).toISOString() : "",
      media: newMediaIds,
      eventMedia: newMediaIds,
      registrationDeadline: registrationDeadlineDate.toISOString(),
      eventImage: formValues.eventImage || "",
    };

    const validationErrors = validateAllFields(finalizedValue);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix all errors before saving.");
      console.error("Validation errors:", validationErrors);
      return;
    }

    try {
      if (isEditMode && event) {
        await updateEventMutation.mutateAsync({
          id: event.id,
          data: finalizedValue,
        });

        if (formValues.eventImage) {
          await updateEventPosterMutation.mutateAsync({
            id: event.id,
            fileId: formValues.eventImage,
          });
        }

        for (const mediaId of deletedMediaIds) {
          await deleteEventMediaMutation.mutateAsync(mediaId);
        }

        if (newMediaIds.length > 0) {
          await addEventMediaMutation.mutateAsync({
            eventId: event.id,
            mediaFileIds: newMediaIds,
          });
        }

        for (const sponsor of formValues.sponsors || []) {
          if (!eventSponsors?.find((s) => s.id === sponsor.id)) {
            await addSponsorToEventMutation.mutateAsync({
              eventId: event.id,
              companyId: sponsor.id,
            });
          }
        }

        for (const sponsor of eventSponsors || []) {
          if (!formValues.sponsors?.find((s) => s.id === sponsor.id)) {
            await removeSponsorFromEventMutation.mutateAsync({
              eventId: event.id,
              companyId: sponsor.id,
            });
          }
        }

        for (const slot of formValues.slots || []) {
          if (!event.slots?.find((s) => s.startTime === slot.startTime && s.endTime === slot.endTime)) {
            await addEventSlotMutation.mutateAsync({ eventId: event.id, startTime: slot.startTime, endTime: slot.endTime });
          }
        }

        for (const slot of event.slots || []) {
          if (!formValues.slots?.find((s) => s.startTime === slot.startTime && s.endTime === slot.endTime)) {
            await removeEventSlotMutation.mutateAsync({ eventId: event.id, slotId: slot.id || "" });
          }
        }

        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event updated successfully!");
        onClose();
      } else {
        const createdEvent =
          await createEventMutation.mutateAsync(finalizedValue);
        const eventId = createdEvent?.id || createdEvent?.data?.id;

        if (eventId) {
          if (formValues.eventImage) {
            await updateEventPosterMutation.mutateAsync({
              id: eventId,
              fileId: formValues.eventImage,
            });
          }

          if (newMediaIds.length > 0) {
            await addEventMediaMutation.mutateAsync({
              eventId: eventId,
              mediaFileIds: newMediaIds,
            });
          }
        }
        
        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event created successfully!");
        onClose();
      }
    } catch (error) {
      toast.error(
        isEditMode
          ? "Failed to update event. Please try again."
          : "Failed to create event. Please try again.",
      );
      console.error("Event save error:", error);
    }
  };

  return {
    formValues,
    setFormValues,
    handleInputChange,
    isSubmitting:
      createEventMutation.isPending ||
      updateEventMutation.isPending ||
      updateEventPosterMutation.isPending ||
      addEventMediaMutation.isPending ||
      deleteEventMediaMutation.isPending,
    errors,
    locations: locations || [],
    locationsLoading,
    locationNameKey,
    setLocationNameKey,
    companiesLoading,
    companyNameKey,
    setCompanyNameKey,
    companies: companies?.data.items || [],
    isEditMode,
    isAddingMedia,
    setIsAddingMedia,
    isAddingSlot,
    setIsAddingSlot,
    currentSlotInput,
    setCurrentSlotInput,
    currentMediaInput,
    setCurrentMediaInput,
    handleAddMedia,
    handleRemoveNewMedia,
    handleRemoveOriginalMedia,
    handleAddSlot,
    handleRemoveSlot,
    handleSave,
    originalMedia,
    newMediaIds,
    deletedMediaIds,
  };
}
