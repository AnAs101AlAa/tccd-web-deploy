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
    <>
      <div className="flex items-center justify-center gap-2 mt-5 md:mt-6">
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

      <div className="flex items-center justify-center gap-2 mt-3">
        {Array.from({ length: totalPages }, (_, i) => {
          const page = i + 1;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                page === currentPage
                  ? "bg-secondary"
                  : "bg-background-contrast hover:bg-contrast"
              }`}
              aria-label={`Go to page ${page}`}
            />
          );
        })}
      </div>
    </>
  );
};

export default Pagination;
