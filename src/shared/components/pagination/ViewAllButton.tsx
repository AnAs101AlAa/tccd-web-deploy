interface ViewAllButtonProps {
  onClick: () => void;
}

const ViewAllButton = ({
  onClick,
  
}: ViewAllButtonProps) => {
  return (
    <div className="flex justify-center mt-5 md:mt-8">
      <button
        onClick={onClick}
        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text bg-secondary transition-all shadow-md hover:shadow-lg rounded-xl cursor-pointer hover:scale-[102%]"
      >
        <span>View All</span>
      </button>
    </div>
  );
};

export default ViewAllButton;
