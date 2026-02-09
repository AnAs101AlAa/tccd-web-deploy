import { useState } from "react";
import { FiZoomIn } from "react-icons/fi";
import ImageModal from "./ImageModal";
import type { CommunityPost } from "@/shared/types";
import { FaCalendarAlt } from "react-icons/fa";
import { LazyImageLoader } from "tccd-ui";

interface PostContainerProps {
  post: CommunityPost;
}

const PostContainer: React.FC<PostContainerProps> = ({ post }) => {
  const { name, description, media, createdAt } = post;
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const toggleImageModal = () => {
    setIsImageModalOpen(!isImageModalOpen);
  };

  return (
    <div className=" bg-gray-100 w-full min-h-screen">
      <div className="flex flex-col items-center w-full mx-auto px-3">
        <div className="lg:w-[40%] md:w-[60%] w-[90%] flex flex-col gap-1 mt-4 max-h-svh rounded-2xl shadow-2xl bg-white p-4 border-gray-300 border-2 mb-12 fade-in-up relative pb-8 ">
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
            {description}
          </p>

          {media && media[0] && media[0].mediaUrl !== "" && (
            <div
              className="relative mt-4 overflow-hidden rounded-lg shadow-lg cursor-pointer transition-all duration-300 hover:opacity-90 group"
              onClick={toggleImageModal}
            >
              <LazyImageLoader
                src={media[0].mediaUrl}
                alt={name}
                height="60vh"
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-[1px] opacity-0 group-hover:opacity-80 transition-opacity flex items-center justify-center">
                <span className="text-white font-medium px-3 py-1 rounded bg-black bg-opacity-50">
                  <FiZoomIn className="h-8 w-8" />
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      {isImageModalOpen && media && media[0] && (
        <ImageModal onClick={toggleImageModal} name={name} image={media[0].mediaUrl} />
      )}
    </div>
  );
};

export default PostContainer;
