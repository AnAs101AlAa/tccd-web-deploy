import React, { useEffect, useState } from "react";
import {
  Modal,
  InputField,
  TextAreaField,
  DropdownMenu,
  Button,
  ButtonTypes,
  ButtonWidths,
} from "tccd-ui";
import EVENT_TYPES from "@/constants/EventTypes";
import type {
  AddEditEventModalProps,
  EventFormValues,
  FormErrors,
} from "../types/eventModalTypes";
import { EVENT_FORM_CONSTRAINTS } from "../constants/eventModalConstants";
import {
  validateAllFields,
  convertEventToFormValues,
  convertFormValuesToEvent,
} from "../utils/eventModalUtils";
import {
  FormFieldWithError,
  NumberInputField,
  DateTimeInputField,
} from "./EventModalFormFields";

const AddEditEventModal: React.FC<AddEditEventModalProps> = ({
  event,
  onClose,
  onSave,
}) => {
  const isEditMode = !!event;
  const [formValues, setFormValues] = useState<EventFormValues>(
    convertEventToFormValues(event)
  );
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (event) {
      setFormValues(convertEventToFormValues(event));
    }
  }, [event]);

  const handleInputChange =
    (field: keyof EventFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setFormValues((prev) => ({ ...prev, [field]: value }));

      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleTextAreaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value } = event.target;
    setFormValues((prev) => ({ ...prev, description: value }));

    if (errors.description) {
      setErrors((prev) => ({ ...prev, description: undefined }));
    }
  };

  const handleEventTypeChange = (value: string) => {
    setFormValues((prev) => ({ ...prev, eventType: value }));

    if (errors.eventType) {
      setErrors((prev) => ({ ...prev, eventType: undefined }));
    }
  };

  const handleSave = () => {
    const validationErrors = validateAllFields(formValues);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const savedEvent = convertFormValuesToEvent(formValues, event);
    onSave(savedEvent);
  };

  return (
    <Modal
      title={isEditMode ? "Edit Event" : "Add New Event"}
      isOpen
      onClose={onClose}
      className="max-w-4xl"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Event Title */}
          <div className="md:col-span-2">
            <FormFieldWithError error={errors.title}>
              <InputField
                label="Event Title"
                value={formValues.title}
                placeholder="Enter event title"
                onChange={handleInputChange("title")}
                id="title"
                error={errors.title}
              />
            </FormFieldWithError>
          </div>

          {/* Event Description */}
          <div className="md:col-span-2">
            <FormFieldWithError error={errors.description}>
              <TextAreaField
                label="Event Description"
                value={formValues.description}
                placeholder="Enter detailed event description"
                onChange={handleTextAreaChange}
                id="description"
                maxLength={EVENT_FORM_CONSTRAINTS.description.maxLength}
                error={errors.description}
              />
            </FormFieldWithError>
          </div>

          {/* Event Poster URL */}
          <div className="md:col-span-2">
            <FormFieldWithError error={errors.eventPoster}>
              <InputField
                label="Event Poster URL"
                value={formValues.eventPoster}
                placeholder="https://example.com/poster.jpg"
                onChange={handleInputChange("eventPoster")}
                id="eventPoster"
                error={errors.eventPoster}
              />
            </FormFieldWithError>
          </div>

          {/* Event Date & Time */}
          <FormFieldWithError error={errors.date}>
            <DateTimeInputField
              id="date"
              label="Event Date & Time"
              value={formValues.date}
              onChange={handleInputChange("date")}
              error={errors.date}
            />
          </FormFieldWithError>

          {/* Location */}
          <FormFieldWithError error={errors.location}>
            <InputField
              label="Location"
              value={formValues.location}
              placeholder="Enter event location"
              onChange={handleInputChange("location")}
              id="location"
              error={errors.location}
            />
          </FormFieldWithError>

          {/* Event Type */}
          <FormFieldWithError error={errors.eventType}>
            <DropdownMenu
              label="Event Type"
              options={EVENT_TYPES}
              value={formValues.eventType}
              onChange={handleEventTypeChange}
              placeholder="Select event type"
              id="eventType"
            />
          </FormFieldWithError>

          {/* Category */}
          <FormFieldWithError error={errors.category}>
            <InputField
              label="Category"
              value={formValues.category}
              placeholder="Enter event category"
              onChange={handleInputChange("category")}
              id="category"
              error={errors.category}
            />
          </FormFieldWithError>

          {/* Capacity */}
          <FormFieldWithError error={errors.capacity}>
            <NumberInputField
              id="capacity"
              label="Capacity"
              value={formValues.capacity}
              onChange={handleInputChange("capacity")}
              placeholder="Enter event capacity"
              min={EVENT_FORM_CONSTRAINTS.capacity.min.toString()}
              max={EVENT_FORM_CONSTRAINTS.capacity.max.toString()}
              error={errors.capacity}
            />
          </FormFieldWithError>

          {/* Registered Count */}
          <FormFieldWithError error={errors.registeredCount}>
            <NumberInputField
              id="registeredCount"
              label="Registered Count"
              value={formValues.registeredCount}
              onChange={handleInputChange("registeredCount")}
              placeholder="Enter registered count"
              min="0"
              error={errors.registeredCount}
            />
          </FormFieldWithError>

          {/* Attendee Count */}
          <FormFieldWithError error={errors.attendeeCount}>
            <NumberInputField
              id="attendeeCount"
              label="Attendee Count"
              value={formValues.attendeeCount}
              onChange={handleInputChange("attendeeCount")}
              placeholder="Enter attendee count"
              min="0"
              error={errors.attendeeCount}
            />
          </FormFieldWithError>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            buttonText="Cancel"
            onClick={onClose}
            type={ButtonTypes.BASIC}
            width={ButtonWidths.FIT}
          />
          <Button
            buttonText={isEditMode ? "Save Changes" : "Create Event"}
            onClick={handleSave}
            type={ButtonTypes.PRIMARY}
            width={ButtonWidths.FIT}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AddEditEventModal;
