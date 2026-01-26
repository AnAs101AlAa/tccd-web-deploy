import type { ReactNode } from "react";

interface GenericGridProps<T> {
  items: T[];
  emptyMessage?: string;
  renderCard: (item: T) => ReactNode;
  gridCols?: string;
  getKey?: (item: T) => string | number;
}

const GenericGrid = <T,>({
  items,
  emptyMessage = "No items to display.",
  renderCard,
  gridCols = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  getKey,
}: GenericGridProps<T>) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-secondary font-semibold text-md px-3 md:text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-6`}>
      {items.map((item, index) => {
        const key = getKey ? getKey(item) : index;
        return (
          <div key={key} className="h-full">
            {renderCard(item)}
          </div>
        );
      })}
    </div>
  );
};

export default GenericGrid;
