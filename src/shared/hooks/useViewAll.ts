import { useMemo } from "react";

interface UseViewAllProps<T> {
  items: T[];
  initialLimit?: number;
}

interface UseViewAllReturn<T> {
  displayedItems: T[];
  hasMore: boolean;
  toggleViewAll: () => void;
}

export const useViewAll = <T>({
  items,
  initialLimit = 6,
}: UseViewAllProps<T>): UseViewAllReturn<T> => {

  const displayedItems = useMemo(() => {
    return items.slice(0, initialLimit);
  }, [items, initialLimit]);

  const hasMore = items.length > initialLimit;

  const toggleViewAll = () => {
    //route to the view all page
  };

  return {
    displayedItems,
    hasMore,
    toggleViewAll,
  };
};
