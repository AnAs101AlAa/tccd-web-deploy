import React from "react";

interface AvatarProps {
  /** The image source URL */
  src?: string;
  /** Alt text for the image */
  alt?: string;
  /** Size of the avatar in pixels */
  size?: number | string;
  /** Content to display when no image is provided (text, icon, etc.) */
  fallback?: React.ReactNode;
  /** Background color for the avatar */
  backgroundColor?: string;
  /** Border color */
  borderColor?: string;
  /** Border width */
  borderWidth?: string;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Whether to show shadow effect */
  showShadow?: boolean;
  /** Shadow color */
  shadowColor?: string;
  /** Text color */
  textColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = 48,
  fallback,
  backgroundColor = "#F2C7BA",
  textColor,
  borderColor,
  borderWidth = "1px",
  className = "",
  onClick,
  showShadow = false,
  shadowColor = "rgba(0, 0, 0, 0.1)",
}) => {
  const sizeValue = typeof size === "number" ? `${size}px` : size;

  return (
    <div
      className={`cursor-pointer ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="relative">
        {/* Shadow effect */}
        {showShadow && (
          <div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-2.5 rounded-full blur-md"
            style={{
              width: `calc(${sizeValue} * 0.7)`,
              backgroundColor: shadowColor,
            }}
            aria-hidden
          />
        )}

        {/* Avatar container */}
        <div
          className="rounded-full overflow-hidden flex items-center justify-center font-semibold shadow-md"
          style={{
            width: sizeValue,
            height: sizeValue,
            backgroundColor: src ? "transparent" : backgroundColor,
            border: borderColor
              ? `${borderWidth} solid ${borderColor}`
              : "none",
            fontSize: typeof size === "number" ? `${size * 0.4}px` : "1rem",
          }}
        >
          {src ? (
            <img src={src} alt={alt} className="w-full h-full object-cover" />
          ) : (
            <div
              className={`flex items-center justify-center w-full h-full ${
                !textColor ? "text-contrast" : ""
              }`}
              style={{ color: textColor }}
            >
              {fallback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Avatar;
