import React from "react";
import type { AnyUser } from "@/shared/types";
import Cover from "./Cover";
import { useProfileHeader } from "../hooks";

interface ProfileHeaderProps {
  user: AnyUser;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
}) => {
  const {
    getBio,
    getDisplayName,
  } = useProfileHeader(user);


  return (
    <div className="relative">
      {/* Cover/Banner Section */}
      <div className="relative">
        <Cover
          className="h-32 sm:h-40 md:h-48 lg:h-50"
        />
      </div>

      {/* User Info Section */}
      <div className="px-4 sm:px-6 pt-2 py-4">
        <h1 className="text-[28px] md:text-[30px] lg:text-[32px] font-bold text-contrast wrap-break-word text-center">
          {getDisplayName()}
        </h1>
        <p className="-mt-1 text-[13px] sm:text-[14px] lg:text-[15px] text-label wrap-break-word text-center">
          {getBio()}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
