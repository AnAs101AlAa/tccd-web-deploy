import React from "react";
import type { AnyUser } from "@/shared/types";
import Cover from "./Cover";
import Avatar from "./Avatar";
import { HiCamera } from "react-icons/hi";
import { useProfileHeader } from "../hooks";
import { DropdownPopup } from "tccd-ui";

interface ProfileHeaderProps {
  user: AnyUser;
  isOwnProfile?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  isOwnProfile = false,
}) => {
  const {
    showImageOptions,
    setShowImageOptions,
    cameraButtonRef,
    getBio,
    getDisplayName,
    getAvatarImage,
    handleImageClick,
    imageMenuItems,
  } = useProfileHeader(user, isOwnProfile);

  const avatarImage = getAvatarImage();


  return (
    <div className="relative">
      {/* Cover/Banner Section */}
      <div className="relative">
        <Cover
          className="h-32 sm:h-40 md:h-48 lg:h-[200px]"
        />

        {/* Avatar positioned to overlap cover */}
        <div className="absolute left-4 sm:left-6 bottom-0 transform translate-y-1/2">
          <div className="relative">
            <Avatar
              avatarImage={avatarImage}
              size="lg"
              position="relative"
              className="border-2 sm:border-4 border-white"
            />
            {isOwnProfile && (
              <div className="relative">
                <button
                  ref={cameraButtonRef}
                  onClick={handleImageClick}
                  className="absolute cursor-pointer bottom-1 right-1 sm:bottom-2 sm:right-2 bg-background rounded-full p-1.5 sm:p-2 shadow-lg hover:bg-background-contrast transition-colors"
                  aria-label="Change profile picture"
                >
                  <HiCamera className="w-4 h-4 sm:w-5 sm:h-5 text-contrast" />
                </button>
                <DropdownPopup
                  isOpen={showImageOptions}
                  onClose={() => setShowImageOptions(false)}
                  items={imageMenuItems}
                  position="bottom"
                  width="w-48"
                  triggerRef={cameraButtonRef}
                  alignToTrigger={true}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Info Section */}
      <div className="pt-12 sm:pt-14 md:pt-16 px-4 sm:px-6 pb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-contrast break-words">
          {getDisplayName()}
        </h1>
        <p className="text-xs sm:text-sm text-label mt-1 break-words">
          {getBio()}
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
