import React from "react";
import {
  FiCalendar,
  FiMapPin,
  FiUsers,
  FiBarChart2,
  FiBriefcase,
  FiLogOut,
} from "react-icons/fi";
import { IoHome } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "@/shared/queries/auth";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onToggle?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen = true, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: logoutAsync } = useLogout();

  const navItems: NavItem[] = [
    {
      id: "events",
      label: "Events",
      icon: <FiCalendar className="w-5 h-5" />,
      path: "/admin/events",
    },
    {
      id: "locations",
      label: "Locations",
      icon: <FiMapPin className="w-5 h-5" />,
      path: "/admin/locations",
    },
    {
      id: "users",
      label: "Users",
      icon: <FiUsers className="w-5 h-5" />,
      path: "/admin/users",
    },
    {
      id: "statistics",
      label: "Statistics",
      icon: <FiBarChart2 className="w-5 h-5" />,
      path: "/admin/statistics",
    },
    {
      id: "companies",
      label: "Companies",
      icon: <FiBriefcase className="w-5 h-5" />,
      path: "/admin/companies",
    },
  ];

  const handleNavClick = (item: NavItem) => {
    navigate(item.path);
    if (onClose) {
      onClose();
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAsync();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path: string) => location.pathname.startsWith(path);

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
          h-screen w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div
          className="
            h-full 
            bg-background
            border-r border-secondary/10
            shadow-[4px_0_16px_rgba(0,0,0,0.08)]
            flex flex-col
            py-6
          "
        >
          {/* Logo / Brand Area */}
          <div className="px-6 pb-8 flex justify-center">
            <img
              onClick={() => navigate("/")}
              src="https://res.cloudinary.com/do0yekzmf/image/upload/v1772147018/TCCD_logo_ucw7ki.svg"
              alt="TCCD Logo"
              className="h-9 md:h-10 w-auto object-contain cursor-pointer"
            />
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 px-3">
            <div className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`
                    w-full h-12
                    flex items-center gap-3
                    px-4
                    rounded-lg
                    cursor-pointer
                    transition-all duration-200
                    ${
                      isActive(item.path)
                        ? "bg-secondary/10 text-secondary font-semibold"
                        : "text-contrast/60 hover:bg-contrast/5 hover:text-contrast font-medium"
                    }
                  `}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="mt-auto pt-4 md:pt-6 border-t border-contrast/5">
            <button
              onClick={() => navigate("/")}
              className="
                w-full py-2 md:py-4
                text-contrast hover:bg-gray-100 font-medium
                flex items-center gap-3
                px-4
                rounded-lg
                cursor-pointer
                transition-all duration-200
              "
            >
              <span className="shrink-0">
                <IoHome className="w-5 h-5" />
              </span>
              <span className="text-sm font-medium">Back to home</span>
            </button>
            <button
              onClick={handleLogout}
              className="
                w-full py-2 md:py-4
                flex items-center gap-3
                px-4
                rounded-lg
                cursor-pointer
                transition-all duration-200
                text-red-500/80 hover:bg-red-500/10 hover:text-red-500
              "
            >
              <span className="shrink-0">
                <FiLogOut className="w-5 h-5" />
              </span>
              <span className="text-sm font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
