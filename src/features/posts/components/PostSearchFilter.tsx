import { Button, SearchField, DropdownMenu } from "tccd-ui";
import { IoSearch } from "react-icons/io5";

export interface PostSearchFilterProps {
    searchKey: string;
    orderBy: {label: string, value: string};
    onOrderByChange: (option: {label: string, value: string}) => void;
    onSearchChange: (value: string) => void;
    setDescending: (desc: boolean) => void;
    onSearch: () => void;
    onClear: () => void;
}

export const PostSearchFilter = ({
    searchKey,
    onSearchChange,
    orderBy,
    onOrderByChange,
    setDescending,
    onSearch,
    onClear,
}: PostSearchFilterProps) => {
    const handleSearchInput = (val: string) => {
        onSearchChange(val);
    };

    const handleOrderByChange = (value: string) => {
        const selectedOption = [
            { label: "Newest", value: "DateDesc" },
            { label: "Oldest", value: "DateAsc" },
            { label: "Name (A-Z)", value: "NameAsc" },
            { label: "Name (Z-A)", value: "NameDesc" },
        ].find(opt => opt.value === value);
        
        if (selectedOption) {
            onOrderByChange(selectedOption);
            setDescending(value.endsWith("Desc"));
        }
    };

    const hasSearch = searchKey.trim().length > 0;

    return (
        <div className="w-full bg-white p-3.5 sm:p-4 rounded-lg border border-contrast/10 shadow-sm" role="search">
            <div className="flex items-center justify-between gap-2 mb-2">
                {hasSearch && (
                    <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-secondary">
                        Active filter
                    </span>
                )}
            </div>
            <form
                className="flex flex-col md:flex-row gap-2 items-stretch md:items-center justify-between"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSearch();
                }}
            >
                <div className="flex flex-col md:flex-row items-center gap-2">
                <SearchField
                    value={searchKey}
                    onChange={(val) => handleSearchInput(val)}
                    placeholder="Search posts..."
                    className="max-w-120 flex-1"
                />

                <div className="w-full md:w-60">
                    <DropdownMenu   
                        options={[
                            { label: "Newest", value: "DateDesc" },
                            { label: "Oldest", value: "DateAsc" },
                            { label: "Name (A-Z)", value: "NameAsc" },
                            { label: "Name (Z-A)", value: "NameDesc" },
                        ]}
                        value={orderBy.value}
                        onChange={handleOrderByChange}
                        className="w-full md:w-auto"
                    />
                </div>
                </div>
                <div className="flex gap-2 items-center w-full md:w-auto">
                    {hasSearch && (
                        <div className="flex-1 md:flex-initial">
                            <Button
                                buttonText="Clear"
                                onClick={onClear}
                                type="secondary"
                                width="full"
                            />
                        </div>
                    )}
                    <div className="flex-1 md:flex-initial">
                        <Button
                            buttonIcon={<IoSearch className="size-3.5" />}
                            buttonText="Search"
                            onClick={onSearch}
                            type="primary"
                            width="full"
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostSearchFilter;
