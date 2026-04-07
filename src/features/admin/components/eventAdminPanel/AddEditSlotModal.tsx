import { Modal, InputField, Button, Timepicker, NumberField } from "tccd-ui";
import { RichTextEditor } from "@/shared/components/RichTextEditor";
import { useState, useEffect } from "react";
import type { EventSlot } from "@/shared/types/events";
import toast from "react-hot-toast";

interface AddEditSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventDate: string | undefined;
  initialSlot?: EventSlot;
  onSave: (slot: EventSlot) => void;
}

const AddEditSlotModal: React.FC<AddEditSlotModalProps> = ({
  isOpen,
  onClose,
  eventDate,
  initialSlot,
  onSave,
}) => {
  const isEditMode = !!initialSlot;

  const toTimeValue = (value?: string) => {
    if (!value) return "";
    if (!value.includes("T")) return value;
    const date = new Date(value);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const [formValues, setFormValues] = useState<{
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    capacity: number;
    registrationCount: number;
  }>({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    capacity: 0,
    registrationCount: 0,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialSlot) {
        setFormValues({
          title: initialSlot.title || "",
          description: initialSlot.description || "",
          startTime: toTimeValue(initialSlot.startTime),
          endTime: toTimeValue(initialSlot.endTime),
          capacity: initialSlot.capacity || 0,
          registrationCount: initialSlot.registrationCount || 0,
        });
      } else {
        setFormValues({
          title: "",
          description: "",
          startTime: "",
          endTime: "",
          capacity: 0,
          registrationCount: 0,
        });
      }
    }
  }, [isOpen, initialSlot]);

  const handleSave = () => {
    if (!eventDate) {
      toast.error("Please select a date for the event first.");
      return;
    }

    if (!formValues.startTime || !formValues.endTime || !formValues.capacity || formValues.capacity <= 0) {
      toast.error("Please provide valid start/end times and capacity.");
      return;
    }

    const parseTime = (timeStr: string) => {
      if (timeStr.includes('T')) {
        const date = new Date(timeStr);
        return [date.getHours(), date.getMinutes()];
      }
      const [h, m] = timeStr.split(':').map(Number);
      return [h, m];
    };

    const [startHour, startMin] = parseTime(formValues.startTime);
    const [endHour, endMin] = parseTime(formValues.endTime);
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;

    let crossesMidnight = false;
    if (endMinutes < startMinutes) {
      endMinutes += 24 * 60;
      crossesMidnight = true;
    }
    if (startMinutes === endMinutes) {
      toast.error("Start and end time cannot be the same.");
      return;
    }

    const baseDate = new Date(eventDate);
    const startDate = new Date(baseDate);
    startDate.setHours(startHour, startMin, 0, 0);

    const endDate = new Date(baseDate);
    endDate.setHours(endHour, endMin, 0, 0);
    if (crossesMidnight) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const slotPayload: EventSlot = {
      id: initialSlot?.id || (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15)),
      title: formValues.title || undefined,
      description: formValues.description || undefined,
      startTime: startDate.toISOString(),
      endTime: endDate.toISOString(),
      capacity: formValues.capacity,
      registrationCount: formValues.registrationCount,
    };

    onSave(slotPayload);
    onClose();
  };

  return (
    <Modal
      title={isEditMode ? "Edit Slot" : "Add New Slot"}
      isOpen={isOpen}
      onClose={onClose}
      className="md:w-1/2 lg:w-1/3"
    >
      <div className="space-y-4">
        <InputField
          id="slotTitle"
          label="Title (Optional)"
          placeholder="e.g. Morning Session"
          value={formValues.title}
          onChange={(e) => setFormValues((prev) => ({ ...prev, title: e.target.value }))}
        />
        
        <RichTextEditor
          id="slotDescription"
          label="Description (Optional)"
          value={formValues.description}
          onChange={(value) => setFormValues((prev) => ({ ...prev, description: value }))}
          maxLength={500}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold text-gray-600 mb-1">Start Time</p>
            <Timepicker
              value={formValues.startTime}
              onChange={(val) => setFormValues((prev) => ({ ...prev, startTime: val }))}
            />
          </div>
          <div>
            <p className="text-[13px] md:text-[14px] lg:text-[15px] font-semibold text-gray-600 mb-1">End Time</p>
            <Timepicker
              value={formValues.endTime}
              onChange={(val) => setFormValues((prev) => ({ ...prev, endTime: val }))}
            />
          </div>
        </div>

        <NumberField
          id="slotCapacity"
          label="Capacity"
          placeholder="e.g. 50"
          value={formValues.capacity.toString()}
          onChange={(value) =>
            setFormValues((prev) => ({
              ...prev,
              capacity: typeof value === "number" ? value : parseInt(value, 10) || 0,
            }))
          }
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button type="basic" buttonText="Cancel" onClick={onClose} width="fit" />
          <Button type="primary" buttonText={isEditMode ? "Save Changes" : "Add Slot"} onClick={handleSave} width="fit" />
        </div>
      </div>
    </Modal>
  );
};

export default AddEditSlotModal;
