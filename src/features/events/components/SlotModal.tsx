import { Modal } from "tccd-ui";
import { MdCalendarMonth } from "react-icons/md";
import type { EventSlot } from "@/shared/types/events";
import format from "@/shared/utils/dateFormater";

interface SlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  slots: EventSlot[];
  selectedSlotId: string;
  onSelectSlot: (slotId: string) => void;
}

export default function SlotModal({
  isOpen,
  onClose,
  slots,
  selectedSlotId,
  onSelectSlot,
}: SlotModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Select Time Slot"
      className="max-w-4xl xl:max-w-5xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2 max-h-[60vh] overflow-y-auto px-1 pb-1">
        {slots?.map((slot) => {
          const spotsLeft = slot.capacity - slot.registrationCount;
          const isLow = spotsLeft <= 10;
          const isSelected = selectedSlotId === slot.id;

          return (
            <div
              key={slot.id}
              onClick={() => {
                onSelectSlot(slot.id);
                onClose();
              }}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 hover:border-primary/40 bg-white"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1 pr-3">
                    <h4 className={`font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                      {slot.title}
                    </h4>
                    {slot.startTime && slot.endTime && (
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                        <MdCalendarMonth className="w-3.5 h-3.5" />
                        {format(slot.startTime, "hourFull")} — {format(slot.endTime, "hourFull")}
                      </p>
                    )}
                  </div>
                  <div
                    className={`text-xs font-semibold px-2 py-1 rounded-full shrink-0 ${
                      spotsLeft === 0
                        ? "bg-yellow-100 text-yellow-700"
                        : isLow
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {spotsLeft === 0 ? "Waitlist" : `${spotsLeft} spots left`}
                  </div>
                </div>
                {slot.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line mt-2">
                    {slot.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Modal>
  );
}