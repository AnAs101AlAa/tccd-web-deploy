import { FaCalendarAlt } from "react-icons/fa";
import { Button, LazyImageLoader } from "tccd-ui";
import type { CommunityPostCardProps } from "@/shared/types";
import coverImage from "@/assets/TCCD_logo.svg";

// const placeholderImage = "../../../assets/cover.png"
// 

export const PostManagmentCard = ({ id, createdOn, name, description, postMedia }: CommunityPostCardProps) => {
    const handleEdit = () => {
        console.log('Edit post', id);
        // TODO: Implement edit functionality
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            console.log('Delete post', id);
            // TODO: Implement delete functionality
        }
    };

    return (
        <div className="rounded-2xl w-full bg-white shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
                {postMedia?.[0] ? (
                    <LazyImageLoader
                        src={postMedia[0]}
                        alt={name}
                        className="w-full h-full"
                        width="100%"
                        height="100%"
                    />
                ) : (
                    <img
                        src={coverImage}
                        alt="No image available"
                        className="w-full h-full object-scale-down"
                    />
                )}
            </div>

            <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-contrast mb-3 line-clamp-2">
                    {name}
                </h3>

                <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-3">
                    <FaCalendarAlt className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-primary flex-shrink-0" />
                    <span className="line-clamp-1">
                        {new Date(createdOn).toLocaleString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </span>
                </div>

                <p className="text-gray-700 flex-1 text-sm sm:text-base leading-relaxed line-clamp-3">
                    {description.length > 150
                        ? `${description.substring(0, 150)}...`
                        : description}
                </p>
            </div>

            <div className="border-t border-gray-100 p-4 sm:p-5 md:p-6 pt-3 sm:pt-4">
                <div className="flex gap-2">
                    <div className="flex-1">
                        <Button
                            buttonText="Edit"
                            onClick={handleEdit}
                            type="secondary"
                            width="full"
                        />
                    </div>
                    <div className="flex-1">
                        <Button
                            buttonText="Delete"
                            onClick={handleDelete}
                            type="primary"
                            width="full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};