import type { EventGalleryCardProps } from "@/shared/types";
import { useState } from "react";
import Format from "@/shared/utils/dateFormater";

export const EventGalleryCard = ({
    id,
    eventName,
    eventType,
    mediaUrl,
    eventDescription,
    eventDate
}: EventGalleryCardProps) => {
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    const isVideo = mediaUrl?.endsWith(".mp4") || mediaUrl?.endsWith(".webm") || false;

    return (
        <div className="w-full rounded-2xl overflow-hidden shadow-lg hover:scale-[102%] cursor-pointer transition-all duration-300 bg-white h-full">
            <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                {mediaUrl ? (
                    <>
                        {isVideo ? (
                            <>
                                {!isVideoLoaded && (
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 z-5">
                                        <div className="relative w-full h-full overflow-hidden">
                                            <div
                                                className="absolute inset-[-100%] bg-gradient-to-br from-transparent via-white/60 to-transparent animate-shimmer"
                                                style={{
                                                    width: '200%',
                                                    height: '200%',
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                                <video
                                    src={mediaUrl}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    onLoadedData={() => setIsVideoLoaded(true)}
                                    className={`w-full h-full object-cover transition-opacity duration-300 ${isVideoLoaded ? "opacity-100" : "opacity-0"
                                        }`}
                                />
                            </>
                        ) : (
                            <img
                                src={mediaUrl}
                                alt={eventName}
                                className="w-full h-full object-cover"
                            />
                        )}
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200">
                        <div className="relative w-full h-full overflow-hidden">
                            <div
                                className="absolute inset-[-100%] bg-gradient-to-br from-transparent via-white/60 to-transparent animate-shimmer"
                                style={{
                                    width: '200%',
                                    height: '200%',
                                }}
                            ></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-3 space-y-1">
                <div className="flex gap-1 items-center">
                    <span className="text-primary text-[13px] md:text-[15px] font-semibold">
                        {eventType}
                    </span>
                    <span className="text-gray-400">|</span>
                    <span className="text-inactive-tab-text text-[12px] md:text-[14px] font-semibold">
                        {Format(eventDate, "stringed")}
                    </span>
                </div>
                <h2 className="text-[20px] md:text-[24px] font-bold text-gray-800 mb-2">
                    {eventName}
                </h2>
                <p className="text-gray-600 text-[13px] md:text-[15px] line-clamp-3">
                    {eventDescription}
                </p>
            </div>
        </div>
    );
};

export default EventGalleryCard;
