import { useEffect, useMemo, useState } from "react";
import { LazyImageLoader, Button, FullScreenViewer } from "tccd-ui";
import { FaChevronLeft, FaChevronRight, FaClock, FaCalendar, FaHandshake } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import format from "@/shared/utils/dateFormater";
import type Event from "@/shared/types/events";
import PosterCard from "@/shared/components/PosterCard";
import { useGetEventSponsors } from "@/shared/queries/events/eventQueries";

const SPONSOR_GAP_PERCENT = 2;
const AUTO_SCROLL_INTERVAL_MS = 3000;
const TRANSITION_DURATION_MS = 500;
const TRANSITION_RESET_DELAY_MS = 50;

interface EventDetailsPageProps {
    event: Event;
    onRegister?: (event: Event) => void;
}

const EventDetailsPage = ({ event, onRegister }: EventDetailsPageProps) => {
    const { data: sponsors, isLoading: isLoadingSponsors } = useGetEventSponsors(event.id);

    const mediaItems = useMemo(() => {
        return event.eventImage ? [event.eventImage] : [];
    }, [event.eventImage]);


    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
    const [sponsorIndex, setSponsorIndex] = useState(0);
    const [sponsorPerView, setSponsorPerView] = useState(3);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const hasMultipleMedia = mediaItems.length > 1;
    const currentMedia = mediaItems[currentMediaIndex];

    const duplicatedSponsors = useMemo(() => {
        if (!sponsors || sponsors.length === 0) return [];
        return [...sponsors, ...sponsors];
    }, [sponsors]);

    const sponsorsToDisplay = useMemo(() => {
        if (!sponsors) return [];
        return sponsors.length > sponsorPerView ? duplicatedSponsors : sponsors;
    }, [duplicatedSponsors, sponsors, sponsorPerView]);

    useEffect(() => {
        const updateSponsorPerView = () => {
            if (window.innerWidth >= 1024) {
                setSponsorPerView(3);
            } else if (window.innerWidth >= 768) {
                setSponsorPerView(2);
            } else {
                setSponsorPerView(1);
            }
        };

        updateSponsorPerView();
        window.addEventListener("resize", updateSponsorPerView);
        return () => window.removeEventListener("resize", updateSponsorPerView);
    }, []);

    const sponsorItemWidth = useMemo(() => {
        const effectiveGap = SPONSOR_GAP_PERCENT * (sponsorPerView - 1);
        return sponsorPerView > 0 ? (100 - effectiveGap) / sponsorPerView : 100;
    }, [sponsorPerView]);

    const translatePercentage = useMemo(
        () => Number((sponsorIndex * (sponsorItemWidth + SPONSOR_GAP_PERCENT)).toFixed(4)),
        [sponsorIndex, sponsorItemWidth]
    );

    useEffect(() => {
        if (!sponsors || sponsors.length <= sponsorPerView) return;

        const interval = setInterval(() => {
            setSponsorIndex((prevIndex) => prevIndex + 1);
        }, AUTO_SCROLL_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [sponsors?.length, sponsorPerView]);

    useEffect(() => {
        setIsTransitioning(false);
        setSponsorIndex(0);
        const timeout = setTimeout(() => setIsTransitioning(true), TRANSITION_RESET_DELAY_MS);
        return () => clearTimeout(timeout);
    }, [sponsorPerView, sponsors?.length]);

    useEffect(() => {
        if (!sponsors || sponsorIndex < sponsors.length) return;

        const resetTimeout = setTimeout(() => {
            setIsTransitioning(false);
            setSponsorIndex(0);
            const reenableTimeout = setTimeout(() => {
                setIsTransitioning(true);
            }, TRANSITION_RESET_DELAY_MS);
            return () => clearTimeout(reenableTimeout);
        }, TRANSITION_DURATION_MS);

        return () => clearTimeout(resetTimeout);
    }, [sponsorIndex, sponsors?.length]);

    const canRegister = useMemo(() => {
        const eventDate = new Date(event.date);
        const now = new Date();
        return now <= eventDate;
    }, [event.date]);

    const formattedDate = format(event.date, "date");
    const formattedTime = format(event.date, "hour");

    const handlePrev = () => {
        if (!hasMultipleMedia) return;
        setTimeout(() => {
            setCurrentMediaIndex((prev) =>
                prev === 0 ? mediaItems.length - 1 : prev - 1
            );
        }, 150);
    };

    const handleNext = () => {
        if (!hasMultipleMedia) return;
        setTimeout(() => {
            setCurrentMediaIndex((prev) =>
                prev === mediaItems.length - 1 ? 0 : prev + 1
            );
        }, 150);
    };

    return (
        <article className="bg-white md:rounded-3xl shadow-lg border border-gray-200 overflow-hidden pb-4 -mb-4">
            {isMediaViewerOpen && (
                <FullScreenViewer
                    isOpen={isMediaViewerOpen}
                    items={mediaItems.map((src, idx) => ({
                        id: idx,
                        type: src.endsWith(".mp4") ? "video" : "image",
                        src,
                    }))}
                    index={currentMediaIndex}
                    setIndex={setCurrentMediaIndex}
                    onClose={() => setIsMediaViewerOpen(false)}
                />
            )}
            <section className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10">
                <div className="space-y-6 md:space-y-10">
                    <div className="border-b border-slate-200 pb-4 sm:pb-5">
                        <div className="flex items-start justify-between gap-1 sm:gap-2">
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary leading-tight flex-1">
                                {event.name}
                            </p>
                            {event.type && (
                                <span className="inline-block bg-secondary/10 text-secondary text-[12px] sm:text-xs font-semibold uppercase tracking-wide px-2.5 sm:px-3 py-1 mt-1 rounded-full flex-shrink-0">
                                    {event.type}
                                </span>
                            )}
                        </div>
                        <p className="text-[13px] sm:text-[14px] md:text-[15px] mt-2 text-gray-600">
                            {event.description}
                        </p>
                    </div>

                    <div className="-mt-4 md:-mt-8">
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-[25px] font-semibold text-secondary">
                            Track The Event
                        </p>
                        <p className="text-gray-600 font-medium text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px]">Keep an eye on the event's whereabouts</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3">
                            <div className="w-full">
                                <PosterCard
                                    title="Date"
                                    data={formattedDate + " at " + formattedTime}
                                    icon={<FaCalendar className="text-primary size-10 md:size-12 transition-colors duration-300 ease-in-out group-hover:bg-sky-100 bg-sky-50 p-2 rounded-full" />}
                                />
                            </div>
                            <div className="w-full">
                                <PosterCard
                                    title="Location"
                                    data={event.locations ? event.locations.join(", ") : "TBD"}
                                    icon={<IoLocationSharp className="text-primary size-10 md:size-12 transition-colors duration-300 ease-in-out group-hover:bg-sky-100 bg-sky-50 p-2 rounded-full" />}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[25px] font-semibold text-secondary">
                            Event Highlights
                        </h2>
                        <p className="text-gray-600 font-medium text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px]">Showcase of some selected captures of our event preparations</p>
                        <div className="relative mt-2 sm:mt-3 overflow-hidden rounded-lg sm:rounded-xl border border-gray-200 p-1.5 sm:p-2 shadow-md bg-gradient-to-bl from-primary to-secondary">
                            {currentMedia ? (
                                <div className="aspect-[16/9] sm:aspect-[16/9] lg:aspect-[19/9] w-full cursor-pointer active:scale-[0.99] sm:hover:scale-[1.01] transition-all duration-300" onClick={() => setIsMediaViewerOpen(true)}>
                                    <LazyImageLoader
                                        key={currentMedia}
                                        src={currentMedia}
                                        alt={event.name}
                                        width="100%"
                                        height="100%"
                                        className="h-full w-full rounded-md sm:rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-[16/9] flex items-center justify-center bg-white text-gray-400 rounded-md sm:rounded-lg">
                                    <p className="text-xs sm:text-sm">No media available for this event</p>
                                </div>
                            )}
                        </div>
                        {hasMultipleMedia && (
                            <div className="flex justify-center gap-3 sm:gap-4 items-center mt-3 sm:mt-4">
                                <button
                                    onClick={handlePrev}
                                    className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                    aria-label="Previous image"
                                >
                                    <FaChevronLeft className="size-4 sm:size-5 text-gray-600" />
                                </button>
                                <p className="text-center text-xs sm:text-sm md:text-base text-gray-600 font-medium min-w-[80px] sm:min-w-[100px]">
                                    {currentMediaIndex + 1} of {mediaItems.length}
                                </p>
                                <button
                                    onClick={handleNext}
                                    className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                                    aria-label="Next image"
                                >
                                    <FaChevronRight className="size-4 sm:size-5 text-gray-600" />
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col space-y-3 sm:space-y-4">
                        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-[25px] font-semibold text-secondary text-center">Sponsored By</h2>
                        <div className="overflow-hidden w-full px-2 sm:px-0">
                            <div
                                className="flex"
                                style={{
                                    gap: `${SPONSOR_GAP_PERCENT}%`,
                                    transform: `translateX(-${translatePercentage}%)`,
                                    transition: isTransitioning ? `transform ${TRANSITION_DURATION_MS}ms ease-in-out` : "none"
                                }}
                            >
                                {isLoadingSponsors ? (
                                    <p className="text-center text-sm sm:text-base md:text-lg w-full font-semibold text-gray-600">Loading sponsors...</p>
                                ) : (sponsors?.length ?? 0) === 0 ? (
                                    <p className="text-center text-sm sm:text-base md:text-lg w-full font-semibold text-gray-600">No sponsors for this event yet</p>
                                ) : (
                                    sponsorsToDisplay.map((sponsor, idx) => (
                                        <div
                                            key={`${sponsor.id}-${idx}`}
                                            className="flex-none text-center"
                                            style={{ flex: `0 0 ${sponsorItemWidth}%` }}
                                        >
                                            <div className="aspect-[16/9] mb-2 sm:mb-3">
                                                {sponsor.logo ? (
                                                    <LazyImageLoader
                                                        src={sponsor.logo}
                                                        alt={sponsor.companyName}
                                                        width="100%"
                                                        height="100%"
                                                        className="w-full h-full object-contain rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                                                        <FaHandshake className="text-gray-400 text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2" />
                                                        <p className="text-gray-500 text-[10px] sm:text-xs md:text-sm font-medium">Sponsor</p>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-800 line-clamp-2">{sponsor.companyName}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {canRegister && (
                        <footer className="mt-6 sm:mt-8 md:mt-10 flex flex-col gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100/70 p-4 sm:p-5 md:p-6 sm:flex-row sm:items-center sm:justify-between shadow-sm">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <span className="inline-flex items-center justify-center rounded-full bg-secondary/15 p-2 sm:p-2.5 text-secondary flex-shrink-0">
                                    <FaClock className="size-4 sm:size-5" />
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 text-sm sm:text-base">
                                        Seats Remaining
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                        {Math.max(event.capacity - event.registeredCount, 0)} of {event.capacity} spots available
                                    </p>
                                </div>
                            </div>

                            <Button
                                buttonText="Register Now"
                                type="primary"
                                width="medium"
                                onClick={() => onRegister?.(event)}
                            />
                        </footer>
                    )}
                </div>
            </section>
        </article>
    );
};

export default EventDetailsPage;
