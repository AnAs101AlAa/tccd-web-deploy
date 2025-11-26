import { useState } from "react";
import { LazyImageLoader } from "tccd-ui";
import { FaEdit, FaTrash, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import type { Location } from "@/shared/queries/admin";
import EditLocationModal from "./EditLocationModal";
import DeleteLocationConfirmation from "./DeleteLocationConfirmation";

interface LocationCardProps {
  location: Location;
}

/**
 * LocationCard Component
 * Displays location information with edit and delete capabilities
 * Responsive design that adapts to all screen sizes
 */
const LocationCard: React.FC<LocationCardProps> = ({ location }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      <article
        className="relative w-full bg-white rounded-2xl shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 group"
        role="article"
        aria-label={`Location: ${location.name}`}
      >
        {/* Image Container with Overlay */}
        <div className="relative w-full h-48 md:h-56 lg:h-64 overflow-hidden bg-gray-200">
          <LazyImageLoader
            src={location.image}
            alt={`${location.name} venue`}
            width="100%"
            height="100%"
            className="absolute top-0 inset-0 object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Action Buttons - Visible on Hover */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleEditClick}
              className="p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Edit location"
              title="Edit location"
            >
              <FaEdit className="w-4 h-4 text-secondary" />
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-2.5 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="Delete location"
              title="Delete location"
            >
              <FaTrash className="w-4 h-4 text-primary" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 md:p-5 lg:p-6">
          {/* Location Name */}
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {location.name}
          </h3>

          {/* Location Details */}
          <div className="space-y-2.5 mb-4">
            {/* Address */}
            {location.address && (
              <div className="flex items-start gap-2 text-gray-600">
                <FaMapMarkerAlt
                  className="w-4 h-4 mt-1 flex-shrink-0 text-primary"
                  aria-hidden="true"
                />
                <p className="text-sm md:text-base line-clamp-2">
                  {location.address}
                </p>
              </div>
            )}

            {/* Capacity */}
            <div className="flex items-center gap-2 text-gray-700">
              <FaUsers
                className="w-4 h-4 flex-shrink-0 text-secondary"
                aria-hidden="true"
              />
              <p className="text-sm md:text-base font-semibold">
                Capacity:{" "}
                <span className="text-secondary">
                  {location.capacity.toLocaleString()}
                </span>{" "}
                people
              </p>
            </div>
          </div>

          {/* Description */}
          {location.description && (
            <p className="text-sm md:text-base text-gray-600 line-clamp-2 mb-4">
              {location.description}
            </p>
          )}

          {/* Action Buttons - Mobile/Tablet View */}
          <div className="flex gap-2 md:gap-3 mt-4 pt-4 border-t border-gray-200 lg:hidden">
            <button
              onClick={handleEditClick}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-secondary hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              aria-label="Edit location"
            >
              <FaEdit className="w-4 h-4" />
              <span className="text-sm font-medium">Edit</span>
            </button>
            <button
              onClick={handleDeleteClick}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              aria-label="Delete location"
            >
              <FaTrash className="w-4 h-4" />
              <span className="text-sm font-medium">Delete</span>
            </button>
          </div>

          {/* Bottom Gradient Indicator */}
          <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-1 bg-gradient-to-r from-primary to-secondary transition-all duration-300 ease-in-out rounded-b-2xl" />
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
