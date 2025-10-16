import { IoChevronDown, IoChevronUp } from "react-icons/io5";

interface ViewAllButtonProps {
  isViewingAll: boolean;
  hasMore: boolean;
  onClick: () => void;
}

const ViewAllButton = ({
  isViewingAll,
  hasMore,
  onClick,
}: ViewAllButtonProps) => {
  if (!hasMore) return null;

  return (
    <div className="flex justify-center mt-8">
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#515151] hover:text-contrast transition-colors shadow-md hover:shadow-lg rounded-lg hover:bg-gray-50"
      >
        <span>{isViewingAll ? "Show Less" : "View All"}</span>
        {isViewingAll ? (
          <IoChevronUp className="w-5 h-5" />
        ) : (
          <IoChevronDown className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default ViewAllButton;
