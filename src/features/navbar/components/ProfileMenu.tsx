import profileImage from "@/assets/placeholders/profileImage.jpeg";
import { PROFILE_MENU_ITEMS } from "@/constants/ProfileMenuItems";
import { useEffect, useRef } from "react";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileMenu = ({ isOpen, onClose }: ProfileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        const avatar = menuRef.current.parentElement?.querySelector(
          "[data-profile-avatar]"
        );
        if (avatar && avatar.contains(event.target as Node)) {
          return;
        }
        onClose();
      }
    };
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 0);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute left-1/2 -translate-x-1/2 bottom-[calc(100%+20px)] w-[307px] bg-white shadow-[0px_4px_14.7px_rgba(0,0,0,0.25)] rounded-[10px] z-50"
    >
      {/* Triangle pointer pointing down */}
      <div
        className="absolute left-1/2 -translate-x-1/2 -bottom-3 w-0 h-0"
        style={{
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "12px solid white",
        }}
      />
      {/* Profile Header */}
      <div className="flex flex-col items-center pt-[30px] pb-6">
        <div className="w-[61px] h-[61px] rounded-full border border-white overflow-hidden mb-2">
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-[13px] leading-6 tracking-[-0.365714px] text-black font-inter">
          Ahmed Fathy Mohamed
        </p>
        <p className="text-[10px] leading-6 tracking-[-0.365714px] text-black font-inter">
          ahmedfathy@gmail.com
        </p>
      </div>

      {/* Main Settings */}
      <div className="flex flex-col">
        {PROFILE_MENU_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === PROFILE_MENU_ITEMS.length - 1;
          return (
            <div
              key={item.title}
              className={`flex flex-row items-center px-4 gap-[14px] ${
                !isLast ? "border-b border-[#14191D]" : ""
              }`}
              style={{ height: item.height || "72px" }}
            >
              <div className="flex items-center justify-center w-[42px] h-10">
                <Icon size={32} color={item.iconColor} />
              </div>
              <div className="flex flex-col justify-center gap-1 flex-1">
                <h3
                  className={`text-base leading-3 tracking-[-0.365714px] font-['Gill_Sans_MT']`}
                  style={{ color: item.iconColor }}
                >
                  {item.title}
                </h3>
                <p
                  className={`${
                    index === 1 ? "text-xs" : "text-[13px]"
                  } leading-6 tracking-[-0.365714px] font-inter`}
                  style={{ color: item.iconColor }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileMenu;
