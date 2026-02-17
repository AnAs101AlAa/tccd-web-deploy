import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import type { Location } from "@/shared/queries/admin";
import EditLocationModal from "./EditLocationModal";
import DeleteLocationConfirmation from "./DeleteLocationConfirmation";
import roomFallback from "@/assets/room.png";

interface LocationCardProps {
  location: Location;
}

const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const getImageUrl = (fileId: string | undefined | null) => {
    if (!fileId) return roomFallback;
    return `https://lh3.googleusercontent.com/d/${fileId}`;
  };

  const [imageSrc, setImageSrc] = useState(getImageUrl(location.roomImage));
  const [hasError, setHasError] = useState(false);

  // Update image source when location changes
  useEffect(() => {
    setImageSrc(getImageUrl(location.roomImage));
    setHasError(false);
  }, [location.roomImage]);

  const handleImageError = () => {
    if (!hasError) {
      setImageSrc(roomFallback);
      setHasError(true);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <article
        className="relative w-full h-full bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 group flex flex-col"
        role="article"
        aria-label={`Location: ${location.name}`}
      >
        {/* Image Container - 16:9 Aspect Ratio */}
        <div className="relative w-full aspect-video overflow-hidden bg-gray-200">
          <img
            key={location.roomImage} // Ensure re-render on image change
            src={imageSrc}
            alt={`${location.name} venue`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={handleImageError}
          />

          {/* Gradient Overlay - Visible on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action Buttons - Desktop (Top-Right, Visible on Hover) */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden lg:flex">
            <button
              onClick={handleEditClick}
              className="p-2 px-2.5 bg-secondary hover:brightness-125 text-white rounded-full shadow-lg transition-all duration-200 cursor-pointer"
              aria-label="Edit location"
              title="Edit location"
            >
              <FaEdit className="size-3" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2 sm:p-2.5 bg-primary hover:brightness-125 text-white rounded-full shadow-lg transition-all duration-200 cursor-pointer"
              aria-label="Delete location"
              title="Delete location"
            >
              <FaTrash className="size-3" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 sm:p-4 md:p-5 flex flex-col flex-grow">
          {/* Location Name */}
          <h3 className="text-[18px] sm:text-lg md:text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-secondary transition-colors duration-200">
            {location.name}
          </h3>

          {/* Location Details */}
          <div className="space-y-2 mb-4 flex-grow">
            {/* Capacity */}
            <div className="flex items-center gap-2 text-gray-700">
              <FaUsers
                className="size-4 flex-shrink-0 text-secondary"
                aria-hidden="true"
              />
              <p className="text-[13px] sm:text-sm font-semibold">
                Capacity:{" "}
                <span className="text-secondary font-bold">
                  {location.capacity.toLocaleString()}
                </span>{" "}
                people
              </p>
            </div>
          </div>

          {/* Action Buttons - Mobile/Tablet View (Below content) */}
          <div className="flex gap-2 md:gap-3 mt-auto pt-3 border-t border-gray-200 lg:hidden">
            <button
              onClick={handleEditClick}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-secondary hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium"
              aria-label="Edit location"
            >
              <FaEdit className="size-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-xs sm:text-sm font-medium"
              aria-label="Delete location"
            >
              <FaTrash className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>
      </article>

      {/* Modals */}
      {isEditModalOpen && (
        <EditLocationModal
          location={location}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteLocationConfirmation
          location={location}
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        />
      )}
    </>
  );
};

export default LocationCard;
