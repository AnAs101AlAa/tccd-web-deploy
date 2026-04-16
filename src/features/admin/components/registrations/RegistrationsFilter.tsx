import {  SearchField } from "tccd-ui";

export interface RegistrationsFilterParams {
  name?: string;
  email?: string;
  university?: string;
  department?: string;
  graduationYear?: number;
}
export interface RegistrationsFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function RegistrationsFilter({
  searchQuery,
  onSearchChange,
}: RegistrationsFilterProps) {
  return (
    <div className="w-full">
      <SearchField
        className="lg:w-full"
        value={searchQuery}
        onChange={(value) => onSearchChange(value)}
        placeholder="Search events..."
      />
    </div>
  );
}
