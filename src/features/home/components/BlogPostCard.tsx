import React, { useEffect } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { CommunityPost } from "@/shared/types";
import { Button, LazyImageLoader } from "tccd-ui";

export const BlogPostCard = ({ post }: { post: CommunityPost }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/post/${post.id}`);
  };

  const [insideMedia, setInsideMedia] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLHeadingElement>(null);
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = React.useState("0px");

  const isTouchDevice = React.useMemo(() => {
    return typeof window !== "undefined" && "ontouchstart" in window;
  }, []);

  useEffect(() => {
    if (contentRef.current && titleRef.current) {
      const height = insideMedia
        ? `${titleRef.current.offsetHeight + 18}px`
        : `${contentRef.current.scrollHeight}px`;
      setContentHeight(height);
    }
  }, [insideMedia, post.description]);

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
      {post.media?.[0] && post.media[0] !== "" ? (
        <div
          ref={mediaRef}
          className="relative w-full flex-1 aspect-video"
          onMouseEnter={() => !isTouchDevice && setInsideMedia(true)}
          onMouseLeave={() => !isTouchDevice && setInsideMedia(false)}
        >
          <LazyImageLoader
            src={post.media[0]}
            alt={post.name}
            className="rounded-t-xl"
            width="100%"
            height="100%"
          />
        </div>
      ) : (
        <div className="flex-1 w-full bg-gray-200 flex items-center justify-center rounded-t-xl">
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
          {new Date(post.createdAt).toLocaleString("en-US", {
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
          <Button
            buttonText="Read More"
            onClick={handleClick}
            type="secondary"
            width="full"
          />
        </div>
      </div>
    </div>
  );
};

export default BlogPostCard;
