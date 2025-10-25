interface CategoryFilterProps {
  categories: { value: string; label: string }[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <div className="mb-6">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
        <button
          onClick={() => onCategoryChange("All")}
          className={`px-4 py-2 rounded-full font-medium text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
            selectedCategory === "All"
              ? "bg-primary text-white"
              : "bg-white text-secondary border border-gray-300 hover:border-primary"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`md:px-4 px-3 py-1 md:py-2 rounded-full font-medium text-[12px] md:text-[14px] transition-colors whitespace-nowrap flex-shrink-0 ${
              selectedCategory === category.value
                ? "bg-primary text-white"
                : "bg-white text-secondary border border-gray-300 hover:border-primary"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
