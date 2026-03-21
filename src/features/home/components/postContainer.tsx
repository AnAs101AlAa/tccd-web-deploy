import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";
import ImageModal from "./ImageModal";
import type { CommunityPost } from "@/shared/types";
import { MdCalendarMonth } from "react-icons/md";
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

  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex < media.length - 1 ? prevIndex + 1 : 0));
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : media.length - 1));
  };

  return (
    <div className="w-full min-h-screen relative">
      <div className="flex flex-col items-center mx-auto px-3">
        <div className="relative mb-20 lg:w-[50%] md:w-[69%] w-[98%]">
          <div className="flex mt-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 py-2 text-secondary cursor-pointer hover:text-secondary/80 rounded-lg transition-colors duration-200 font-semibold"
            >
              <FiArrowLeft className="size-5" />
              Back to Home
            </button>
          </div>
          <div className="flex flex-col gap-1 rounded-2xl shadow-2xl bg-white p-4 border-gray-300 border-2 fade-in-up relative pb-8 z-10">
            <div className="flex gap-2 relative w-full pb-2 border-b-2 border-gray-300">
              <div className="w-1.5 bg-primary" />
              <h2 className="text-[23px] md:text-[25px] lg:text-[27px] font-semibold text-[#295E7E]">
                {name}
              </h2>
            </div>
            <div className="flex items-center text-[14px] md:text-[15px] text-gray-500 mt-2 font-semibold">
              <MdCalendarMonth className="size-4 md:size-5 mr-1 text-red-600" />
              {new Date(createdAt).toLocaleString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {media.length > 0 && (
              <div className="relative mt-2 md:mt-4 flex justify-center overflow-hidden rounded-lg transition-all duration-300 group" onClick={toggleImageModal}>
                <LazyImageLoader
                  src={media[currentIndex].mediaUrl}
                  alt={name}
                  height="auto"
                  width="100%"
                  objectClassName="object-contain max-h-[400px] md:max-h-[500px] lg:max-h-[600px] max-w-full"
                />
              </div>
            )}
            {media.length > 1 && (
              <div className="mt-2 md:mt-3.5 justify-center items-center text-[13px] md:text-[14px] lg:text-[16px] flex gap-2">
                <div className="p-2 cursor-pointer" onClick={() => setCurrentIndex((prevIndex) => prevIndex > 0 ? prevIndex - 1 : media.length - 1)}>
                  <FaChevronLeft className="size-3.5 md:size-4 text-gray-600" />
                </div>
                <p className="text-inactive-tab-text font-semibold">{currentIndex + 1} / {media.length}</p>
                <div className="p-2 cursor-pointer" onClick={() => setCurrentIndex((prevIndex) => prevIndex < media.length - 1 ? prevIndex + 1 : 0)}>
                  <FaChevronRight className="size-3.5 md:size-4 text-gray-600" />
                </div>
              </div>
            )}
            <p className="lg:text-[15px] md:text-[14px] text-[14px] mt-1 text-gray-700">
              <HTMLFormattedText
                content={description}
              />
            </p>
          </div>
        </div>
      </div>
      {isImageModalOpen && (
        <ImageModal
          onClick={toggleImageModal}
          name={name}
          image={media[currentIndex].mediaUrl}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
          canGoNext={media.length > 1}
          canGoPrev={media.length > 1}
        />
      )}
    </div>
  );
};

export default PostContainer;
