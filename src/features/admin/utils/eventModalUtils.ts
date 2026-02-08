
import type Event from "@/shared/types/events";
import { eventFormSchema } from "./eventFormSchema";
import { useGetLocations } from "@/shared/queries/admin/locations/locationsQueries";
import { useEffect, useState } from "react";
import EVENT_TYPES from "@/constants/EventTypes";
import { useCreateEvent, useUpdateEvent, useUpdateEventPoster, useAddEventMedia, useDeleteEventMedia } from "@/shared/queries/admin/events/eventsQueries";
import toast from "react-hot-toast";  

// Extract Google Drive ID from full URL
const extractDriveId = (urlOrId: string): string => {
  if (!urlOrId) return "";
  const match = urlOrId.match(/\/d\/([^\/\?]+)/);
  return match ? match[1] : urlOrId;
};

const validateAllFields = (formValues : Event) => {
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
  const [locationNameKey, setLocationNameKey] = useState<string|undefined>(undefined);
  const { data: locations, isLoading: locationsLoading } = useGetLocations(1, 100, locationNameKey);
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const updateEventPosterMutation = useUpdateEventPoster();
  const addEventMediaMutation = useAddEventMedia();
  const deleteEventMediaMutation = useDeleteEventMedia();

  const isEditMode = !!event;
  const [originalMedia, setOriginalMedia] = useState<any[]>([]);
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>([]);
  const [newMediaIds, setNewMediaIds] = useState<string[]>([]);
  const [originalPosterId, setOriginalPosterId] = useState<string>("");
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
  });
  const [errors, setErrors] = useState<{ [key in keyof Event]?: string }>({});
  
  const [isAddingMedia, setIsAddingMedia] = useState<boolean>(false);
  const [currentMediaInput, setCurrentMediaInput] = useState<string>("");

  useEffect(() => {
    if (event) {
      // Extract and store original poster ID for comparison in edit mode
      const posterId = extractDriveId(event.eventImage || "");
      setOriginalPosterId(posterId);
      
      // Store original media for comparison in edit mode
      // API might return 'medias' or 'eventMedia' depending on the source
      const mediaArray = event.eventMedia || (event as any).medias || [];
      
      if (Array.isArray(mediaArray) && mediaArray.length > 0) {
        const firstItem = mediaArray[0];
        if (firstItem && typeof firstItem === 'object' && 'id' in firstItem) {
          // It's EventMedia[] with objects
          setOriginalMedia(mediaArray as any[]);
        } else {
          // It's string[], no original media to track
          setOriginalMedia([]);
        }
      } else {
        // No media, set to empty array
        setOriginalMedia([]);
      }
      
      // Reset delete/new tracking when event changes
      setDeletedMediaIds([]);
      setNewMediaIds([]);
      
      // Extract location IDs from locations/rooms array (could be room objects with {id, name, capacity})
      // API returns 'rooms' but we map it to 'locations', check both for safety
      const roomsArray = (event as any).rooms || event.locations || [];
      const locationIds = Array.isArray(roomsArray) 
        ? roomsArray.map((loc: any) => typeof loc === 'string' ? loc : loc.id)
        : [];
      
      setFormValues({
        ...event,
        eventImage: extractDriveId(event.eventImage || ""),
        locations: locationIds,
        eventMedia: [], // Not using this for media management anymore
        capacity: event.capacity || 0,
      });
    }
  }, [event]);

  const handleInputChange = (field: keyof Event, value: string| number) => {
      // Extract Drive ID if the field is eventImage and value is a string
      const finalValue = field === "eventImage" && typeof value === "string" 
        ? extractDriveId(value) 
        : value;
      
      setFormValues((prev: Event) => ({ ...prev, [field]: finalValue }));

      if (errors[field as keyof Event]) {
        setErrors((prev: { [key in keyof Event]?: string }) => ({ ...prev, [field]: undefined }));
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

  const handleSave = async () => {
    const registrationDeadlineDate = new Date(formValues.date);
    registrationDeadlineDate.setDate(registrationDeadlineDate.getDate() - 2);

    const finalizedValue = {
      ...formValues,
      date: new Date(formValues.date).toISOString(),
      media: newMediaIds, // Use newMediaIds for media
      eventMedia: newMediaIds, // Keep both for compatibility
      registrationDeadline: registrationDeadlineDate.toISOString(),
      eventImage: formValues.eventImage || "",
    };
    
    const validationErrors = validateAllFields(finalizedValue);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.error("Validation errors:", validationErrors);
      return;
    }
    
    try {
      if (isEditMode && event) {
        // ========== EDIT MODE ==========
        
        console.log("Edit mode - Starting save...");
        console.log("New media IDs to add:", newMediaIds);
        console.log("Deleted media IDs:", deletedMediaIds);
        
        // 1. Update basic event info
        await updateEventMutation.mutateAsync({
          id: event.id,
          data: finalizedValue,
        });

        // 2. Update poster (always call if poster exists)
        if (formValues.eventImage) {
          console.log("Updating poster...");
          await updateEventPosterMutation.mutateAsync({
            id: event.id,
            fileId: formValues.eventImage,
          });
        }

        // 3. Delete removed media
        for (const mediaId of deletedMediaIds) {
          console.log("Deleting media:", mediaId);
          await deleteEventMediaMutation.mutateAsync(mediaId);
        }

        // 4. Add new media (using drive IDs)
        if (newMediaIds.length > 0) {
          console.log("Adding new media...", { eventId: event.id, mediaFileIds: newMediaIds });
          await addEventMediaMutation.mutateAsync({
            eventId: event.id,
            mediaFileIds: newMediaIds,
          });
        }

        toast.success("Event updated successfully!");
        window.location.reload();
        
      } else {
        // ========== CREATE MODE ==========
        await createEventMutation.mutateAsync(finalizedValue);
        
        toast.success("Event created successfully!");
        window.location.reload();
      }
    } catch (error) {
      toast.error(
        isEditMode 
          ? "Failed to update event. Please try again."
          : "Failed to create event. Please try again."
      );
      console.error("Event save error:", error);
    }
  };

  return {
    formValues,
    setFormValues,
    handleInputChange,
    isSubmitting: createEventMutation.isPending || updateEventMutation.isPending || 
                  updateEventPosterMutation.isPending || addEventMediaMutation.isPending || 
                  deleteEventMediaMutation.isPending,
    errors,
    locations: locations || [],
    locationsLoading,
    locationNameKey,
    setLocationNameKey,
    isEditMode,
    isAddingMedia,
    setIsAddingMedia,
    currentMediaInput,
    setCurrentMediaInput,
    handleAddMedia,
    handleRemoveNewMedia,
    handleRemoveOriginalMedia,
    handleSave,
    originalMedia,
    newMediaIds,
    deletedMediaIds,
  };
}
