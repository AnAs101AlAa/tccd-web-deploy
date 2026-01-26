import type { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
        <p className="text-secondary text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols} gap-6`}>
      <AnimatePresence mode="wait">
        {items.map((item, index) => {
          const key = getKey ? getKey(item) : index;
          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {renderCard(item)}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default GenericGrid;
