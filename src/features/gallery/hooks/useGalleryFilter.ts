import { useState, useMemo } from "react";
import type { EventGalleryCardProps } from "@/shared/types/galleyTypes";

interface UseGalleryFilterProps {
  galleryItems: EventGalleryCardProps[];
}

interface UseGalleryFilterReturn {
  searchKey: string;
  setSearchKey: (key: string) => void;
  selectedEventTypes: string[];
  setSelectedEventTypes: (types: string[]) => void;
  selectedDateRange: { start: Date | null; end: Date | null };
  setSelectedDateRange: (range: {
    start: Date | null;
    end: Date | null;
  }) => void;
  filteredGallery: EventGalleryCardProps[];
  resetFilters: () => void;
}

export const useGalleryFilter = ({
  galleryItems,
}: UseGalleryFilterProps): UseGalleryFilterReturn => {
  const [searchKey, setSearchKey] = useState("");
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  // Apply filters to gallery items
  const filteredGallery = useMemo(() => {
    let filtered = galleryItems;

    // Search filter
    if (searchKey.trim()) {
      const search = searchKey.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.eventName.toLowerCase().includes(search) ||
          item.eventDescription.toLowerCase().includes(search)
      );
    }

    // Event type filter
    if (selectedEventTypes.length > 0) {
      filtered = filtered.filter((item) =>
        selectedEventTypes.includes(item.eventType)
      );
    }

    // Date range filter
    if (selectedDateRange.start || selectedDateRange.end) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.eventDate);
        const matchesStart = selectedDateRange.start
          ? itemDate >= selectedDateRange.start
          : true;
        const matchesEnd = selectedDateRange.end
          ? itemDate <= selectedDateRange.end
          : true;
        return matchesStart && matchesEnd;
      });
    }

    return filtered;
  }, [galleryItems, searchKey, selectedEventTypes, selectedDateRange]);

  const resetFilters = () => {
    setSearchKey("");
    setSelectedEventTypes([]);
    setSelectedDateRange({ start: null, end: null });
  };

  return {
    searchKey,
    setSearchKey,
    selectedEventTypes,
    setSelectedEventTypes,
    selectedDateRange,
    setSelectedDateRange,
    filteredGallery,
    resetFilters,
  };
};

export default useGalleryFilter;
