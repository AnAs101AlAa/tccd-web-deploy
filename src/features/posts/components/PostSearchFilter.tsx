import { Button, SearchField } from "tccd-ui";
import { IoSearch } from "react-icons/io5";

export interface PostSearchFilterProps {
    searchKey: string;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
    onClear: () => void;
}

export const PostSearchFilter = ({
    searchKey,
    onSearchChange,
    onSearch,
    onClear,
}: PostSearchFilterProps) => {
    const handleSearchInput = (val: string) => {
        onSearchChange(val);
    };

    const hasSearch = searchKey.trim().length > 0;

    return (
        <div className="w-full bg-white p-3.5 sm:p-4 rounded-lg border border-contrast/10 shadow-sm" role="search">
            <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-[12px] md:text-[13px] text-inactive-tab-text">
                Filter posts by title
                </p>
                {hasSearch && (
                    <span className="inline-flex items-center rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-secondary">
                        Active filter
                    </span>
                )}
            </div>
            <form
                className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSearch();
                }}
            >
                <SearchField
                    value={searchKey}
                    onChange={(val) => handleSearchInput(val)}
                    placeholder="Search posts..."
                    className="max-w-[750px] flex-1"
                />

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
            <p className="mt-2 text-[11px] text-inactive-tab-text/90">Tip: press Enter to search quickly.</p>
        </div>
    );
};

export default PostSearchFilter;
