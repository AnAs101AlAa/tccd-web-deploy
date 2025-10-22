import React from "react";

interface TabContentProps {
  activeTab: string;
}

const TabContent: React.FC<TabContentProps> = ({activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "info":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Information
            </h2>
            <p className="text-gray-600">
              Your detailed information is displayed below.
            </p>
          </div>
        );

      case "tickets":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Tickets
            </h2>
            <p className="text-gray-600">
              Your event tickets will appear here.
            </p>
          </div>
        );

      case "offerings":
        return (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Offerings
            </h2>
            <p className="text-gray-600">Company offerings will appear here.</p>
          </div>
        );

      default:
        return null;
    }
  };

  return <div>{renderContent()}</div>;
};

export default TabContent;
