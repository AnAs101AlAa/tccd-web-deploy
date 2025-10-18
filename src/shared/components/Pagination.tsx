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
    <div className="flex items-center justify-center gap-2 mt-5 md:mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-[28px] h-[28px] flex items-center justify-center transition-colors rounded-full ${
          currentPage === 1
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-contrast hover:text-white"
        }`}
        aria-label="Previous page"
      >
        <IoChevronBack size={22} />
      </button>

      <span className="font-inter font-normal text-[14px] md:text-[16px] lg:text-[18px] leading-[17px] text-black">
        {currentPage}/{totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-[28px] h-[28px] flex items-center justify-center transition-colors rounded-full ${
          currentPage === totalPages
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-contrast hover:text-white"
        }`}
        aria-label="Next page"
      >
        <IoChevronForward size={22} />
      </button>
    </div>
  );
};

export default Pagination;
