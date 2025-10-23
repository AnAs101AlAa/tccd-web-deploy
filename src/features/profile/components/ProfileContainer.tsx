import React, { useState } from "react";
import type { AnyUser } from "@/shared/types";
import ProfileHeader from "./ProfileHeader";
import ProfileTabs from "./ProfileTabs";
import TabContent from "./TabContent";

interface ProfileContainerProps {
  user: AnyUser;
  isOwnProfile?: boolean;
}

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  user,
  isOwnProfile = false,
}) => {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <ProfileHeader user={user} isOwnProfile={isOwnProfile} />
        <ProfileTabs
          user={user}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <TabContent
          activeTab={activeTab}
          user={user}
          isOwnProfile={isOwnProfile}
        />
      </div>
    </div>
  );
};

export default ProfileContainer;
