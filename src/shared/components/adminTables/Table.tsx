import { useEffect, useState } from "react";
import ConfirmActionModal from "../ConfirmActionModal";

interface TableProps<T> {
  items: T[];
  columns: {
    label: string;
    key: keyof T;
    width?: string;
    formatter?: (value: any, item?: T) => any;
  }[];
  renderActions?: (
    item: T,
    triggerDelete: (id: string) => void,
    index: number,
    setItem: (item: T) => void,
  ) => React.ReactNode;
  emptyMessage?: string;
  confirmationAction?: (item: T) => void;
  modalTitle?: string;
  modalSubTitle?: string;
  isSubmitting?: boolean;
}

const Table = <T extends { id?: string }>({
  items,
  columns,
  renderActions,
  emptyMessage = "No items found",
  confirmationAction,
  modalTitle = "",
  modalSubTitle = "",
  isSubmitting = false,
}: TableProps<T>) => {
  const [showDeleteModal, setShowDeleteModal] = useState("");
  const [displayedItems, setDisplayedItems] = useState<T[]>(items);
  const [, setSelectedItem] = useState<T | null>(null);

  useEffect(() => {
    setDisplayedItems(items);
  }, [items]);

  return (
    <div className="hidden lg:block overflow-x-auto">
      {modalTitle && confirmationAction && (
        <ConfirmActionModal
          item={items.find((item) => item.id === showDeleteModal) as T}
          isOpen={!!showDeleteModal}
          onClose={() => setShowDeleteModal("")}
          title={modalTitle}
          subtitle={modalSubTitle}
          isSubmitting={isSubmitting}
          onSubmit={(item: T) => confirmationAction(item)}
        />
      )}
      <table className="w-full border border-gray-200">
        <thead className="bg-contrast/5">
          <tr>
            {columns.map((column, idx) => (
              <th
                key={idx}
                className={`whitespace-nowrap px-4 py-3 text-left text-sm font-medium text-inactive-tab-text ${
                  column.width || ""
                }`}
              >
                {column.label}
              </th>
            ))}
            {renderActions && (
              <th className="px-4 py-3 text-left text-sm font-medium text-inactive-tab-text whitespace-nowrap">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {displayedItems && displayedItems.length > 0 ? (
            displayedItems.map((item, index) => (
              <tr
                key={item.id || index}
                className="hover:bg-muted-primary/5 transition-colors"
              >
                {columns.map((column, idx) => {
                  const value = item[column.key];
                  const displayValue = column.formatter
                    ? column.formatter(value, item)
                    : String(value || "N/A");

                  return (
                    <td key={idx} className={`px-4 py-3 ${column.width || ""}`}>
                      <div className="font-medium text-contrast whitespace-nowrap">
                        {displayValue}
                      </div>
                    </td>
                  );
                })}
                {renderActions && (
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {renderActions(
                        item,
                        (id) => setShowDeleteModal(id),
                        index,
                        (item: T) => setSelectedItem(item),
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + (renderActions ? 1 : 0)}
                className="px-4 py-8 text-center"
              >
                <div className="text-dashboard-description">
                  <p className="text-lg font-medium">{emptyMessage}</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
