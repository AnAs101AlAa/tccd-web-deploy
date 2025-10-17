import { LazyImageLoader, Button } from "tccd-ui";
import type Event from "@/shared/types/events";
import format from "@/shared/utils/dateFormater";
import { FaClock, FaCalendar } from "react-icons/fa";
import { useRef, useEffect, useState } from "react";

interface Props {
  event: Event;
  onBookNow: () => void;
  onLearnMore: () => void;
}

const UpcomingEventCard: React.FC<Props> = ({
  event,
  onBookNow,
  onLearnMore,
}) => {
  const wholeInfoRef = useRef<HTMLDivElement>(null);
  const mainInfoRef = useRef<HTMLDivElement>(null);
  const [translateValue, setTranslateValue] = useState(260);
  const [isTapped, setIsTapped] = useState(false);
  
  useEffect(() => {
    const wholeEl = wholeInfoRef.current;
    const mainEl = mainInfoRef.current;
    if (!wholeEl || !mainEl) return;

    const update = () => {
      const wholeH = wholeEl.scrollHeight;
      const mainH = mainEl.getBoundingClientRect().height;
      const diff = wholeH - mainH - 16;
      setTranslateValue(diff > 0 ? diff : 0);
    };

    update();

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(wholeEl);
      ro.observe(mainEl);
      return () => ro.disconnect();
    }

    window.addEventListener("resize", update);
    window.addEventListener("load", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("load", update);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wholeInfoRef.current &&
        !wholeInfoRef.current.contains(e.target as Node)
      ) {
        setIsTapped(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div
      className="relative w-full h-[240px] md:h-[270px] lg:h-[300px] group bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer transition-transform duration-300 flex flex-col"
    >
      <LazyImageLoader
        src={event.eventPoster}
        alt={event.title}
        width="100%"
        height="100%"
        className="absolute top-0 inset-0"
      />

      <span
        className="absolute top-2 left-2 text-white text-xs px-3 py-1 rounded-2xl bg-secondary"
      >
        Workshops
      </span>

      <div
        ref={wholeInfoRef}
        onClick={() => setIsTapped(!isTapped)}
        className={`absolute bottom-0 flex flex-col justify-start p-2 transition-all duration-500 ease-in-out group-hover:translate-y-0 ${
          isTapped ? "translate-y-0" : "translate-y-[var(--y)]"
        } bg-background space-y-3`}
        style={{ "--y": `${translateValue}px` } as React.CSSProperties}
      >
        <div className="space-y-3" ref={mainInfoRef}>
          <h2 className="font-bold text-[#285D7E] text-[20px] md:text[22px] lg:text-[24px]">
            {event.title}
          </h2>

          <div className="flex items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <FaCalendar className="size-3.5 md:size-4" />
              <span className="text-[13px] md:text-[14px] lg:text-[15px]">{format(event.date, "date")}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaClock className="size-3.5 md:size-4" />
              <span className="text-[13px] md:text-[14px] lg:text-[15px]">{format(event.date, "hour")}</span>
            </div>
          </div>
        </div>

        <div className="transition-all duration-500 ease-in-out transform">
          <p className="text-[13px] md:text-[14px] lg:text-[15px] leading-relaxed text-gray-700">
            {event.description}
          </p>

          <div className="flex gap-3 mt-3">
            <Button
              buttonText="Book Now"
              type="primary"
              width="small"
              onClick={() => {
                onBookNow();
              }}
            />

            <Button
              buttonText="Learn More"
              type="secondary"
              width="small"
              onClick={() => {
                onLearnMore();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventCard;
