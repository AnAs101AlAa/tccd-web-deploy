import { useState, useMemo, useEffect } from "react";

interface UsePaginationProps<T> {
  items: T[];
  itemsPerPageMobile?: number;
  itemsPerPageDesktop?: number;
  filterBy?: (item: T) => string; // Function to extract category/filter value from item
  initialCategory?: string;
}

interface UsePaginationReturn<T> {
  // State
  selectedCategory: string;
  currentPage: number;
  isMobile: boolean;

  // Computed values
  categories: string[];
  filteredItems: T[];
  paginatedItems: T[];
  totalPages: number;
  itemsPerPage: number;

  // Actions
  setCategory: (category: string) => void;
  setPage: (page: number) => void;
  handleCategoryChange: (category: string) => void;
}

export const usePagination = <T>({
  items,
  itemsPerPageMobile = 6,
  itemsPerPageDesktop = 12,
  filterBy,
  initialCategory = "All",
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Set items per page based on screen size
  const itemsPerPage = isMobile ? itemsPerPageMobile : itemsPerPageDesktop;

  // Get unique categories from items
  const categories = useMemo(() => {
    if (!filterBy) return [];
    const allCategories = items.map(filterBy);
    return Array.from(new Set(allCategories)).sort();
  }, [items, filterBy]);

  // Filter items by category
  const filteredItems = useMemo(() => {
    if (!filterBy || selectedCategory === "All") return items;
    return items.filter((item) => filterBy(item) === selectedCategory);
  }, [items, selectedCategory, filterBy]);

  // Paginate items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Reset page when category changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return {
    // State
    selectedCategory,
    currentPage,
    isMobile,

    // Computed values
    categories,
    filteredItems,
    paginatedItems,
    totalPages,
    itemsPerPage,

    // Actions
    setCategory: setSelectedCategory,
    setPage: setCurrentPage,
    handleCategoryChange,
  };
};
