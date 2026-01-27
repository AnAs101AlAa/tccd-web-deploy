import React, { useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { CommunityPost } from "@/shared/types";

export const BlogPostCard = ({post}: {post: CommunityPost}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/post/${post.id}`);
  };

  const [insideMedia, setInsideMedia] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState("0px");

  // Detect touch device once
  const isTouchDevice = React.useMemo(() => {
    return typeof window !== "undefined" && "ontouchstart" in window;
  }, []);

  // Handle height based on hover state (desktop only)
  useEffect(() => {
    if (contentRef.current && titleRef.current) {
      const height = insideMedia
        ? `${titleRef.current.offsetHeight + 18}px`
        : `${contentRef.current.scrollHeight}px`;
      setContentHeight(height);
    }
  }, [insideMedia, post.description]);

  // Desktop: reset on mouse leave (optional)
  useEffect(() => {
    if (isTouchDevice) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (mediaRef.current && !mediaRef.current.contains(e.target as Node)) {
        setInsideMedia(false);
      }
    };

    document.addEventListener("mousemove", handleMouseLeave);
    return () => {
      document.removeEventListener("mousemove", handleMouseLeave);
    };
  }, [isTouchDevice]);

  return (
    <div className="rounded-xl h-full flex-none bg-white shadow-md flex flex-col border border-gray-200 hover:shadow-lg">
      {/* postImage container with fixed height */}
      {post.postMedia?.[0] != "" ? (
        <div
          ref={mediaRef}
          className="relative w-full flex-1 aspect-video"
          onMouseEnter={() => !isTouchDevice && setInsideMedia(true)}
          onMouseLeave={() => !isTouchDevice && setInsideMedia(false)}
        >
          {post.postMedia[0].endsWith(".mp4") || post.postMedia[0].endsWith(".webm") ? (
            <video
              src={post.postMedia[0]}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
            />
          ) : (
            <img
              src={post.postMedia[0] ?? "/placeholder.jpg"}
              alt={post.name}
              className="absolute inset-0 w-full h-full object-cover rounded-t-xl"
            />
          )}
        </div>
      ) : (
        <div className="h-48 w-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}

      <div
        ref={contentRef}
        className="p-4 pt-2 flex flex-col transition-all duration-300 ease-in-out overflow-hidden"
        style={{ maxHeight: contentHeight }}
      >
        <h3 ref={titleRef} className="text-xl font-bold text-blue-950 mb-2">
          {post.name}
        </h3>

        <div className="flex items-center text-sm text-gray-500 mb-2">
          <FaCalendarAlt className="h-4 w-4 mr-2 text-red-600" />
          {new Date(post.createdOn).toLocaleString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>

        <p className="text-gray-600 flex-1 text-[14px]">
          {post.description.length > 150
            ? `${post.description.substring(0, 150)}...`
            : post.description}
        </p>
      </div>

      <div className="border-t p-2 md:p-3 lg:p-4">
        <div className="flex w-full">
          <button
            className="cursor-pointer lg:text-[16px] md:text-[14px] text-[12px] w-full bg-[#295E7E] hover:bg-[#272727] text-white py-1 md:py-2 rounded-lg font-medium transition-colors"
            onClick={handleClick}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
