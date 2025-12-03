import React, { useState } from "react";
import {
  FiPlus,
  FiGrid,
  FiTrendingUp,
  FiShoppingBag,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Avatar from "@/shared/components/Avatar";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  subItems?: { label: string; path: string }[];
  badge?: number;
  path?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState<string>("events");
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const navItems: NavItem[] = [
    {
      id: "events",
      label: "Events",
      icon: <FiGrid className="w-5 h-5" />,
      path: "/admin/events",
    },
    {
      id: "locations",
      label: "Locations",
      icon: <FiTrendingUp className="w-5 h-5" />,
      path: "/admin/locations",
    },
    {
      id: "posts",
      label: "Posts",
      icon: <FiShoppingBag className="w-5 h-5" />,
      path: "/posts",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <FiSettings className="w-5 h-5" />,
    },
  ];

  const handleNavClick = (item: NavItem) => {
    setActiveItem(item.id);
    if (item.path) {
      navigate(item.path);
    }
    if (item.subItems) {
      setExpandedItem(expandedItem === item.id ? null : item.id);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-40
          transition-all duration-300 ease-in-out
          m-2
          h-[calc(100vh-1rem)]
          ${isExpanded ? "w-64" : "w-[88px]"}
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div
          className="
            h-full 
            bg-background-primary/90
            backdrop-blur-[80px]
            border border-muted-primary/40
            shadow-[0px_32px_32px_-16px_rgba(102,37,0,0.3)]
            flex flex-col
            py-6
            rounded-[28px]
          "
        >
          {isOpen && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="
              absolute -right-3 top-[78px]
              w-6 h-6
              bg-background-primary/90
              border border-muted-primary/30
              backdrop-blur-[90px]
              rounded-full
              flex items-center justify-center
              transition-all duration-200
              hover:bg-background-primary
              shadow-sm
              z-50
            "
              title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {isExpanded ? (
                <FiChevronLeft className="w-3 h-3 text-contrast/50" />
              ) : (
                <FiChevronRight className="w-3 h-3 text-contrast/50" />
              )}
            </button>
          )}

          <div
            className={`flex items-center pb-6 mb-4 transition-all duration-300 ${
              isExpanded ? "px-6 gap-3" : "flex-col px-4"
            }`}
          >
            <Avatar
              size={48}
              backgroundColor="#F2C7BA"
              fallback="A"
              className="flex-shrink-0"
            />
            {isExpanded && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium tracking-wide uppercase text-contrast/40 whitespace-nowrap">
                  Product Designer
                </span>
                <span className="text-sm font-medium text-contrast whitespace-nowrap">
                  Andrew Smith
                </span>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-[0.5px] mx-4 mb-4 bg-gradient-to-r from-transparent via-[#432C2C]/24 to-transparent" />

          {/* Main Navigation */}
          <nav className="flex-1 px-4">
            <div className="space-y-1">
              {navItems.map((item) => (
                <div key={item.id} className="relative">
                  <button
                    onClick={() => handleNavClick(item)}
                    className={`
                      w-full h-14
                      flex items-center gap-4
                      rounded-xl
                      transition-all duration-200
                      ${isExpanded ? "px-5" : "justify-center"}
                      ${
                        activeItem === item.id
                          ? "bg-contrast/4 border border-muted-primary/16 text-contrast shadow-[0px_2px_12px_rgba(204,100,6,0.08)]"
                          : "text-contrast/56 hover:bg-contrast/2 hover:text-contrast"
                      }
                    `}
                    title={!isExpanded ? item.label : undefined}
                  >
                    <span
                      className={`flex-shrink-0 ${
                        activeItem === item.id ? "" : ""
                      }`}
                    >
                      {item.icon}
                    </span>
                    {isExpanded && (
                      <span className="text-sm font-medium whitespace-nowrap flex-1 text-left">
                        {item.label}
                      </span>
                    )}
                    {/* Active indicator glow effect */}
                    {activeItem === item.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(204,139,139,0.24)] to-transparent opacity-30 blur-[12px] -z-10 pointer-events-none" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </nav>

          {/* Divider */}
          {isExpanded && (
            <div className="h-[0.5px] mx-4 mb-4 bg-gradient-to-r from-transparent via-[#432C2C]/24 to-transparent" />
          )}

          <div className="px-4 mb-4">
            <div
              className={`bg-background/12 border border-muted-primary/16 ${
                isExpanded ? "rounded-[28px] p-6" : "rounded-xl p-3"
              } flex flex-col items-center ${isExpanded ? "gap-5" : "gap-0"}`}
            >
              {isExpanded && (
                <div className="text-center space-y-1.5">
                  <h4 className="text-base font-semibold text-contrast tracking-tight">
                    Let's start!
                  </h4>
                  <p className="text-[13px] font-medium text-contrast/56 leading-relaxed">
                    Creating or adding new Events couldn't be easier
                  </p>
                </div>
              )}
              <button
                className={`bg-gradient-to-b from-primary to-primary hover:from-primary/90 hover:to-primary/90 shadow-[0px_2px_12px_rgba(204,100,6,0.2)] flex items-center justify-center gap-2 transition-all ${
                  isExpanded
                    ? "w-full h-12 rounded-xl"
                    : "w-12 h-12 rounded-full"
                }`}
                title={!isExpanded ? "Add New Event" : undefined}
              >
                <FiPlus className="w-5 h-5 text-background" />
                {isExpanded && (
                  <span className="text-sm font-semibold text-background">
                    Add New Event
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
