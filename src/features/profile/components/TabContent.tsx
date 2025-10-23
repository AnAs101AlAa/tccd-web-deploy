import React from "react";

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-contrast mb-4">
              Information
            </h2>
            <p className="text-sm sm:text-base text-label">
              Your detailed information is displayed below.
            </p>
          </div>
        );

      case "tickets":
        return (
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-contrast mb-4">
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
            <h2 className="text-lg sm:text-xl font-semibold text-contrast mb-4">
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
