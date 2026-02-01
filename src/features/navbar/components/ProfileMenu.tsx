import profileImage from "@/assets/placeholders/profileImage.jpeg";
import { getProfileMenuItems } from "@/constants/ProfileMenuItems";
import { useEffect, useRef } from "react";
import { useAppSelector } from "@/shared/store/hooks";
import {
  selectUserFullName,
  selectUserEmail,
  selectUserProfileImage,
  selectCurrentUser,
} from "@/shared/store/selectors/userSelectors";
import { useNavigate } from "react-router-dom";
import { useLogout } from "@/shared/queries/auth";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  position?: "top" | "bottom";
}

const ProfileMenu = ({
  isOpen,
  onClose,
  isAuthenticated,
  position = "top",
}: ProfileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { mutateAsync: logoutAsync } = useLogout();

  // Get user data from Redux store
  const currentUser = useAppSelector(selectCurrentUser);
  const userFullName = useAppSelector(selectUserFullName);
  const userEmail = useAppSelector(selectUserEmail);
  const userProfileImage = useAppSelector(selectUserProfileImage);

  const menuItems = getProfileMenuItems(currentUser);

  const handleMenuItemClick = (action?: string) => {
    if (action === "logout") {
      (async () => {
        try {
          await logoutAsync();
          navigate("/login");
          onClose();
        } catch (err) {
          console.error("Logout failed:", err);
        }
      })();
    } else if (action) {
      navigate(action);
      onClose();
    }
  };

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

  const horizontalPosition =
    position === "top"
      ? "left-1/2 -translate-x-1/2"
      : "right-0";

  const triangleHorizontalPosition =
    position === "top"
      ? "left-1/2 -translate-x-1/2"
      : "right-[15px]";

  const positionClasses =
    position === "top"
      ? "bottom-[calc(100%+22px)]"
      : "top-[calc(100%+20px)]";

  const triangleStyle =
    position === "top"
      ? {
        bottom: "-12px",
        borderLeft: "12px solid transparent",
        borderRight: "12px solid transparent",
        borderTop: "12px solid white",
      }
      : {
        top: "-12px",
        borderLeft: "12px solid transparent",
        borderRight: "12px solid transparent",
        borderBottom: "12px solid white",
      };

  return (
    <div
      ref={menuRef}
      className={`absolute ${horizontalPosition} ${positionClasses} w-[210px] md:w-[250px] bg-background shadow-[0px_4px_14.7px_rgba(0,0,0,0.25)] rounded-[10px] z-50`}
    >
      <div
        className={`absolute ${triangleHorizontalPosition} w-0 h-0`}
        style={triangleStyle}
      />

      {isAuthenticated ? (
        <>
          {/* Profile Header */}
          <div className="flex flex-col items-center pt-4 pb-3 md:pt-[20px] md:pb-3">
            <div className="w-[48px] h-[48px] md:w-[55px] md:h-[55px] rounded-full border border-background overflow-hidden mb-1 md:mb-2">
              <img
                src={userProfileImage || profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[12px] md:text-[13px] lg:text-[15px] leading-5 md:leading-6 tracking-[-0.365714px] text-contrast font-inter mb-1">
              {userFullName || "Guest User"}
            </p>
            <p className="text-[11px] md:text-[12px] lg:text-[13px] leading-1.5 md:leading-2.5 tracking-[-0.365714px] text-contrast font-inter">
              {userEmail || "No email available"}
            </p>
          </div>

          {/* Main Settings */}
          <div className="flex flex-col">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === menuItems.length - 1;
              return (
                <div
                  key={item.title}
                  className={`flex flex-row items-center px-2 md:px-4 py-3 gap-2 md:gap-[8px] cursor-pointer hover:bg-secondary/10 transition-colors ${!isLast ? "border-b border-gray-400" : ""
                    }`}
                  onClick={() => handleMenuItemClick(item.action)}
                >
                  <Icon
                    size={position === "top" ? 16 : 22}
                    color={item.iconColor}
                  />
                  <h3
                    className={`text-[12px] md:text-[13px] lg:text-[14px] leading-4 md:leading-3 tracking-[-0.365714px] font-semibold`}
                    style={{ color: item.iconColor }}
                  >
                    {item.title}
                  </h3>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          {/* Unauthenticated - Sign In/Sign Up Buttons */}
          <div className="flex flex-col p-6 gap-4">
            <button className="w-full py-3 bg-secondary text-background font-poppins font-semibold text-base rounded-lg hover:bg-secondary/80 transition-colors">
              Sign In
            </button>
            <button className="w-full py-3 border-2 border-secondary text-secondary font-poppins font-semibold text-base rounded-lg hover:bg-secondary hover:text-background transition-colors">
              Sign Up
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;
