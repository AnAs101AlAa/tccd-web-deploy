import React, { useRef, useState, useEffect } from "react";
import { CiMenuBurger } from "react-icons/ci";

interface DraggableToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const DraggableToggle: React.FC<DraggableToggleProps> = ({
  isOpen,
  onToggle,
}) => {
  // Safe initial position calculation
  const [position, setPosition] = useState({
    x:
      typeof window !== "undefined"
        ? Math.min(window.innerWidth - 70, window.innerWidth - 20)
        : 200,
    y: 20,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const wasDragged = useRef(false);

  // Ensure button stays on screen on resize/mount
  useEffect(() => {
    const handleResize = () => {
      setPosition((prev) => ({
        x: Math.min(prev.x, window.innerWidth - 60),
        y: prev.y,
      }));
    };

    // Set initial position if not set correctly
    if (position.x > window.innerWidth || position.x < 0) {
      setPosition({ x: window.innerWidth - 140, y: 20 });
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getClientCoords = (
    e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent,
  ) => {
    if ("touches" in e) {
      const touch = (e as unknown as TouchEvent).touches[0];
      return {
        x: touch.clientX,
        y: touch.clientY,
      };
    } else {
      const mouse = e as unknown as MouseEvent;
      return {
        x: mouse.clientX,
        y: mouse.clientY,
      };
    }
  };

  const handleStart = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) => {
    const { x, y } = getClientCoords(e);
    setOffset({ x: x - position.x, y: y - position.y });
    setIsDragging(true);
    wasDragged.current = false;
  };

  // Global listeners for dragging
  useEffect(() => {
    const handleWindowMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;

      const { x, y } = getClientCoords(e);
      // Constrain to window bounds
      const newX = Math.max(0, Math.min(window.innerWidth - 60, x - offset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 60, y - offset.y));

      setPosition({ x: newX, y: newY });
      wasDragged.current = true;
    };

    const handleWindowUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleWindowMove);
      window.addEventListener("mouseup", handleWindowUp);
      window.addEventListener("touchmove", handleWindowMove, {
        passive: false,
      });
      window.addEventListener("touchend", handleWindowUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleWindowMove);
      window.removeEventListener("mouseup", handleWindowUp);
      window.removeEventListener("touchmove", handleWindowMove);
      window.removeEventListener("touchend", handleWindowUp);
    };
  }, [isDragging, offset]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!wasDragged.current) {
      onToggle();
    }
  };


  if (isOpen) return null;

  return (
    <div
      className="z-50 fixed draggable-toggle-mobile"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none",
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      <div
        className="flex p-3 gap-2 border border-secondary/10 items-center rounded-full bg-background/90 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-background transition-colors select-none"
        onClick={handleClick}
      >
        <CiMenuBurger className="size-4 text-contrast stroke-2" />
      </div>
    </div>
  );
};

export default DraggableToggle;
