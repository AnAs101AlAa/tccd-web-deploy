import React from "react";
import { IoPersonOutline, IoMailOutline, IoCallOutline } from "react-icons/io5";
import InfoField from "@/shared/components/InfoField";

interface AttendeeInfoProps {
  userDetails: {
    englishFullName: string;
    arabicFullName: string;
    phoneNumber: string;
    email: string;
  };
}

const hasValue = (val: string | null | undefined): boolean =>
  !!val && val.trim() !== "" && val !== "N/A";

const AttendeeInfo: React.FC<AttendeeInfoProps> = ({ userDetails }) => {
  const showName = hasValue(userDetails.englishFullName);
  const showArabicName = hasValue(userDetails.arabicFullName);
  const showEmail = hasValue(userDetails.email);
  const showPhone = hasValue(userDetails.phoneNumber);

  if (!showName && !showArabicName && !showEmail && !showPhone) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-4">
        Attendee Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showName && (
          <InfoField
            icon={IoPersonOutline}
            label="Name"
            value={userDetails.englishFullName}
          />
        )}

        {showArabicName && (
          <InfoField
            icon={IoPersonOutline}
            label="الاسم"
            value={userDetails.arabicFullName}
          />
        )}

        {showEmail && (
          <InfoField
            icon={IoMailOutline}
            label="Email"
            value={userDetails.email}
            truncate
          />
        )}

        {showPhone && (
          <InfoField
            icon={IoCallOutline}
            label="Phone"
            value={userDetails.phoneNumber}
          />
        )}
      </div>
    </div>
  );
};

export default AttendeeInfo;
