import type { EventRequest } from "@/shared/types/events";
import type { EventSlot } from "@/shared/types/events";
import { eventFormSchema } from "./eventFormSchema";
import { useGetLocations } from "@/shared/queries/admin/locations/locationsQueries";
import { useEffect, useState } from "react";
import {
  useCreateEvent,
  useUpdateEvent,
  useUpdateEventPoster,
  useAddEventMedia,
  useDeleteEventMedia,
  useAddSponsorToEvent,
  useRemoveSponsorFromEvent,
  useAddEventSlot,
  useUpdateEventSlot,
  useRemoveEventSlot,
  useFetchEvents
} from "@/shared/queries/admin/events/eventsQueries";
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

const validateAllFields = (formValues: EventRequest) => {
  const result = eventFormSchema.safeParse(formValues);
  const errors: Partial<Record<keyof EventRequest, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as keyof typeof errors;
      errors[key] = issue.message;
    }
  }
  return errors;
};

export default function useEventModalUtils({
  event,
  onClose,
}: {
  event?: EventRequest;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();

  const [locationNameKey, setLocationNameKey] = useState<string | undefined>(
    undefined,
  );
  const [companyNameKey, setCompanyNameKey] = useState<string | undefined>(
    undefined,
  );

  const [parentEventNameKey, setParentEventNameKey] = useState<string | undefined>(undefined);

  const { data: locations, isLoading: locationsLoading } = useGetLocations({
    PageNumber: 1,
    PageSize: 100,
    Name: locationNameKey,
  });
  const { data: companies, isLoading: companiesLoading } = useGetCompanies(
    1,
    100,
    companyNameKey,
  );
  const { data: eventSponsors } = useGetEventSponsors(event?.id || "");

  const [currentEventsPage, setCurrentEventsPage] = useState<number>(1);
  const { data: eventsData, isLoading: isParentEventsLoading } = useFetchEvents(currentEventsPage, 20, parentEventNameKey);

  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const updateEventPosterMutation = useUpdateEventPoster();
  const addEventMediaMutation = useAddEventMedia();
  const deleteEventMediaMutation = useDeleteEventMedia();
  const addSponsorToEventMutation = useAddSponsorToEvent();
  const removeSponsorFromEventMutation = useRemoveSponsorFromEvent();
  const addEventSlotMutation = useAddEventSlot();
  const updateEventSlotMutation = useUpdateEventSlot();
  const removeEventSlotMutation = useRemoveEventSlot();

  const isEditMode = !!event;
  const [originalMedia, setOriginalMedia] = useState<any[]>([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);
  const [newMediaIds, setNewMediaIds] = useState<string[]>([]);
  const [, setOriginalPosterId] = useState<string>("");
  const [originalSlots, setOriginalSlots] = useState<EventSlot[]>([]);
  const [formValues, setFormValues] = useState<EventRequest>({
    id: "",
    name: "",
    description: "",
    isApproved: false,
    autoApproval: false,
    hasWaitingList: false,
    eventImage: "",
    type: undefined,
    eventMedia: [],
    date: "",
    locations: [],
    capacity: 0,
    registeredCount: 0,
    attendeeCount: 0,
    sponsors: [],
    slots: [],
    parentEventId: undefined,
  });
  
  const [errors, setErrors] = useState<{ [key in keyof EventRequest]?: string }>({});

  const [isAddingMedia, setIsAddingMedia] = useState<boolean>(false);
  const [currentMediaInput, setCurrentMediaInput] = useState<string>("");

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

      const totalCapacity = event.slots?.reduce((sum, slot) => sum + (slot.capacity || 0), 0) || 0;
      setFormValues({
        ...event,
        eventImage: extractDriveId(event.eventImage || ""),
        locations: locationIds,
        eventMedia: [],
        capacity: totalCapacity,
        sponsors: eventSponsors || [],
        slots: event.slots || [],
      });
      setOriginalSlots(event.slots || []);
    }
  }, [event, eventSponsors]);

  const handleInputChange = (field: keyof EventRequest, value: string | number) => {
    const finalValue =
      field === "eventImage" && typeof value === "string"
        ? extractDriveId(value)
        : value;

    setFormValues((prev: EventRequest) => ({ ...prev, [field]: finalValue }));

    if (errors[field as keyof EventRequest]) {
      setErrors((prev: { [key in keyof EventRequest]?: string }) => ({
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

  const handleAddSlot = (slot: EventSlot) => {
    setFormValues((prev) => {
      const updatedSlots = [...(prev.slots || []), slot];
      const totalCapacity = updatedSlots.reduce((sum, s) => sum + (s.capacity || 0), 0);
      return {
        ...prev,
        slots: updatedSlots,
        capacity: totalCapacity,
      };
    });
  };

  const handleUpdateSlot = (index: number, slot: EventSlot) => {
    setFormValues((prev) => {
      const updatedSlots = [...(prev.slots || [])];
      updatedSlots[index] = slot;
      const totalCapacity = updatedSlots.reduce((sum, s) => sum + (s.capacity || 0), 0);
      return {
        ...prev,
        slots: updatedSlots,
        capacity: totalCapacity,
      };
    });
  };

  const handleRemoveSlot = (index: number) => {
    setFormValues((prev) => {
      const updatedSlots = prev.slots?.filter((_, i) => i !== index) || [];
      const totalCapacity = updatedSlots.reduce((sum, slot) => sum + (slot.capacity || 0), 0);
      return {
        ...prev,
        slots: updatedSlots,
        capacity: totalCapacity,
      };
    });
  };

  const handleSave = async () => {
    const finalizedValue = {
      ...formValues,
      date: formValues.date ? new Date(formValues.date).toISOString() : "",
      media: newMediaIds,
      eventMedia: newMediaIds,
      eventImage: formValues.eventImage || "",
      type: formValues.type || "",
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
            eventId: event.id,
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

        const currentSlots = formValues.slots || [];
        const originalSlotIds = new Set(originalSlots.map((slot) => slot.id));
        const currentSlotIds = new Set(currentSlots.map((slot) => slot.id));

        const removedSlots = originalSlots.filter((slot) => !currentSlotIds.has(slot.id));
        for (const slot of removedSlots) {
          await removeEventSlotMutation.mutateAsync({
            eventId: event.id,
            slotId: slot.id,
          });
        }

        const addedSlots = currentSlots.filter((slot) => !originalSlotIds.has(slot.id));
        for (const slot of addedSlots) {
          await addEventSlotMutation.mutateAsync({
            eventId: event.id,
            payload: {
              title: slot.title,
              description: slot.description,
              startTime: slot.startTime,
              endTime: slot.endTime,
              capacity: slot.capacity,
            },
          });
        }

        const updatedSlots = currentSlots.filter((slot) => originalSlotIds.has(slot.id));
        for (const slot of updatedSlots) {
          const originalSlot = originalSlots.find((s) => s.id === slot.id);
          if (!originalSlot) continue;

          const changed =
            originalSlot.title !== slot.title ||
            originalSlot.description !== slot.description ||
            originalSlot.startTime !== slot.startTime ||
            originalSlot.endTime !== slot.endTime ||
            originalSlot.capacity !== slot.capacity;

          if (changed) {
            await updateEventSlotMutation.mutateAsync({
              eventId: event.id,
              slotId: slot.id,
              payload: {
                title: slot.title,
                description: slot.description,
                startTime: slot.startTime,
                endTime: slot.endTime,
                capacity: slot.capacity,
              },
            });
          }
        }

        queryClient.invalidateQueries({ queryKey: ["events"] });
        toast.success("Event updated successfully!");
        onClose();

      } else {
        const createdEvent =
          await createEventMutation.mutateAsync(finalizedValue);
        const eventId = createdEvent?.id;

        if (eventId) {
          if (formValues.eventImage) {
            await updateEventPosterMutation.mutateAsync({
              eventId: eventId,
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
      deleteEventMediaMutation.isPending ||
      addEventSlotMutation.isPending ||
      updateEventSlotMutation.isPending ||
      removeEventSlotMutation.isPending,
    errors,
    locations: locations?.items || [],
    locationsLoading,
    locationNameKey,
    setLocationNameKey,
    companiesLoading,
    companyNameKey,
    setCompanyNameKey,
    companies: companies?.data.items || [],
    parentEventNameKey,
    setParentEventNameKey,
    parentEvents: eventsData,
    isParentEventsLoading,
    currentEventsPage,
    setCurrentEventsPage,
    isEditMode,
    isAddingMedia,
    setIsAddingMedia,
    currentMediaInput,
    setCurrentMediaInput,
    handleAddMedia,
    handleRemoveNewMedia,
    handleRemoveOriginalMedia,
    handleAddSlot,
    handleUpdateSlot,
    handleRemoveSlot,
    handleSave,
    originalMedia,
    newMediaIds,
    deletedMediaIds,
  };
}
