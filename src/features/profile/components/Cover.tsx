import React from "react";
import { LazyImageLoader } from "tccd-ui";
import coverImagePlaceholder from "@/assets/cover.png";

interface CoverProps {
  coverImage?: string;
  children?: React.ReactNode;
  className?: string;
}

const Cover = ({ coverImage, children, className = "" }: CoverProps) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      <LazyImageLoader
        src={coverImage || coverImagePlaceholder}
        alt="Cover"
        className="object-fill"
        width="100%"
        height="100%"
      />
      <div className="absolute inset-0 flex flex-row items-start p-8">
        {children}
      </div>
    </div>
  );
};

export default Cover;
