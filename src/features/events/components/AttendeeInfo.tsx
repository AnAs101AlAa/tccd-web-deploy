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

const AttendeeInfo: React.FC<AttendeeInfoProps> = ({ userDetails }) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-secondary mb-4">
        Attendee Information
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoField
          icon={IoPersonOutline}
          label="Name"
          value={userDetails.englishFullName}
        />

        <InfoField
          icon={IoPersonOutline}
          label="الاسم"
          value={userDetails.arabicFullName}
        />

        <InfoField
          icon={IoMailOutline}
          label="Email"
          value={userDetails.email}
          truncate
        />

        <InfoField
          icon={IoCallOutline}
          label="Phone"
          value={userDetails.phoneNumber}
        />
      </div>
    </div>
  );
};

export default AttendeeInfo;
