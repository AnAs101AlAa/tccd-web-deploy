import React from "react";
import type { AnyUser } from "@/shared/types";
import InfoTab from "./InfoTab";

interface TabContentProps {
  activeTab: string;
  user: AnyUser;
  isOwnProfile?: boolean;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  user,
  isOwnProfile = false,
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return <InfoTab user={user} isOwnProfile={isOwnProfile} />;

      case "tickets":
        return (
          <div className="p-4 sm:p-6">
            <h2 className="mb-4 text-lg sm:text-xl font-semibold text-contrast">
              Tickets
            </h2>
            <p className="text-sm sm:text-base text-label">
              Your event tickets will appear here.
            </p>
          </div>
        );

      case "offerings":
        return (
          <div className="p-4 sm:p-6">
            <h2 className="mb-4 text-lg sm:text-xl font-semibold text-contrast">
              Offerings
            </h2>
            <p className="text-sm sm:text-base text-label">
              Company offerings will appear here.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default TabContent;
