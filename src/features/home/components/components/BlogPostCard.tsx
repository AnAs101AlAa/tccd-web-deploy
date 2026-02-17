import React, { useEffect, useState, useRef } from "react";
import { MdCalendarMonth } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import type { CommunityPost } from "@/shared/types";
import { Button, LazyImageLoader } from "tccd-ui";
import { HTMLFormattedText } from "@/shared/components/HTMLFormattedText";

const animationCache = new Map<string, number>();

export const BlogPostCard = ({ post }: { post: CommunityPost }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/posts/${post.id}`);
  };

  const wholeInfoRef = useRef<HTMLDivElement>(null);
  const mainInfoRef = useRef<HTMLDivElement>(null);
  const [translateValue, setTranslateValue] = useState(() => {
    return animationCache.get(post.id) || 0;
  });
  const [isTapped, setIsTapped] = useState(false);

  useEffect(() => {
    const wholeEl = wholeInfoRef.current;
    const mainEl = mainInfoRef.current;
    if (!wholeEl || !mainEl) return;

    const update = () => {
      const wholeH = wholeEl.scrollHeight;
      const mainH = mainEl.getBoundingClientRect().height;
      const diff = wholeH - mainH - 16;
      const val = diff > 0 ? diff : 0;
      setTranslateValue(val);
      animationCache.set(post.id, val);
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
  }, [post.description, post.id]);

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
    <div className="relative w-full h-70 md:h-80 lg:h-85 group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 flex flex-col">
      {post.media?.[0] && post.media[0].mediaUrl !== "" ? (
        <LazyImageLoader
          src={post.media[0].mediaUrl}
          alt={post.name}
          width="100%"
          height="100%"
          objectClassName="object-cover object-top"
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
          <h3 className="text-[22px] md:text-[23px] lg:text-[24px] font-bold text-contrast mb-2">
            {post.name}
          </h3>

          <div className="flex items-center text-sm text-inactive-tab-text mb-2">
            <MdCalendarMonth className="size-4 md:size-4.5 mr-1 text-primary" />
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
          <div className="text-gray-600 text-[14px] line-clamp-5 mb-3">
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
