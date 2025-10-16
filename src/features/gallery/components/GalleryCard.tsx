import type { EventGalleryCardProps } from "@/shared/types/galleyTypes";

interface GalleryCardProps {
  gallery: EventGalleryCardProps;
}

const GalleryCard = ({ gallery }: GalleryCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 h-full flex items-center justify-center">
      <h3 className="text-xl font-bold text-contrast text-center">
        {gallery.eventName}
      </h3>
    </div>
  );
};

export default GalleryCard;
