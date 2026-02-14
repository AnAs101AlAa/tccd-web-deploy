import { useMemo, useState, useEffect } from "react";
import { useGetEventSponsors } from "@/shared/queries/events";
import { LazyImageLoader } from "tccd-ui";

export default function EventSponsorSection({ eventId }: { eventId: string }) {
    const SPONSOR_GAP_PERCENT = 2;
    const AUTO_SCROLL_INTERVAL_MS = 3000;
    const TRANSITION_DURATION_MS = 500;
    const TRANSITION_RESET_DELAY_MS = 50;

    const [isTransitioning, setIsTransitioning] = useState(true);
    const [sponsorIndex, setSponsorIndex] = useState(0);
    const [sponsorPerView, setSponsorPerView] = useState(3);

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

    const { data: sponsors, isLoading: isLoadingSponsors } = useGetEventSponsors(eventId);
    
    const duplicatedSponsors = useMemo(() => {
        if (!sponsors || sponsors.length === 0) return [];
        return [...sponsors, ...sponsors];
    }, [sponsors]);

    const sponsorItemWidth = useMemo(() => {
        const effectiveGap = SPONSOR_GAP_PERCENT * (sponsorPerView - 1);
        return sponsorPerView > 0 ? (100 - effectiveGap) / sponsorPerView : 100;
    }, [sponsorPerView]);

    const sponsorsToDisplay = useMemo(() => {
        if (!sponsors) return [];
        return sponsors.length > sponsorPerView ? duplicatedSponsors : sponsors;
    }, [duplicatedSponsors, sponsors, sponsorPerView]);

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

    if(sponsors?.length === 0) {
        return null;
    }

    return (
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
                                <div className="aspect mb-2 sm:mb-3 h-27">
                                    <LazyImageLoader
                                        src={sponsor.logo}
                                        alt={sponsor.companyName}
                                        width="100%"
                                        height="100%"
                                        objectClassName="object-contain"
                                        className="w-full h-full rounded-lg"
                                    />
                                </div>
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-gray-800 line-clamp-2">{sponsor.companyName}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}