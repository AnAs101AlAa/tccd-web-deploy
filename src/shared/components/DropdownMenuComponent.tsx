import { useEffect, useRef, useState } from "react";

interface DropdownMenuItem {
  title: string;
  icon?: React.ComponentType<{ size?: number; color?: string }>;
  iconColor?: string;
  action?: string;
  onClick?: () => void;
}

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: DropdownMenuItem[];
  position?: "top" | "bottom" | "left" | "right";
  width?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
  alignToTrigger?: boolean;
}

const DropdownMenuComponent = ({
  isOpen,
  onClose,
  items,
  position = "bottom",
  width = "w-48",
  triggerRef,
  alignToTrigger = false,
}: DropdownMenuProps) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOffset, setMenuOffset] = useState<{
    left?: string;
    top?: string;
    right?: string;
    bottom?: string;
  }>({});

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        // Check if click is on trigger element
        if (
          triggerRef?.current &&
          triggerRef.current.contains(event.target as Node)
        ) {
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
  }, [isOpen, onClose, triggerRef]);

  // Calculate menu position to align triangle with trigger element
  useEffect(() => {
    if (
      !isOpen ||
      !alignToTrigger ||
      !triggerRef?.current ||
      !menuRef.current
    ) {
      setMenuOffset({});
      return;
    }

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const parentRect = triggerRef.current.offsetParent?.getBoundingClientRect();

    if (!parentRect) return;

    // Calculate the center of the trigger button
    const triggerCenter =
      triggerRect.left - parentRect.left + triggerRect.width / 2;

    // The triangle is 15px from the left edge of the menu, so we offset the menu
    // so that 15px aligns with the trigger center
    const menuLeft = triggerCenter - 15;

    if (position === "bottom" || position === "top") {
      setMenuOffset({ left: `${menuLeft}px` });
    } else if (position === "left" || position === "right") {
      const triggerMiddle =
        triggerRect.top - parentRect.top + triggerRect.height / 2;
      const menuTop = triggerMiddle - 15;
      setMenuOffset({ top: `${menuTop}px` });
    }
  }, [isOpen, alignToTrigger, triggerRef, position]);

  if (!isOpen) return null;

  const positionClasses = {
    top: "bottom-[calc(100%+12px)]",
    bottom: "top-[calc(100%+12px)]",
    left: "right-[calc(100%+12px)]",
    right: "left-[calc(100%+12px)]",
  };

  const trianglePosition = {
    top: { bottom: "-12px", left: "15px" },
    bottom: { top: "-12px", left: "15px" },
    left: { right: "-12px", top: "15px" },
    right: { left: "-12px", top: "15px" },
  };

  const triangleStyle = {
    top: {
      borderLeft: "12px solid transparent",
      borderRight: "12px solid transparent",
      borderTop: "12px solid white",
    },
    bottom: {
      borderLeft: "12px solid transparent",
      borderRight: "12px solid transparent",
      borderBottom: "12px solid white",
    },
    left: {
      borderTop: "12px solid transparent",
      borderBottom: "12px solid transparent",
      borderLeft: "12px solid white",
    },
    right: {
      borderTop: "12px solid transparent",
      borderBottom: "12px solid transparent",
      borderRight: "12px solid white",
    },
  };

  return (
    <div
      ref={menuRef}
      className={`absolute ${positionClasses[position]} ${width} bg-white shadow-xl rounded-lg border border-gray-200 z-50`}
      style={alignToTrigger ? menuOffset : { left: 0 }}
    >
      {/* Triangle pointer */}
      <div
        className="absolute w-0 h-0"
        style={{
          ...trianglePosition[position],
          ...triangleStyle[position],
        }}
      />

      {/* Menu Items */}
      <div className="py-2">
        {items.map((item, index) => {
          const Icon = item.icon;
          const isLast = index === items.length - 1;

          return (
            <button
              key={item.title}
              className={`w-full flex flex-row items-center px-4 py-2 gap-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                !isLast ? "border-b border-gray-200" : ""
              }`}
              onClick={() => {
                if (item.onClick) {
                  item.onClick();
                }
                onClose();
              }}
              style={{ color: item.iconColor }}
            >
              {Icon && <Icon size={16} color={item.iconColor} />}
              <span className={item.iconColor ? "" : "text-gray-700"}>
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DropdownMenuComponent;
