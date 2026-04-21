import { Modal } from "tccd-ui";
import { MdCalendarMonth } from "react-icons/md";
import type { EventSlot } from "@/shared/types/events";
import format from "@/shared/utils/dateFormater";

interface SlotDetailsModalProps {
  detailedSlot: EventSlot | null;
  onClose: () => void;
  onSelectSlot?: (slotId: string) => void;
}

export default function SlotDetailsModal({
  detailedSlot,
  onClose,
  onSelectSlot,
}: SlotDetailsModalProps) {
  return (
    <Modal
      isOpen={!!detailedSlot}
      onClose={onClose}
      title="Slot Details"
      className="max-w-2xl"
    >
      {detailedSlot && (
        <div className="mt-2 space-y-6">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="space-y-2">
              <h4 className="text-xl font-bold text-foreground">
                {detailedSlot.title}
              </h4>
              {detailedSlot.startTime && detailedSlot.endTime && (
                <p className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <MdCalendarMonth className="w-4 h-4" />
                  {format(detailedSlot.startTime, "hourFull")} — {format(detailedSlot.endTime, "hourFull")}
                </p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="bg-primary/5 border border-primary/20 text-primary px-4 py-2 rounded-lg text-center flex flex-col justify-center min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">Capacity</span>
                <span className="text-xl font-black leading-none mt-1">{detailedSlot.capacity}</span>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-center flex flex-col justify-center min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70">Registered</span>
                <span className="text-xl font-black leading-none mt-1">{detailedSlot.registrationCount}</span>
              </div>
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-center flex flex-col justify-center min-w-[100px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600/70">Spots Left</span>
                <span className="text-xl font-black leading-none mt-1">{Math.max(0, detailedSlot.capacity - detailedSlot.registrationCount)}</span>
              </div>
            </div>
          </div>

          {detailedSlot.description && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="text-sm font-bold text-slate-800 mb-2">Description</h4>
              <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                {detailedSlot.description}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-bold transition-colors"
            >
              Close
            </button>
            {onSelectSlot && detailedSlot.capacity - detailedSlot.registrationCount > 0 && (
              <button
                onClick={() => onSelectSlot(detailedSlot.id)}
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Select Slot
              </button>
            )}
            {onSelectSlot && detailedSlot.capacity - detailedSlot.registrationCount <= 0 && (
              <button
                onClick={() => onSelectSlot(detailedSlot.id)}
                className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Join Waitlist
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
