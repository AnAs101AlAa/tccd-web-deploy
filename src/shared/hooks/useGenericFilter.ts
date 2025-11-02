import { useState, useMemo } from "react";

interface UseGenericFilterProps<T> {
  items: T[];
  searchFields: (item: T) => string[]; // Function that returns array of searchable fields
  categoryField?: (item: T) => string; // Function to get category/type field
  dateField?: (item: T) => string; // Function to get date field
}

interface UseGenericFilterReturn<T> {
  searchInput: string;
  setSearchInput: (input: string) => void;
  handleSearch: () => void;
  selectedTypes: string[];
  setSelectedTypes: (types: string[]) => void;
  selectedDateRange: { start: Date | null; end: Date | null };
  setSelectedDateRange: (range: {
    start: Date | null;
    end: Date | null;
  }) => void;
  filteredItems: T[];
  resetFilters: () => void;
}

export const useGenericFilter = <T>({
  items,
  searchFields,
  categoryField,
  dateField,
}: UseGenericFilterProps<T>): UseGenericFilterReturn<T> => {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  const handleSearch = () => {
    setSearchTerm(searchInput);
  };

  const filteredItems = useMemo(() => {
    let filtered = [...items];

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        const fields = searchFields(item);
        return fields.some((field) => field.toLowerCase().includes(search));
      });
    }

    // Filter by types/categories
    if (selectedTypes.length > 0 && categoryField) {
      filtered = filtered.filter((item) =>
        selectedTypes.includes(categoryField(item))
      );
    }

    // Filter by date range
    if ((selectedDateRange.start || selectedDateRange.end) && dateField) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(dateField(item));
        const start = selectedDateRange.start
          ? new Date(selectedDateRange.start)
          : null;
        const end = selectedDateRange.end
          ? new Date(selectedDateRange.end)
          : null;

        if (start && end) {
          return itemDate >= start && itemDate <= end;
        } else if (start) {
          return itemDate >= start;
        } else if (end) {
          return itemDate <= end;
        }
        return true;
      });
    }

    return filtered;
  }, [
    items,
    searchTerm,
    selectedTypes,
    selectedDateRange,
    searchFields,
    categoryField,
    dateField,
  ]);

  const resetFilters = () => {
    setSearchInput("");
    setSearchTerm("");
    setSelectedTypes([]);
    setSelectedDateRange({ start: null, end: null });
  };

  return {
    searchInput,
    setSearchInput,
    handleSearch,
    selectedTypes,
    setSelectedTypes,
    selectedDateRange,
    setSelectedDateRange,
    filteredItems,
    resetFilters,
  };
};
