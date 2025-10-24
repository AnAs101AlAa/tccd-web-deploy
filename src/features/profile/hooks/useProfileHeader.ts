import { useState, useRef } from "react";
import type { AnyUser } from "@/shared/types";
import {
  isStudent,
  isVolunteer,
  isCompany,
  isBusinessRep,
} from "@/shared/types";

export const useProfileHeader = (user: AnyUser, isOwnProfile: boolean) => {
  const [showImageOptions, setShowImageOptions] = useState(false);
  const cameraButtonRef = useRef<HTMLButtonElement>(null);

  const getBio = () => {
    if (isStudent(user) || isVolunteer(user)) {
      const status =
        new Date().getFullYear() >= parseInt(user.graduationYear)
          ? "Graduate of"
          : "Student in";
      return `${status} ${user.university} batch of ${user.graduationYear}`;
    }
    if (isCompany(user)) {
      return user.brief || user.description;
    }
    if (isBusinessRep(user)) {
      return user.jobTitle;
    }
    return "TCCD Member";
  };

  const getDisplayName = () => {
    if ("englishFullName" in user) {
      return user.englishFullName;
    }
    if ("companyName" in user) {
      return user.companyName;
    }
    return "Unknown User";
  };

  const getAvatarImage = () => {
    if ("profilePicture" in user) {
      return user.profilePicture;
    }
    if ("logo" in user) {
      return user.logo;
    }
    return undefined;
  };

  const handleImageClick = () => {
    if (isOwnProfile) {
      setShowImageOptions(!showImageOptions);
    }
  };

  const handleUploadPhoto = () => {
    // TODO: Implement photo upload logic
    console.log("Upload photo clicked");
    // Here you would typically:
    // 1. Open a file picker
    // 2. Upload the file to your backend
    // 3. Update the user's profile picture
  };

  const handleViewPhoto = () => {
    console.log("View photo clicked");
    // TODO: Implement photo view logic
  };

  const handleRemovePhoto = () => {
    // TODO: Implement photo removal logic
    console.log("Remove photo clicked");
    // Here you would typically:
    // 1. Confirm with user
    // 2. Send request to backend to remove the photo
    // 3. Update the user's profile picture to default/null
  };

  const imageMenuItems = [
    {
      title: "Upload Photo",
      onClick: handleUploadPhoto,
    },
    {
      title: "View Photo",
      onClick: handleViewPhoto,
    },
    {
      title: "Remove Photo",
      onClick: handleRemovePhoto,
      iconColor: "#ef4444", // red-600
    },
  ];

  return {
    showImageOptions,
    setShowImageOptions,
    cameraButtonRef,
    getBio,
    getDisplayName,
    getAvatarImage,
    handleImageClick,
    imageMenuItems,
  };
};
