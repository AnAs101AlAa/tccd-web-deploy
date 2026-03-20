import React, { Suspense, lazy } from "react";
import type { AnyUser } from "@/shared/types";
import InfoTab from "./InfoTab";
// TicketTab is only rendered when the user switches to the tickets tab
const TicketTab = lazy(() => import("./TicketTab"));

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
          <Suspense fallback={null}>
            <TicketTab />
          </Suspense>
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
