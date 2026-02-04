import { User, Mail, GraduationCap, Calendar, CheckCircle2 } from "lucide-react";
import { Button, ButtonTypes, ButtonWidths } from "tccd-ui";
import type { QRScanResult } from "@/shared/types";

interface UserInfoCardProps {
  scanResult: QRScanResult;
  onClose: () => void;
}

const UserInfoCard = ({ scanResult, onClose }: UserInfoCardProps) => {
  const { user, event } = scanResult;

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white">
        <div className="flex items-center justify-center mb-3">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-center">Scan Successful!</h2>
        <p className="text-green-50 text-center mt-1">
          User verified for event attendance
        </p>
      </div>

      {/* User Information */}
      <div className="p-6 space-y-4">
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            User Information
          </h3>
          <div className="space-y-3">
            <InfoRow icon={<User className="w-4 h-4" />} label="Name" value={user.name} />
            <InfoRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email} />
            <InfoRow icon={<GraduationCap className="w-4 h-4" />} label="University" value={user.university} />
          </div>
        </div>

        {/* Event Information */}
        <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Event Information
          </h3>
          <div className="space-y-3">
            <InfoRow label="Event Name" value={event.eventName} />
            <InfoRow label="Date" value={new Date(event.eventDate).toLocaleDateString()} />
            <InfoRow 
              label="Status" 
              value={
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  event.status === 'ongoing' 
                    ? 'bg-green-100 text-green-700' 
                    : event.status === 'not-started'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {event.status.replace('-', ' ').toUpperCase()}
                </span>
              } 
            />
          </div>
        </div>

        {/* Scan Time */}
        <div className="text-center text-sm text-gray-500 pt-2">
          Scanned at: {new Date(scanResult.scannedAt).toLocaleString()}
        </div>
      </div>

      {/* Action Button */}
      <div className="p-6 pt-0">
        <Button
          buttonText="Scan Another QR Code"
          onClick={onClose}
          type={ButtonTypes.PRIMARY}
          width={ButtonWidths.FULL}
        />
      </div>
    </div>
  );
};

interface InfoRowProps {
  icon?: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ icon, label, value }: InfoRowProps) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span className="text-sm font-medium text-gray-600">{label}</span>
    </div>
    <span className="text-sm font-semibold text-gray-800">
      {typeof value === 'string' ? value : value}
    </span>
  </div>
);

export default UserInfoCard;
