import { Button } from "tccd-ui";
import type { EventGalleryCardProps } from "@/shared/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const EventGalleryCard = ({
    id,
    eventName,
    eventType,
    mediaUrl,
}: EventGalleryCardProps) => {
    const navigate = useNavigate();
    const [isVideoLoaded, setIsVideoLoaded] = useState(false);

    const isVideo = mediaUrl?.endsWith(".mp4") || mediaUrl?.endsWith(".webm") || false;

    return (
        <div className="w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
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

                <div className="absolute top-4 left-4">
                    <span className="inline-block bg-primary text-text px-4 py-2 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wide shadow-lg">
                        {eventType}
                    </span>
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
                <h3 className="text-gray-900 text-xl sm:text-2xl md:text-2xl font-bold">
                    {eventName}
                </h3>

                <div className="flex justify-end">
                    <Button
                        buttonText="Details"
                        onClick={() => navigate(`/gallery/view/${id}`)}
                        type="secondary"
                        width="auto"
                    />
                </div>
            </div>
        </div>
    );
};

export default EventGalleryCard;
