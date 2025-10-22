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
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              flex-1 py-4 px-6 text-center text-sm font-medium transition-colors
              ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
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
