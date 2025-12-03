import React, { useState } from "react";
import { FiPlus, FiGrid, FiTrendingUp, FiShoppingBag, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems?: { label: string; path: string }[];
  badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>("dashboard");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const navItems: NavItem[] = [
    {
      id: "dashboard",
      label: "Main",
      icon: <FiGrid className="w-6 h-6" />,
      subItems: [
        { label: "Activity", path: "/dashboard/activity" },
        { label: "Traffic", path: "/dashboard/traffic" },
        { label: "Statistic", path: "/dashboard/statistic" },
      ],
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <FiTrendingUp className="w-6 h-6" />,
    },
    {
      id: "products",
      label: "Products",
      icon: <FiShoppingBag className="w-6 h-6" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FiSettings className="w-6 h-6" />,
    },
  ];

  const contacts = [
    { id: 1, name: "John Doe", avatar: "JD", status: "online" },
    { id: 2, name: "Jane Smith", avatar: "JS", status: "offline" },
    { id: 3, name: "Alex Johnson", avatar: "AJ", status: "online" },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.subItems) {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    }
    setActiveItem(item.id);
  };

  const handleSubItemClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-contrast/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen z-50
          w-[104px] 
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Glass morphism background */}
        <div
          className="
            h-full 
            bg-background-primary/80
            backdrop-blur-[80px]
            border-[0.5px] border-muted-primary/40
            shadow-[0px_64px_64px_-32px_rgba(205,58,56,0.3)]
            rounded-[28px]
            m-4
            flex flex-col
          "
        >
          {/* Header with Avatar */}
          <div className="flex flex-col items-center pt-16 pb-8">
            <div className="relative w-12 h-12 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-muted-primary to-primary flex items-center justify-center text-background font-semibold text-sm shadow-lg">
                U
              </div>
            </div>

            {/* Collapse button */}
            <button
              className="
                w-6 h-6 
                rounded-full 
                bg-background-primary/70
                backdrop-blur-[90px]
                border-[0.5px] border-muted-primary/30
                flex items-center justify-center
                hover:bg-background-primary transition-colors
              "
              onClick={onClose}
            >
              <svg
                className="w-3 h-3 text-contrast/50 rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Divider */}
          <div className="h-[0.5px] mx-0 bg-gradient-to-r from-transparent via-contrast/20 to-transparent" />

          {/* Main Navigation */}
          <nav className="flex-1 px-6 py-4">
            <div className="mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-inactive-tab-text px-1">
                Main
              </span>
            </div>

            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`
                      w-14 h-14 
                      flex items-center justify-center 
                      rounded-xl 
                      transition-all duration-200
                      ${
                        activeItem === item.id
                          ? "bg-active-tab-bg border-[0.5px] border-muted-primary/20 shadow-md"
                          : "hover:bg-background-contrast/30"
                      }
                    `}
                  >
                    <div
                      className={`${activeItem === item.id ? "text-primary" : "text-contrast/60"}`}
                    >
                      {item.icon}
                    </div>
                  </button>

                  {/* Expanded submenu */}
                  {expandedItem === item.id && item.subItems && (
                    <div
                      className="
                        absolute left-[60px] top-0
                        w-[166px]
                        bg-background-primary/90
                        backdrop-blur-[80px]
                        border-[0.5px] border-muted-primary/40
                        shadow-[0px_64px_64px_-32px_rgba(205,58,56,0.3)]
                        rounded-2xl
                        p-1
                        z-10
                      "
                    >
                      {item.subItems.map((subItem, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSubItemClick(subItem.path)}
                          className={`
                            w-full px-3.5 py-2 
                            text-left text-xs font-medium
                            rounded-lg
                            transition-colors
                            ${
                              idx === 2
                                ? "bg-active-tab-bg text-active-tab-text"
                                : "text-inactive-tab-text hover:bg-background-contrast/40"
                            }
                          `}
                        >
                          {subItem.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Divider */}
          <div className="h-[0.5px] mx-0 bg-gradient-to-r from-transparent via-contrast/20 to-transparent" />

          {/* Messages Section */}
          <div className="px-6 py-4">
            <div className="mb-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-inactive-tab-text">
                Messages
              </span>
            </div>

            <div className="space-y-1">
              {contacts.map((contact) => (
                <button
                  key={contact.id}
                  className="
                    w-16 h-14 
                    flex items-center justify-center 
                    rounded-xl 
                    hover:bg-background-contrast/30
                    transition-colors
                    relative
                  "
                >
                  {/* Status indicator */}
                  <span
                    className={`
                      absolute top-2 left-9 
                      w-1.5 h-1.5 rounded-full 
                      ${contact.status === "online" ? "bg-success" : "bg-label border border-contrast/30"}
                    `}
                  />

                  {/* Avatar */}
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-muted-primary to-muted-secondary flex items-center justify-center text-background text-[10px] font-semibold">
                    {contact.avatar}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Add Button */}
          <div className="p-7">
            <button
              className="
                w-12 h-12 
                bg-primary
                hover:bg-primary/90
                shadow-[0px_4px_24px_rgba(205,58,56,0.3)]
                rounded-xl
                flex items-center justify-center
                transition-all duration-200
                hover:scale-105
              "
            >
              <FiPlus className="w-6 h-6 text-background" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
