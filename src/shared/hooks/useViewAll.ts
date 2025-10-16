import { useState, useMemo } from "react";

interface UseViewAllProps<T> {
  items: T[];
  initialLimit?: number;
}

interface UseViewAllReturn<T> {
  displayedItems: T[];
  isViewingAll: boolean;
  hasMore: boolean;
  toggleViewAll: () => void;
}

export const useViewAll = <T>({
  items,
  initialLimit = 6,
}: UseViewAllProps<T>): UseViewAllReturn<T> => {
  const [isViewingAll, setIsViewingAll] = useState(false);

  const displayedItems = useMemo(() => {
    if (isViewingAll) {
      return items;
    }
    return items.slice(0, initialLimit);
  }, [items, isViewingAll, initialLimit]);

  const hasMore = items.length > initialLimit;

  const toggleViewAll = () => {
    setIsViewingAll((prev) => !prev);
  };

  return {
    displayedItems,
    isViewingAll,
    hasMore,
    toggleViewAll,
  };
};
