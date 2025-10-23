import { useMemo, useState } from "react";
import { LazyImageLoader, Button } from "tccd-ui";
import { FaArrowLeft, FaArrowRight, FaClock, FaCalendarAlt } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import format from "@/shared/utils/dateFormater";
import type Event from "@/shared/types/events";

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
    const [isTransitioning, setIsTransitioning] = useState(false);

    const hasMultipleMedia = mediaItems.length > 1;
    const currentMedia = mediaItems[currentMediaIndex];
    const canRegister = useMemo(() => {
        const eventDate = new Date(event.date);
        const now = new Date();
        return now <= eventDate;
    }, [event.date]);
    const formattedDate = format(event.date, "date");
    const formattedTime = format(event.date, "hour");

    const handlePrev = () => {
        if (!hasMultipleMedia) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentMediaIndex((prev) =>
                prev === 0 ? mediaItems.length - 1 : prev - 1
            );
        }, 150);
    };

    const handleNext = () => {
        if (!hasMultipleMedia) return;
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentMediaIndex((prev) =>
                prev === mediaItems.length - 1 ? 0 : prev + 1
            );
        }, 150);
    };

    return (
        <article className="bg-white rounded-3xl shadow-md border border-gray-200 overflow-hidden">
            <header className="px-6 md:px-10 pt-8 pb-6 border-b border-gray-100 bg-gradient-to-b from-white to-gray-50">
                {event.category && (
                    <span className="inline-block bg-secondary/10 text-secondary text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full">
                        {event.category}
                    </span>
                )}
                <h1 className="mt-4 text-3xl md:text-4xl font-bold text-secondary">
                    {event.title}
                </h1>
                <p className="mt-3 text-base md:text-lg text-gray-600 leading-relaxed">
                    {event.description}
                </p>
            </header>

            <section className="px-6 md:px-10 py-8">
                <div className="space-y-8">
                    <div>
                        <h2 className="text-xl font-semibold text-secondary mb-4">
                            Event Highlights
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
                                <span className="mt-1 rounded-full bg-secondary/15 p-3 text-secondary">
                                    <FaCalendarAlt className="size-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                        Date
                                    </p>
                                    <p className="text-base md:text-lg font-medium text-gray-800">
                                        {formattedDate}
                                    </p>
                                    <p className="text-sm text-gray-500">{formattedTime}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-gray-50/80 p-4">
                                <span className="mt-1 rounded-full bg-primary/10 p-3 text-primary">
                                    <IoLocationSharp className="size-5" />
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                                        Location
                                    </p>
                                    <p className="text-base md:text-lg font-medium text-gray-800">
                                        {event.location || "TBA"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-secondary">
                                Event Gallery
                            </h2>
                            {hasMultipleMedia && (
                                <span className="text-sm text-gray-500">
                                    {currentMediaIndex + 1} / {mediaItems.length}
                                </span>
                            )}
                        </div>

                        <div className="relative mt-4 overflow-hidden rounded-3xl border border-gray-200 bg-gray-100">
                            {currentMedia ? (
                                <div className={`aspect-[16/9] lg:aspect-[19/9] w-full transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`} onTransitionEnd={() => setIsTransitioning(false)}>
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

                            {hasMultipleMedia && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-gray-600 shadow hover:text-secondary focus:outline-none"
                                        aria-label="Previous media"
                                    >
                                        <FaArrowLeft className="size-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-gray-600 shadow hover:text-secondary focus:outline-none"
                                        aria-label="Next media"
                                    >
                                        <FaArrowRight className="size-4" />
                                    </button>
                                </>
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
            </section>
        </article>
    );
};

export default EventDetailsPage;
