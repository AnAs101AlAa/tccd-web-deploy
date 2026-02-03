import { Button, SearchField } from "tccd-ui";
import { IoSearch } from "react-icons/io5";

export interface PostSearchFilterProps {
    searchKey: string;
    onSearchChange: (value: string) => void;
    onSearch: () => void;
}

export const PostSearchFilter = ({
    searchKey,
    onSearchChange,
    onSearch,
}: PostSearchFilterProps) => {
    const handleSearchInput = (val: string) => {
        onSearchChange(val);
    };

    return (
        <div className="w-full bg-white p-4 rounded-xl shadow-sm">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                <SearchField
                    value={searchKey}
                    onChange={(val) => handleSearchInput(val)}
                    placeholder="Search posts..."
                    className="max-w-[750px] flex-1"
                />

                <div className="flex gap-3 items-center w-full md:w-auto">
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
            </div>
        </div>
    );
};

export default PostSearchFilter;