import type { EventGalleryCardProps } from "@/shared/types/galleyTypes";
import GalleryCard from "./GalleryCard";
import type { ReactNode } from "react";

interface GalleryGridProps {
  gallery: EventGalleryCardProps[];
  emptyMessage?: string;
  renderCard?: (item: EventGalleryCardProps) => ReactNode;
  gridCols?: string;
}

const GalleryGrid = ({
  gallery,
  emptyMessage = "No gallery items to display.",
  renderCard,
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
      {gallery.map((item) =>
        renderCard ? (
          <div key={item.id} className="h-full">
            {renderCard(item)}
          </div>
        ) : (
          <GalleryCard key={item.id} gallery={item} />
        )
      )}
    </div>
  );
};

export default GalleryGrid;
