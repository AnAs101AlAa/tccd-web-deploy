import React, { useEffect, useState, useRef } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import type { CommunityPost } from "@/shared/types";
import { Button, LazyImageLoader } from "tccd-ui";
import { HTMLFormattedText } from "@/shared/components/HTMLFormattedText";

export const BlogPostCard = ({ post }: { post: CommunityPost }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/posts/${post.id}`);
  };

  const wholeInfoRef = useRef<HTMLDivElement>(null);
  const mainInfoRef = useRef<HTMLDivElement>(null);
  const [translateValue, setTranslateValue] = useState(0);
  const [isTapped, setIsTapped] = useState(false);

  useEffect(() => {
    const wholeEl = wholeInfoRef.current;
    const mainEl = mainInfoRef.current;
    if (!wholeEl || !mainEl) return;

    const update = () => {
      const wholeH = wholeEl.scrollHeight;
      const mainH = mainEl.getBoundingClientRect().height;
      const diff = wholeH - mainH - 16;
      setTranslateValue(diff > 0 ? diff : 0);
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(wholeEl);
      ro.observe(mainEl);
      return () => ro.disconnect();
    }

    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
    };
  }, [post.description]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wholeInfoRef.current &&
        !wholeInfoRef.current.contains(e.target as Node)
      ) {
        setIsTapped(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full h-112.5 md:h-118.75 lg:h-125 group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 flex flex-col">
      {post.media?.[0] && post.media[0].mediaUrl !== "" ? (
        <LazyImageLoader
          src={post.media[0].mediaUrl}
          alt={post.name}
          width="100%"
          height="100%"
          objectClassName="object-top"
          className="absolute inset-0"
        />
      ) : (
        <div className="absolute top-0 inset-0 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-500">No Image Available</span>
        </div>
      )}

      <div
        ref={wholeInfoRef}
        onClick={() => setIsTapped(!isTapped)}
        className={`absolute bottom-0 w-full flex flex-col justify-start p-4 transition-all duration-500 ease-in-out group-hover:translate-y-0 ${
          isTapped ? "translate-y-0" : "translate-y-(--y)"
        } bg-white space-y-2`}
        style={{ "--y": `${translateValue}px` } as React.CSSProperties}
      >
        <div ref={mainInfoRef}>
          <h3 className="text-xl font-bold text-blue-950 mb-2">
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
        </div>

        <div className="transition-all duration-500 ease-in-out transform">
          <div className="text-gray-600 text-[14px] line-clamp-6 mb-3">
            <HTMLFormattedText content={post.description} />
          </div>

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
    </div>
  );
};

export default BlogPostCard;
