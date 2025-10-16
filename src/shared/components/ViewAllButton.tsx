interface ViewAllButtonProps {
  hasMore: boolean;
  onClick: () => void;
}

const ViewAllButton = ({
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
        <span>View All</span>
      </button>
    </div>
  );
};

export default ViewAllButton;
