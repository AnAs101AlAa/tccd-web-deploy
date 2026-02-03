import { LazyImageLoader, Button } from "tccd-ui";
import type Event from "@/shared/types/events";
import { useRef, useEffect, useState } from "react";
import { MdCalendarMonth } from "react-icons/md";
import EVENT_TYPES from "@/constants/EventTypes";
import format from "@/shared/utils/dateFormater";

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
      className="relative w-full h-[240px] md:h-[270px] lg:h-[300px] group bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform duration-300 flex flex-col"
    >
      <LazyImageLoader
        src={event.eventImage}
        alt={event.name}
        width="100%"
        height="100%"
        className="absolute top-0 inset-0"
      />

      <div
        ref={wholeInfoRef}
        onClick={() => setIsTapped(!isTapped)}
        className={`absolute bottom-0 w-full flex flex-col justify-start p-2 px-3 transition-all duration-500 ease-in-out group-hover:translate-y-0 ${
          isTapped ? "translate-y-0" : "translate-y-[var(--y)]"
        } bg-background space-y-2`}
        style={{ "--y": `${translateValue}px` } as React.CSSProperties}
      >
        <div ref={mainInfoRef}>
          <div className="flex gap-1 items-center">
              <span className="text-primary text-[13px] md:text-[15px] font-semibold">
                  {EVENT_TYPES.find((type) => type.value === event.type)?.label ||
                    "Other"}
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-inactive-tab-text text-[12px] md:text-[14px] font-semibold">
                  <MdCalendarMonth className="text-inactive-tab-text mr-1 size-3.5 lg:size-4 -mt-1 inline" />
                  {format(event.date, "stringed")}
              </span>
          </div>
          <h2 className="font-bold text-contrast text-[22px] md:text-[23px] lg:text-[24px] mb-1">
            {event.name}
          </h2>
        </div>

        <div className="transition-all duration-500 ease-in-out transform">
          <p className="text-[13px] md:text-[14px] lg:text-[15px] leading-relaxed text-gray-700">
            {event.description}
          </p>

          <div className="flex gap-3 mt-4">
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
