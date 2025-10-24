import { useEffect, useMemo, useState } from "react";
import { LazyImageLoader, Button } from "tccd-ui";
import { FaChevronLeft, FaChevronRight, FaClock, FaCalendar } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import format from "@/shared/utils/dateFormater";
import type Event from "@/shared/types/events";
import PosterCard from "@/shared/components/PosterCard";
import FullScreenViewer from "@/shared/components/MediaViewer/FullScreenDisplayer";

const SPONSOR_GAP_PERCENT = 2;
const AUTO_SCROLL_INTERVAL_MS = 3000;
const TRANSITION_DURATION_MS = 500;
const TRANSITION_RESET_DELAY_MS = 50;

interface EventDetailsPageProps {
    event: Event;
    onRegister?: (event: Event) => void;
}

const EventDetailsPage = ({ event, onRegister }: EventDetailsPageProps) => {
    const mediaItems = useMemo(() => {
        const poster = event.eventPoster ? [event.eventPoster] : [];
        const media = (event.media || []).filter(Boolean);
        if (poster.length === 0) {
            return media;
        }
        return [...poster, ...media];
    }, [event.media, event.eventPoster]);


    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
    const [sponsorIndex, setSponsorIndex] = useState(0);
    const [sponsorPerView, setSponsorPerView] = useState(3);
    const [isTransitioning, setIsTransitioning] = useState(true);

    const hasMultipleMedia = mediaItems.length > 1;
    const currentMedia = mediaItems[currentMediaIndex];

    const duplicatedSponsors = useMemo(() => {
        if (!event.sponsors || event.sponsors.length === 0) return [];
        return [...event.sponsors, ...event.sponsors];
    }, [event.sponsors]);

    const sponsorsToDisplay = useMemo(() => {
        if (!event.sponsors) return [];
        return event.sponsors.length > sponsorPerView ? duplicatedSponsors : event.sponsors;
    }, [duplicatedSponsors, event.sponsors, sponsorPerView]);

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
        if (!event.sponsors || event.sponsors.length <= sponsorPerView) return;

        const interval = setInterval(() => {
            setSponsorIndex((prevIndex) => prevIndex + 1);
        }, AUTO_SCROLL_INTERVAL_MS);

        return () => clearInterval(interval);
    }, [event.sponsors?.length, sponsorPerView]);

    useEffect(() => {
        setIsTransitioning(false);
        setSponsorIndex(0);
        const timeout = setTimeout(() => setIsTransitioning(true), TRANSITION_RESET_DELAY_MS);
        return () => clearTimeout(timeout);
    }, [sponsorPerView, event.sponsors?.length]);

    useEffect(() => {
        if (!event.sponsors || sponsorIndex < event.sponsors.length) return;

        const resetTimeout = setTimeout(() => {
            setIsTransitioning(false);
            setSponsorIndex(0);
            const reenableTimeout = setTimeout(() => {
                setIsTransitioning(true);
            }, TRANSITION_RESET_DELAY_MS);
            return () => clearTimeout(reenableTimeout);
        }, TRANSITION_DURATION_MS);

        return () => clearTimeout(resetTimeout);
    }, [sponsorIndex, event.sponsors?.length]);

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
        <article className="bg-white md:rounded-3xl shadow-md border border-gray-200 overflow-hidden">
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
            <section className="px-6 md:px-10 py-8">
                <div className="space-y-12">
                    <div className="border-b border-slate-200 pb-3">
                        {event.category && (
                            <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
                                {event.category}
                            </span>
                        )}
                        <h1 className="mt-4 text-3xl md:text-4xl font-bold text-secondary">
                            {event.title}
                        </h1>
                        <p className="mt-3 text-[14px] md:text-lg text-gray-600 leading-relaxed">
                            {event.description}
                        </p>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                        <h2 className="text-[21px] md:text-[23px] lg:text-[25px] font-semibold text-secondary">
                            Track The Event
                        </h2>
                        <p className="text-gray-600 font-medium text-[13px] md:text-[15px] lg:text-[17px] mb-4">Keep an eye on the event's whereabouts</p>
                        <div className="flex md:gap-[2%] space-y-4 flex-wrap">
                            <div className="md:w-[49%] w-full">
                                <PosterCard
                                    title="Date"
                                    data={formattedDate + " at " + formattedTime}
                                    icon={<FaCalendar className="text-[#cd3a38] size-10 md:size-11 lg:size-12 transition-colors duration-300 ease-in-out group-hover:bg-sky-100 bg-sky-50 p-2 rounded-full" />}
                                />
                            </div>
                            <div className="md:w-[49%] w-full">
                                <PosterCard
                                    title="Location"
                                    data={event.location}
                                    icon={<IoLocationSharp className="text-[#cd3a38] size-10 md:size-11 lg:size-12 transition-colors duration-300 ease-in-out group-hover:bg-sky-100 bg-sky-50 p-2 rounded-full" />}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                        <h2 className="text-[21px] md:text-[23px] lg:text-[25px] font-semibold text-secondary">
                            Event Highlights
                        </h2>
                        <p className="text-gray-600 font-medium text-[13px] md:text-[15px] lg:text-[17px] mb-4">Showcase of some selected captures of our event preparations</p>
                        <div className="relative mt-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                            {currentMedia ? (
                                <div className={`aspect-[16/9] lg:aspect-[19/9] w-full transition-opacity duration-300 cursor-pointer`} onClick={() => setIsMediaViewerOpen(true)}>
                                    <LazyImageLoader
                                        key={currentMedia}
                                        src={currentMedia}
                                        alt={event.title}
                                        width="100%"
                                        height="100%"
                                        className="h-full w-full"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-[16/9] flex items-center justify-center bg-white text-gray-400">
                                    <p>No media available for this event</p>
                                </div>
                            )}
                        </div>
                        {hasMultipleMedia && (
                            <div className="flex justify-center gap-2 items-center mt-4">
                                <FaChevronLeft className="size-4 md:size-5 cursor-pointer" onClick={handlePrev} />
                                <p className="text-center text-[12px] md:text-[13px] lg:text-[14px] text-gray-500">
                                    {currentMediaIndex + 1} of {mediaItems.length}
                                </p>
                                <FaChevronRight className="md:size-5 cursor-pointer" onClick={handleNext} />
                            </div>
                        )}
                    </div>

                    <div className={`flex flex-col flex-1 justify-end`}>
                        <p className="text-[21px] md:text-[23px] lg:text-[25px] font-semibold text-secondary text-center mb-4">Sponsored By</p>
                        <div className="overflow-hidden w-full">
                            <div
                                className="flex"
                                style={{
                                    gap: `${SPONSOR_GAP_PERCENT}%`,
                                    transform: `translateX(-${translatePercentage}%)`,
                                    transition: isTransitioning ? `transform ${TRANSITION_DURATION_MS}ms ease-in-out` : "none"
                                }}
                            >
                                {(event.sponsors?.length ?? 0) === 0 ? (
                                    <p className="text-center text-[14px] w-full md:text-[16px] lg:text-[18px] font-semibold">No sponsors for this event yet</p>
                                ) : (
                                    sponsorsToDisplay.map((sponsor, idx) => (
                                        <div
                                            key={`${sponsor.id}-${idx}`}
                                            className="flex-none text-center"
                                            style={{ flex: `0 0 ${sponsorItemWidth}%` }}
                                        >
                                            <div className="aspect-[16/9] mb-3">
                                                <LazyImageLoader
                                                    src={sponsor.banner}
                                                    alt={sponsor.companyName}
                                                    width="100%"
                                                    height="100%"
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            </div>
                                            <p className="text-[14px] md:text-[16px] lg:text-[18px] font-semibold">{sponsor.companyName}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {canRegister && (
                        <footer className="mt-10 flex flex-col gap-4 rounded-3xl border border-gray-200 bg-gray-50/70 p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span className="inline-flex items-center justify-center rounded-full bg-secondary/15 p-2 text-secondary">
                                    <FaClock className="size-4" />
                                </span>
                                <div>
                                    <p className="font-semibold text-gray-700">
                                        Seats Remaining
                                    </p>
                                    <p>
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
