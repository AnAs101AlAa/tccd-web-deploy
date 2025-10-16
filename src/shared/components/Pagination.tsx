import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-[26px] h-[26px] flex items-center justify-center transition-colors ${
          currentPage === 1
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-contrast hover:text-white"
        }`}
        aria-label="Previous page"
      >
        <IoChevronBack size={18} />
      </button>

      <span className="font-inter font-normal text-[14px] leading-[17px] text-black">
        {currentPage}/{totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-[26px] h-[26px] flex items-center justify-center transition-colors ${
          currentPage === totalPages
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-contrast hover:text-white"
        }`}
        aria-label="Next page"
      >
        <IoChevronForward size={18} />
      </button>
    </div>
  );
};

export default Pagination;
