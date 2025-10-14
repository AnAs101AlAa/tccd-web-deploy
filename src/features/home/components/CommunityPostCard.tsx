import { FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button } from "tccd-ui";
import type { CommunityPostCardProps } from "@/shared/types";

export const CommunityPostCard = ({ id, createdOn, name, description, postMedia }: CommunityPostCardProps) => {
    console.log(id)
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('');
    };

    return (
        <div className="rounded-2xl w-full bg-white shadow-lg flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300">
            {postMedia?.[0] !== "" ? (
                <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-72 overflow-hidden">
                    {postMedia[0].endsWith(".mp4") || postMedia[0].endsWith(".webm") ? (
                        <video
                            src={postMedia[0]}
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    ) : (
                        <img
                            src={postMedia[0] ?? "/placeholder.jpg"}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                    )}
                </div>
            ) : (
                <div className="h-48 sm:h-56 md:h-64 w-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">No Image Available</span>
                </div>
            )}

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
                <Button
                    buttonText="Read More"
                    onClick={handleClick}
                    type="secondary"
                    width="full"
                />
            </div>
        </div>
    );
};

export default CommunityPostCard;
