import React from "react";
import { LazyImageLoader } from "tccd-ui";

interface AvatarProps {
  avatarImage?: string;
  children?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  position?: "absolute" | "relative";
  customPosition?: boolean;
}

const Avatar = ({
  avatarImage,
  children,
  className = "",
  size = "lg",
  position = "absolute",
  customPosition = false,
}: AvatarProps) => {
  const sizeClasses = {
    sm: "w-12 h-12 sm:w-16 sm:h-16",
    md: "w-20 h-20 sm:w-24 sm:h-24",
    lg: "w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-[132px] lg:h-[132px]",
  };


  const positionStyle =
    position === "absolute" && !customPosition
      ? { left: "16px", bottom: "-66px", zIndex: 1 }
      : position === "absolute"
      ? { zIndex: 1 }
      : {};

  return (
    <div
      className={`${position} ${sizeClasses[size]} rounded-full overflow-hidden ${className}`}
      style={positionStyle}
    >
      <div className="w-full h-full rounded-full relative overflow-hidden">
        {avatarImage ? (
          <LazyImageLoader
            src={avatarImage}
            alt="Profile"
            className="w-full h-full rounded-full object-cover"
            width="100%"
            height="100%"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: "#333639",
            }}
          />
        )}
        {children}
      </div>
    </div>
  );
};

export default Avatar;
