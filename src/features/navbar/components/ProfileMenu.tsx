import profileImage from "@/assets/placeholders/profileImage.jpeg";
import { getProfileMenuItems } from "@/constants/ProfileMenuItems";
import { useEffect, useRef } from "react";
import { useAppSelector, useAppDispatch } from "@/shared/store/hooks";
import {
  selectUserFullName,
  selectUserEmail,
  selectUserProfileImage,
  selectCurrentUser,
} from "@/shared/store/selectors/userSelectors";
import { clearUser } from "@/shared/store/slices/userSlice";
import { useNavigate } from "react-router-dom";

interface ProfileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  position?: "top" | "bottom"; // top means menu appears above avatar (mobile), bottom means below (desktop)
}

const ProfileMenu = ({
  isOpen,
  onClose,
  isAuthenticated,
  position = "top",
}: ProfileMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Get user data from Redux store
  const currentUser = useAppSelector(selectCurrentUser);
  const userFullName = useAppSelector(selectUserFullName);
  const userEmail = useAppSelector(selectUserEmail);
  const userProfileImage = useAppSelector(selectUserProfileImage);

  // Get dynamic menu items based on user role
  const menuItems = getProfileMenuItems(currentUser);

  const handleMenuItemClick = (action?: string) => {
    if (action === "logout") {
      dispatch(clearUser());
      navigate("/login");
      onClose();
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

  // For mobile (top position), center the menu. For desktop (bottom position), align to right
  const horizontalPosition =
    position === "top"
      ? "left-1/2 -translate-x-1/2" // Centered for mobile
      : "right-0"; // Right-aligned for desktop

  const triangleHorizontalPosition =
    position === "top"
      ? "left-1/2 -translate-x-1/2" // Centered for mobile
      : "right-[30px]"; // 30px from right for desktop

  const positionClasses =
    position === "top"
      ? "bottom-[calc(100%+20px)]" // Above avatar for mobile
      : "top-[calc(100%+20px)]"; // Below avatar for desktop

  const triangleStyle =
    position === "top"
      ? {
          // Triangle pointing down (menu above)
          bottom: "-12px",
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderTop: "12px solid white",
        }
      : {
          // Triangle pointing up (menu below)
          top: "-12px",
          borderLeft: "12px solid transparent",
          borderRight: "12px solid transparent",
          borderBottom: "12px solid white",
        };

  return (
    <div
      ref={menuRef}
      className={`absolute ${horizontalPosition} ${positionClasses} w-[307px] bg-background shadow-[0px_4px_14.7px_rgba(0,0,0,0.25)] rounded-[10px] z-50`}
    >
      {/* Triangle pointer */}
      <div
        className={`absolute ${triangleHorizontalPosition} w-0 h-0`}
        style={triangleStyle}
      />

      {isAuthenticated ? (
        <>
          {/* Profile Header */}
          <div className="flex flex-col items-center pt-[30px] pb-6">
            <div className="w-[61px] h-[61px] rounded-full border border-background overflow-hidden mb-2">
              <img
                src={userProfileImage || profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[13px] leading-6 tracking-[-0.365714px] text-contrast font-inter">
              {userFullName || "Guest User"}
            </p>
            <p className="text-[10px] leading-6 tracking-[-0.365714px] text-contrast font-inter">
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
                  className={`flex flex-row items-center px-4 gap-[14px] cursor-pointer hover:bg-gray-50 transition-colors ${
                    !isLast ? "border-b border-[#14191D]" : ""
                  }`}
                  style={{ height: item.height || "72px" }}
                  onClick={() => handleMenuItemClick(item.action)}
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
                      className="text-[13px] leading-6 tracking-[-0.365714px] font-inter"
                      style={{ color: item.iconColor }}
                    >
                      {item.description}
                    </p>
                  </div>
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
