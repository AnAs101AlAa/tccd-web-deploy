import React from "react";
import type { AnyUser } from "@/shared/types";
import { getUserTabs } from "../constants/USER_TABS";

interface ProfileTabsProps {
  user: AnyUser;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  user,
  activeTab,
  onTabChange,
}) => {
  const tabs = getUserTabs(user);

  return (
    <div className="border-y border-gray-200">
      <div className="flex overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 min-w-[100px] py-3 sm:py-4 px-3 sm:px-6 text-center text-xs sm:text-sm font-bold cursor-pointer transition-colors whitespace-nowrap
              ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary bg-background-primary"
                  : "text-inactive-tab-text hover:text-contrast hover:bg-gray-50"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;
