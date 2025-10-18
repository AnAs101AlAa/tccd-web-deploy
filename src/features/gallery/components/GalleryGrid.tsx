import type { EventGalleryCardProps } from "@/shared/types/galleyTypes";
import EventGalleryCard from "./EventGalleryCard";

interface GalleryGridProps {
  gallery: EventGalleryCardProps[];
  emptyMessage?: string;
  gridCols?: string;
}

const GalleryGrid = ({
  gallery,
  emptyMessage = "No gallery items to display.",
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
}: GalleryGridProps) => {
  if (gallery.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-secondary text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {gallery.map((item) => (
        <EventGalleryCard key={item.id} {...item} />
      ))}
    </div>
  );
};

export default GalleryGrid;
