import React from "react";
import { LazyImageLoader } from "tccd-ui";

interface CoverProps {
  coverImage?: string;
  children?: React.ReactNode;
  className?: string;
}

const Cover = ({ coverImage, children, className = "" }: CoverProps) => {
  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {coverImage ? (
        <LazyImageLoader
          src={coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
          width="100%"
          height="200px"
        />
      ) : (
        <div
          className="w-full h-full"
          style={{
            backgroundColor: "#333639",
          }}
        />
      )}
      <div className="absolute inset-0 flex flex-row items-start p-8">
        {children}
      </div>
    </div>
  );
};

export default Cover;
