import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ImageModal from "./ImageModal";
import type { CommunityPost } from "@/shared/types";
import { FaCalendarAlt } from "react-icons/fa";
import { LazyImageLoader } from "tccd-ui";
import { HTMLFormattedText } from "@/shared/components/HTMLFormattedText";
import { useNavigate } from "react-router-dom";

interface PostContainerProps {
  post: CommunityPost;
}

const PostContainer: React.FC<PostContainerProps> = ({ post }) => {
  const { name, description, media, createdAt } = post;
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();
  const [clickedMark, setClickedMark] = useState(false);
  const markRef = useRef<HTMLDivElement>(null);

  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (markRef.current && !markRef.current.contains(event.target as Node)) {
        setClickedMark(false);
      }
    };

    if (clickedMark) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [clickedMark]);

  return (
    <div className="w-full min-h-screen relative">
      <div className="flex flex-col items-center w-full mx-auto px-3">
        <div className="relative lg:w-[40%] md:w-[60%] w-[90%] mb-20">
          <div className="flex flex-col gap-1 mt-4 max-h-svh rounded-2xl shadow-2xl bg-white p-4 border-gray-300 border-2 fade-in-up relative pb-8 z-10">
            <div className="flex gap-2 relative w-full pb-2 border-b-2 border-gray-300">
              <div className="w-1.5 bg-primary" />
              <h2 className="text-[23px] md:text-[25px] lg:text-[27px] font-semibold text-[#295E7E]">
                {name}
              </h2>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <FaCalendarAlt className="h-4 w-4 mr-2 text-red-600" />
              {new Date(createdAt).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            
            <p className="lg:text-[15px] md:text-[14px] text-[13px] mt-1 text-gray-700">
              <HTMLFormattedText
                content={description}
              />
            </p>

            {media.length > 0 && (
              <div className="relative mt-2 md:mt-4 overflow-hidden rounded-lg shadow-lg transition-all duration-300 group">
                <LazyImageLoader
                  src={media[currentIndex].mediaUrl}
                  alt={name}
                  height="60vh"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {media.length > 1 && (
              <div className="mt-3 md:mt-5 justify-center items-center text-[13px] md:text-[14px] lg:text-[16px] flex gap-2">
                <div className="p-2 cursor-pointer" onClick={() => setCurrentIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : media.length - 1)}>
                  <FaChevronLeft className="size-3.5 md:size-4 text-gray-600" />
                </div>
                <p className="text-inactive-tab-text font-semibold">{currentIndex + 1} / {media.length}</p>
                <div className="p-2 cursor-pointer" onClick={() => setCurrentIndex((prevIndex) => prevIndex < media.length - 1 ? prevIndex + 1 : 0)}>
                  <FaChevronRight className="size-3.5 md:size-4 text-gray-600" />
                </div>
              </div>
            )}
          </div>
          {media.length > 0 && (
            <div
              ref={markRef}
              className={`absolute left-1/2 -translate-x-1/2 -bottom-8 w-8 h-35.75 p-1 fade-in-up bg-primary ${clickedMark ? "translate-y-[108px]" : "translate-y-12"} transition-transform duration-300 ease-in-out cursor-pointer flex items-center justify-center z-0`}
            style={{
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)",
            }}
            onClick={() => {
              if (clickedMark) navigate("/");
              else setClickedMark(true);
            }}
          >
            <p
              className="text-white font-bold mb-10 text-[11px] md:text-[12px] lg:text-[13px] rotate-90 whitespace-nowrap"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(90deg)",
              }}
            >
              Back to home
            </p>
          </div>
        )}
        </div>
      </div>
      {isImageModalOpen && (
        <ImageModal onClick={toggleImageModal} name={name} image={media[currentIndex].mediaUrl} />
      )}
    </div>
  );
};

export default PostContainer;
