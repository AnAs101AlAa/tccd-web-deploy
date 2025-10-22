import React from "react";
import type { AnyUser } from "@/shared/types";
import Cover from "./Cover";
import Avatar from "./Avatar";
import DropdownMenuComponent from "@/shared/components/DropdownMenuComponent";
import { HiCamera } from "react-icons/hi";
import { useProfileHeader } from "../hooks";

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

  // Hardcoded banner for now
  const bannerImage =
    "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop";

  return (
    <div className="relative">
      {/* Cover/Banner Section */}
      <div className="relative">
        <Cover coverImage={bannerImage} className="h-[200px]" />

        {/* Avatar positioned to overlap cover */}
        <div className="absolute left-6 bottom-0 transform translate-y-1/2">
          <div className="relative">
            <Avatar
              avatarImage={avatarImage}
              size="lg"
              position="relative"
              className="border-4 border-white"
            />
            {isOwnProfile && (
              <div className="relative">
                <button
                  ref={cameraButtonRef}
                  onClick={handleImageClick}
                  className="absolute cursor-pointer bottom-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                  aria-label="Change profile picture"
                >
                  <HiCamera className="w-5 h-5 text-gray-700" />
                </button>
                <DropdownMenuComponent
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
      <div className="pt-16 px-6 pb-4">
        <h1 className="text-2xl font-bold text-gray-900">{getDisplayName()}</h1>
        <p className="text-sm text-gray-600 mt-1">{getBio()}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
