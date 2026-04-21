import { CheckCircle2, RotateCcw } from "lucide-react";
import type { QRScanResult, EventSlot } from "@/shared/types";
import format from "@/shared/utils/dateFormater";
import { Button, ButtonTypes } from "tccd-ui";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoMaleFemaleOutline,
  IoDocumentOutline,
} from "react-icons/io5";
import InfoField from "@/shared/components/InfoField";

const ScannerSuccess = ({ scanResult, selectedSlot, onNextScan }: { scanResult: QRScanResult; selectedSlot?: EventSlot; onNextScan: () => void }) => {
  console.log("Scan Result:", scanResult); // For debugging purposes
  return (
    <div className="w-full flex flex-col items-center bg-linear-to-br from-emerald-50 to-teal-100 p-8 rounded-xl overflow-hidden shadow-inner">
      <div className="w-20 h-20 mb-6 bg-white rounded-full flex items-center justify-center shadow-lg shrink-0">
        <CheckCircle2 className="w-12 h-12 text-emerald-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Ticket Verified
      </h3>
      <p className="text-gray-500 mb-6 text-center">
        Your ticket has been verified, enjoy the event!
      </p>

      <div className="w-full mt-2 mb-8 flex justify-center">
        <Button
          buttonText="Scan Next Ticket"
          buttonIcon={<RotateCcw className="w-4 h-4 ml-1" />}
          type={ButtonTypes.PRIMARY}
          onClick={onNextScan}
        />
      </div>

      <div className="w-full bg-white p-4 rounded-lg shadow-sm border border-emerald-100 mb-6 text-left">
        <h4 className="font-semibold text-emerald-800 border-b border-emerald-50 pb-2 mb-3">Scan Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-emerald-50/50 p-3 rounded-md">
            <p className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-1">Scanned At</p>
            <p className="text-sm font-bold text-emerald-800">{format(scanResult.scannedAt, "hourFull")}</p>
          </div>
          <div className="bg-emerald-50/50 p-3 rounded-md">
            <p className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-1">Scan Count</p>
            <p className="text-sm font-bold text-emerald-800">{scanResult.scanCount}</p>
          </div>
          <div className="bg-emerald-50/50 p-3 rounded-md">
            <p className="text-xs text-emerald-600 uppercase tracking-wide font-semibold mb-1">Max Scans</p>
            <p className="text-sm font-bold text-emerald-800">{scanResult.maxScans}</p>
          </div>
        </div>
      </div>

      {selectedSlot && (
        <div className="w-full bg-white p-4 rounded-lg shadow-sm border border-emerald-100 mb-6 text-left">
          <h4 className="font-semibold text-emerald-800 border-b border-emerald-50 pb-2 mb-3">Event Slot</h4>
          <div className="bg-emerald-50/50 p-3 rounded-md">
            <h5 className="font-bold text-emerald-700">{selectedSlot.title || "Selected Slot"}</h5>
            <p className="text-sm font-medium text-emerald-600/80 mt-1">
              {format(selectedSlot.startTime, "hourFull")} — {format(selectedSlot.endTime, "hourFull")}
            </p>
          </div>
        </div>
      )}

      {scanResult.user && (
        <div className="w-full bg-white p-6 rounded-lg shadow-sm text-left border border-emerald-100">
          <h4 className="font-semibold text-emerald-800 border-b border-emerald-50 pb-2 mb-4">Attendee Information</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { label: "English Name", value: scanResult.user.englishName, icon: IoPersonOutline },
              { label: "Arabic Name", value: scanResult.user.arabicName, icon: IoPersonOutline },
              { label: "Email", value: scanResult.user.email, icon: IoMailOutline, truncate: true },
              { label: "Phone Number", value: scanResult.user.phoneNumber, icon: IoCallOutline },
              { label: "Gender", value: scanResult.user.gender, icon: IoMaleFemaleOutline },
              scanResult.user.nationalId
                ? { label: "National ID", value: scanResult.user.nationalId, icon: IoDocumentOutline }
                : scanResult.user.passportNumber
                ? { label: "Passport Number", value: scanResult.user.passportNumber, icon: IoDocumentOutline }
                : null
            ]
              .filter(Boolean)
              .map((detail) => (
                <InfoField
                  key={detail!.label}
                  icon={detail!.icon as any}
                  label={detail!.label}
                  value={String(detail!.value)}
                  truncate={detail!.truncate}
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerSuccess;
