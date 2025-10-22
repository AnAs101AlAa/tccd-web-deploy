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
    sm: "w-[64px] h-[64px]",
    md: "w-[96px] h-[96px]",
    lg: "w-[132px] h-[132px]",
  };

  const sizes = {
    sm: { width: 64, height: 64 },
    md: { width: 96, height: 96 },
    lg: { width: 132, height: 132 },
  };

  const positionStyle =
    position === "absolute" && !customPosition
      ? { left: "16px", bottom: "-66px", zIndex: 1 }
      : position === "absolute"
      ? { zIndex: 1 }
      : {};

  return (
    <div
      className={`${position} ${sizeClasses[size]} rounded-full border-4 border-white overflow-hidden ${className}`}
      style={positionStyle}
    >
      <div className="w-full h-full rounded-full relative overflow-hidden">
        {avatarImage ? (
          <LazyImageLoader
            src={avatarImage}
            alt="Profile"
            className="w-full h-full rounded-full object-cover right-0.5 bottom-0.5"
            width={sizes[size].width}
            height={sizes[size].height}
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
