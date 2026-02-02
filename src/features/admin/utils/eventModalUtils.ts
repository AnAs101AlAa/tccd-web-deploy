
import type Event from "@/shared/types/events";
import { eventFormSchema } from "./eventFormSchema";
import { useGetLocations } from "@/shared/queries/admin/locations/locationsQueries";
import { useEffect, useState } from "react";
import EVENT_TYPES from "@/constants/EventTypes";
import { useCreateEvent } from "@/shared/queries/admin/events/eventsQueries";
import toast from "react-hot-toast";  

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

  const isEditMode = !!event;
  const [formValues, setFormValues] = useState<Event>(event ? event : {
    id: "",
    name: "",
    description: "",
    isApproved: true,
    eventImage: "",
    type: EVENT_TYPES[0].value,
    registrationDeadline: "",
    media: [],
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
      setFormValues(event);
    }
  }, [event]);

  useEffect(() => {
    handleInputChange("capacity", 0);
  }, [locations]);

  const handleInputChange = (field: keyof Event, value: string| number) => {
      setFormValues((prev: Event) => ({ ...prev, [field]: value }));

      if (errors[field as keyof Event]) {
        setErrors((prev: { [key in keyof Event]?: string }) => ({ ...prev, [field]: undefined }));
      }
  };

  const handleAddMedia = (url: string) => {
    setFormValues((prev) => ({
      ...prev,
      media: prev.media ? [...prev.media, url] : [url],
    }));
  };

  const handleRemoveMedia = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      media: prev.media ? prev.media.filter((_, i) => i !== index) : [],
    }));
  }

  const handleSave = () => {
    const validationErrors = validateAllFields(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const eventDate = new Date(formValues.date);
    const registrationDeadlineDate = new Date(eventDate);
    registrationDeadlineDate.setDate(eventDate.getDate() - 2);
    const finalizedValue = {
      ...formValues,
      date: eventDate.toISOString(),
      registrationDeadline: registrationDeadlineDate.toISOString(),
    };
    createEventMutation.mutate(finalizedValue, {
      onSuccess: () => {
        toast.success("Event created successfully!");
        onClose();
      },
      onError: () => {
        toast.error("Failed to create event. Please try again.");
      }
    });
  };

  return {
    formValues,
    setFormValues,
    handleInputChange,
    isSubmitting: createEventMutation.isPending,
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
    handleRemoveMedia,
    handleSave,
  };
}
