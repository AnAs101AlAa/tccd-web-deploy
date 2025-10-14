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
  position?: "top" | "bottom";
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

  const horizontalPosition =
    position === "top"
      ? "left-1/2 -translate-x-1/2" 
      : "right-0"; 

  const triangleHorizontalPosition =
    position === "top"
      ? "left-1/2 -translate-x-1/2" 
      : "right-[30px]"; 

  const positionClasses =
    position === "top"
      ? "bottom-[calc(100%+12px)]" 
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
      className={`absolute ${horizontalPosition} ${positionClasses} w-[260px] md:w-[307px] bg-background shadow-[0px_4px_14.7px_rgba(0,0,0,0.25)] rounded-[10px] z-50`}
    >
      <div
        className={`absolute ${triangleHorizontalPosition} w-0 h-0`}
        style={triangleStyle}
      />

      {isAuthenticated ? (
        <>
          {/* Profile Header */}
          <div className="flex flex-col items-center pt-4 pb-3 md:pt-[30px] md:pb-3">
            <div className="w-[40px] h-[40px] md:w-[61px] md:h-[61px] rounded-full border border-background overflow-hidden mb-1 md:mb-2">
              <img
                src={userProfileImage || profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[12px] md:text-[13px] leading-5 md:leading-6 tracking-[-0.365714px] text-contrast font-inter">
              {userFullName || "Guest User"}
            </p>
            <p className="text-[9px] md:text-[10px] leading-1.5 md:leading-2.5 tracking-[-0.365714px] text-contrast font-inter">
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
                  className={`flex flex-row items-center px-2 md:px-4 gap-2 md:gap-[8px] cursor-pointer hover:bg-secondary/10 transition-colors ${
                    !isLast ? "border-b border-[#14191D]" : ""
                  }`}
                  style={{
                    height: position === "top" ? "48px" : item.height || "72px",
                  }}
                  onClick={() => handleMenuItemClick(item.action)}
                >
                  <div className="flex items-center justify-center w-[32px] h-8 md:w-[42px] md:h-10">
                    <Icon
                      size={position === "top" ? 22 : 32}
                      color={item.iconColor}
                    />
                  </div>
                  <div className="flex flex-col justify-center gap-0.5 md:gap-1 flex-1">
                    <h3
                      className={`text-[13px] md:text-base leading-4 md:leading-3 tracking-[-0.365714px] font-bold`}
                      style={{ color: item.iconColor }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-[10px] md:text-[13px] leading-4 md:leading-6 tracking-[-0.365714px] font-inter font-normal"
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
